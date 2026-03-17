import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import { AppState, Platform, type AppStateStatus } from "react-native"
import { userService } from "@/services/user.service"
import { router } from "expo-router"
import { PushNotification } from "@/types/notification.types"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

let lastSyncedDevicePushToken: string | null = null

async function ensureAndroidChannelAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
        })
    }
}

export type PushTokenSyncResult = {
    permissionStatus: Notifications.PermissionStatus
    canAskAgain: boolean
    token: string | null
    synced: boolean
}

export async function syncPushTokenWithBackend(options?: {
    requestPermissions?: boolean
}): Promise<PushTokenSyncResult> {
    await ensureAndroidChannelAsync()

    const initial = await Notifications.getPermissionsAsync()
    let permissionStatus = initial.status
    const canAskAgain = initial.canAskAgain ?? false

    if (permissionStatus !== "granted" && options?.requestPermissions) {
        const requested = await Notifications.requestPermissionsAsync()
        permissionStatus = requested.status
    }

    if (permissionStatus !== "granted") {
        return { permissionStatus, canAskAgain, token: null, synced: false }
    }

    const tokenData = await Notifications.getDevicePushTokenAsync()
    const token = tokenData.data

    if (token && token !== lastSyncedDevicePushToken) {
        await userService.addPushToken({ token })
        lastSyncedDevicePushToken = token
        return { permissionStatus, canAskAgain, token, synced: true }
    }

    return { permissionStatus, canAskAgain, token, synced: false }
}

export const usePushNotifications = () => {
    const notificationListener = useRef<Notifications.EventSubscription>(null)
    const responseListener = useRef<Notifications.EventSubscription>(null)
    const appStateListener = useRef<{ remove: () => void } | null>(null)

    useEffect(() => {
        // On mount, prompt the user to enable notifications
        syncPushTokenWithBackend({ requestPermissions: true }).catch(console.error)

        // If user enables notifications via OS settings, sync the token
        appStateListener.current = AppState.addEventListener(
            "change",
            (state: AppStateStatus) => {
                if (state !== "active") return
                syncPushTokenWithBackend({ requestPermissions: false }).catch(console.error)
            },
        )

        // Handle notifications in foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("[Push] Notification received:", notification)
                // todo: invalidate notifications query
            },
        )

        // Handle notification press in foreground
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                if (response?.notification.request.content.data) {
                    const data = response.notification.request.content.data as unknown as PushNotification;
                    if (data.redirectPath) {
                      router.push(data.redirectPath);
                    } else {
                      console.error('Incorrect or missing redirect path in notification');
                    }
                  }
            },
        )

        return () => {
            appStateListener.current?.remove()
            notificationListener.current?.remove()
            responseListener.current?.remove()
        }
    }, [])
}

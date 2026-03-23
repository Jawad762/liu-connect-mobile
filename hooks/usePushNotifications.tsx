import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import { AppState, Platform, type AppStateStatus } from "react-native"
import { userService } from "@/services/user.service"
import { router } from "expo-router"
import { PushNotification } from "@/types/notification.types"
import messaging from '@react-native-firebase/messaging';
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/utils/query-keys";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

let lastSyncedDevicePushToken: string | null = null

export function resetPushTokenSyncCache() {
    lastSyncedDevicePushToken = null
}

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

    const token = await messaging().getToken()

    if (token && token !== lastSyncedDevicePushToken) {
        await userService.addPushToken({ token })
        lastSyncedDevicePushToken = token
        return { permissionStatus, canAskAgain, token, synced: true }
    }

    return { permissionStatus, canAskAgain, token, synced: false }
}

export const usePushNotifications = () => {
    const responseListener = useRef<Notifications.EventSubscription>(null)
    const appStateListener = useRef<{ remove: () => void } | null>(null)
    const queryClient = useQueryClient()

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

        // Intercept foreground notifications on both platforms 
        // Display them on Android via a local notification, and on iOS via the firebase.json file.
        const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
            console.log("[Push] FCM foreground message:", remoteMessage)
            if (Platform.OS === "android") {
                try {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: remoteMessage.notification?.title ?? "",
                            body: remoteMessage.notification?.body ?? "",
                            data: remoteMessage.data,
                            sound: "default",
                        },
                        trigger: { channelId: "default" },
                    })
                } catch (e) {
                    console.error("[Push] scheduleNotificationAsync failed:", e)
                }
            }

            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        })

        // Handle FCM notification tap when app is in background
        const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
            (remoteMessage) => {
                console.log("[Push] Notification opened app from background:", remoteMessage)
                const data = remoteMessage.data as unknown as PushNotification
                if (data?.redirectPath) {
                    router.push(data.redirectPath)
                } else {
                    console.error("Incorrect or missing redirect path in notification")
                }
            },
        )

        // Handle tap on locally-scheduled notifications
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                if (response?.notification.request.content.data) {
                    const data = response.notification.request.content.data as unknown as PushNotification
                    if (data.redirectPath) {
                        router.push(data.redirectPath)
                    } else {
                        console.error("Incorrect or missing redirect path in notification")
                    }
                }
            },
        )

        return () => {
            appStateListener.current?.remove()
            unsubscribeForeground()
            unsubscribeOpenedApp()
            responseListener.current?.remove()
        }
    }, [])
}

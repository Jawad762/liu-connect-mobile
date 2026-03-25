import React, { useCallback, useState } from 'react'
import { ThemedView } from '@/components/reusable/themed-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActivityIndicator, Linking, Switch, View } from 'react-native'
import GeneralHeader from '@/components/reusable/general-header'
import { ThemedText } from '@/components/reusable/themed-text'
import * as ExpoNotifications from "expo-notifications"
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { useFocusEffect } from 'expo-router'

const fetchPermissionStatus = async () => {
    const { status } = await ExpoNotifications.getPermissionsAsync()
    return status === 'granted'
}

const Notifications = () => {
    const insets = useSafeAreaInsets()
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const { colorScheme = 'light' } = useColorScheme()

    useFocusEffect(
        useCallback(() => {
            // If the user navigates away before the fetch completes, skip state updates
            // to avoid "Can't perform a React state update on an unmounted component"
            let cancelled = false
            fetchPermissionStatus()
                .then((enabled) => {
                    if (!cancelled) setIsNotificationsEnabled(enabled)
                })
                .catch((e) => {
                    if (!cancelled) console.error('Failed to fetch notification permissions', e)
                })
                .finally(() => {
                    if (!cancelled) setIsLoading(false)
                })
            return () => { cancelled = true }
        }, [])
    )

    const enableNotifications = async () => {
        try {
            const initial = await ExpoNotifications.getPermissionsAsync()
            if (initial.status === 'granted') return
            if (!initial.canAskAgain) {
                Linking.openSettings()
                return
            }
            const result = await ExpoNotifications.requestPermissionsAsync()
            setIsNotificationsEnabled(result.status === 'granted')
        } catch (e) {
            console.error('Failed to enable notifications', e)
        }
    }

    const handleToggleNotifications = async () => {
        if (isNotificationsEnabled) {
            try {
                await Linking.openSettings()
            } catch (e) {
                console.error('Failed to open settings', e)
            }
        } else {
            await enableNotifications()
        }
    }

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4 border-b border-border dark:border-borderDark">
                <GeneralHeader title="Settings > Notifications" />
            </View>
            <View className='p-4 flex-row justify-between items-center'>
                {isLoading ? (
                    <ActivityIndicator size="small" color={Colors[colorScheme].accent} />
                ) : (
                    <>
                        <View className='flex-1 mr-4'>
                            <ThemedText className='text-xl font-sans-medium'>Receive notifications</ThemedText>
                            <ThemedText className='text-base text-muted dark:text-mutedDark mt-1'>
                                Likes, comments, replies, and new followers
                            </ThemedText>
                        </View>
                        <Switch value={isNotificationsEnabled} onValueChange={handleToggleNotifications} />
                    </>
                )}
            </View>
        </ThemedView>
    )
}

export default Notifications

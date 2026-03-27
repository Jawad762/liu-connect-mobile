import { ThemedView } from '@/components/reusable/themed-view'
import React from 'react'
import GeneralHeader from '@/components/reusable/general-header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Pressable, ScrollView, View } from 'react-native'
import { ThemedText } from '@/components/reusable/themed-text'
import { IconSymbol } from '@/components/reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'

const settings = () => {
    const insets = useSafeAreaInsets();
    const { colorScheme = 'light' } = useColorScheme();
    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4 border-b border-border dark:border-borderDark">
                <GeneralHeader title="Settings" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Notifications */}
                <Pressable onPress={() => router.push(screens.settings.notifications)} className='p-4 border-b-[0.25px] border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark'>
                    <View className='flex-row items-center gap-4'>
                        <IconSymbol name="bell" size={24} color={Colors[colorScheme].icon} />
                        <View className='flex-1'>
                            <ThemedText className='text-xl font-sans-medium'>Notifications</ThemedText>
                            <ThemedText className='text-muted dark:text-mutedDark'>Enable/Disable Push Notifications</ThemedText>
                        </View>
                    </View>
                </Pressable>

                {/* Account Settings */}
                <Pressable onPress={() => router.push(screens.settings.account)} className='p-4 border-b-[0.25px] border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark'>
                    <View className='flex-row items-center gap-4'>
                        <IconSymbol name="person" size={24} color={Colors[colorScheme].icon} />
                        <View className='flex-1'>
                            <ThemedText className='text-xl font-sans-medium'>Account Settings</ThemedText>
                            <ThemedText className='text-muted dark:text-mutedDark'>Change your account settings and preferences</ThemedText>
                        </View>
                    </View>
                </Pressable>

                {/* Blocked Users Settings */}
                <Pressable onPress={() => router.push(screens.settings.blocked)} className='p-4 border-b-[0.25px] border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark'>
                    <View className='flex-row items-center gap-4'>
                        <IconSymbol name="lock" size={24} color={Colors[colorScheme].icon} />
                        <View className='flex-1'>
                            <ThemedText className='text-xl font-sans-medium'>Blocked Users</ThemedText>
                            <ThemedText className='text-muted dark:text-mutedDark'>View and manage blocked users</ThemedText>
                        </View>
                    </View>
                </Pressable>
            </ScrollView>
        </ThemedView>
    )
}

export default settings
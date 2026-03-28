import React from 'react'
import { Image, Pressable, View } from 'react-native'
import { User } from '@/types/user.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme-colors'

const UserCardHorizontal = ({ user }: { user: User }) => {
    const { colorScheme = 'light' } = useColorScheme()

    return (
        <Pressable
            onPress={() => router.push(screens.user.profile(user.id))}
            className="w-72 overflow-hidden rounded-3xl border border-border dark:border-borderDark mr-3"
        >
            <View className="h-24 w-full bg-background dark:bg-backgroundDark">
                {user.cover_url && (
                    <Image
                        source={{ uri: user.cover_url }}
                        resizeMode="cover"
                        className="h-full w-full"
                    />
                )}
            </View>

            <View className="px-4 pb-4">
                <View className="-mt-8 mb-2">
                    <ProfileIcon avatarUrl={user.avatar_url} className="w-16 h-16 border-4 border-black" />
                </View>

                <View className="flex-row items-center gap-1.5">
                    <ThemedText className="text-lg font-bold flex-shrink" numberOfLines={1}>
                        {user.name || 'Unknown User'}
                    </ThemedText>
                </View>
                {user.bio && (
                    <ThemedText className="text-base mt-2" numberOfLines={2}>
                        {user.bio}
                    </ThemedText>
                )}
            </View>
        </Pressable>
    )
}

export default UserCardHorizontal

import React from 'react'
import { Pressable, View } from 'react-native'
import { User } from '@/types/user.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'

const UserCardVertical = ({ user }: { user: User }) => {
    return (
        <Pressable
            onPress={() => router.push(screens.user.profile(user.id))}
            className="flex-row items-center gap-3 px-4 py-3"
        >
            <ProfileIcon avatarUrl={user.avatar_url} className="w-12 h-12" />
            <View className="flex-1">
                <ThemedText className="text-base font-semibold">{user.name}</ThemedText>
                {user.bio && (
                    <ThemedText className="text-sm text-muted dark:text-mutedDark" numberOfLines={1}>
                        {user.bio}
                    </ThemedText>
                )}
            </View>
        </Pressable>
    )
}

export default UserCardVertical

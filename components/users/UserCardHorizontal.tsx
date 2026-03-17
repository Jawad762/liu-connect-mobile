import React from 'react'
import { Pressable } from 'react-native'
import { User } from '@/types/user.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'

const UserCardHorizontal = ({ user }: { user: User }) => {
    return (
        <Pressable
            onPress={() => router.push(screens.user.profile(user.id))}
            className="items-center gap-1.5 px-2 py-2 w-20"
        >
            <ProfileIcon avatarUrl={user.avatar_url} className="w-14 h-14" />
            <ThemedText className="text-xs text-center" numberOfLines={1}>
                {user.name}
            </ThemedText>
        </Pressable>
    )
}

export default UserCardHorizontal

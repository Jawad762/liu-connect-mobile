import React from 'react'
import { ThemedText } from '../reusable/themed-text'
import { Pressable } from 'react-native'
import ProfileIcon from '../reusable/profile-icon'
import { User } from '@/types/user.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'

const UserCard = ({ user }: { user: User }) => {
    return (
        <Pressable onPress={() => router.push(screens.user.details(user.id))} className="justify-center items-center gap-1">
            <ProfileIcon avatarUrl={user.avatar_url} className='w-20 h-20'/>
            <ThemedText>{user.name}</ThemedText>
        </Pressable>
    )
}

export default UserCard
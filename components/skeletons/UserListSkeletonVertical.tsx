import React from 'react'
import { View } from 'react-native'
import UserCardSkeletonVertical from './UserCardSkeletonVertical'

const SKELETON_COUNT = 8

const UserListSkeletonVertical = () => {
    return (
        <View>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <UserCardSkeletonVertical key={i} />
            ))}
        </View>
    )
}

export default UserListSkeletonVertical

import React from 'react'
import { View } from 'react-native'
import NotificationCardSkeleton from './NotificationCardSkeleton'

const SKELETON_COUNT = 5

const NotificationListSkeleton = () => {
    return (
        <View>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <NotificationCardSkeleton key={i} />
            ))}
        </View>
    )
}

export default NotificationListSkeleton

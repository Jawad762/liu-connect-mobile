import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from './SkeletonBlock'

const UserCardSkeleton = () => {
    return (
        <View className="justify-center items-center gap-1 px-2">
            <SkeletonBlock width={56} height={56} borderRadius={28} />
            <SkeletonBlock width={64} height={14} borderRadius={7} />
        </View>
    )
}

export default UserCardSkeleton


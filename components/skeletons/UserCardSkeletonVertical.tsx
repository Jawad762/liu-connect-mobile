import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from './SkeletonBlock'

const UserCardSkeletonVertical = () => {
    return (
        <View className="flex-row items-center gap-3 px-4 py-3">
            <SkeletonBlock width={48} height={48} borderRadius={24} />
            <View className="flex-1 gap-2">
                <SkeletonBlock width={130} height={16} borderRadius={4} />
                <SkeletonBlock width={90} height={12} borderRadius={4} />
            </View>
        </View>
    )
}

export default UserCardSkeletonVertical

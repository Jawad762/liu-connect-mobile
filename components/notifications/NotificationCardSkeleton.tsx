import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from '../skeletons/SkeletonBlock'

const NotificationCardSkeleton = () => {
    return (
        <View className='flex-row gap-3 p-4 border-b border-border dark:border-borderDark'>
            <SkeletonBlock width={40} height={40} borderRadius={20} />
            <View className='flex-1 min-w-0 gap-2'>
                <SkeletonBlock width='85%' height={16} borderRadius={8} />
                <SkeletonBlock width='100%' height={14} borderRadius={7} />
                <SkeletonBlock width='72%' height={14} borderRadius={7} />
                <SkeletonBlock width={48} height={12} borderRadius={6} />
            </View>
        </View>
    )
}

export default NotificationCardSkeleton

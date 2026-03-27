import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from './SkeletonBlock'

const BlockedUserCardSkeleton = () => {
    return (
        <View className="mx-4 my-1.5 overflow-hidden rounded-2xl border border-border dark:border-borderDark bg-surface dark:bg-surfaceDark">
            <View className="flex-row items-center gap-3 px-4 py-3">
                <SkeletonBlock width={48} height={48} borderRadius={24} />

                <View className="flex-1 gap-1.5">
                    <SkeletonBlock width={140} height={16} borderRadius={8} />
                </View>

                <SkeletonBlock width={72} height={32} borderRadius={999} />
            </View>
        </View>
    )
}

export default BlockedUserCardSkeleton

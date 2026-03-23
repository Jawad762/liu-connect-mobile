import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from './SkeletonBlock'

const UserCardSkeletonVertical = () => {
    return (
        <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-border dark:border-borderDark bg-surface dark:bg-surfaceDark">
            <SkeletonBlock width="100%" height={96} borderRadius={0} />
            <View className="px-4 pb-4">
                <View className="-mt-8 mb-2">
                    <SkeletonBlock width={64} height={64} borderRadius={32} />
                </View>
                <View className="gap-2">
                    <SkeletonBlock width={170} height={20} borderRadius={8} />
                    <SkeletonBlock width={120} height={16} borderRadius={8} />
                    <SkeletonBlock width="100%" height={16} borderRadius={8} />
                    <SkeletonBlock width={180} height={16} borderRadius={8} />
                </View>
            </View>
        </View>
    )
}

export default UserCardSkeletonVertical

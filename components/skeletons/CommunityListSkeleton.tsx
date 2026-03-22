import React from 'react'
import { View } from 'react-native'

const CommunityListSkeleton = () => {
    return (
        <View className="px-4">
            {Array.from({ length: 5 }, (_, i) => (
                <View key={i} className="flex-row items-center gap-3 py-4 border-b border-border dark:border-borderDark">
                    <View className="w-14 h-14 rounded-xl bg-muted/30 dark:bg-mutedDark/30" />
                    <View className="flex-1 gap-1">
                        <View className="h-4 w-32 rounded bg-muted/30 dark:bg-mutedDark/30" />
                        <View className="h-3 w-full rounded bg-muted/30 dark:bg-mutedDark/30" />
                    </View>
                </View>
            ))}
        </View>
    )
}

export default CommunityListSkeleton

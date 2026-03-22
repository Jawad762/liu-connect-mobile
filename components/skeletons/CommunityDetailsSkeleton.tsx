import React from 'react'
import { View } from 'react-native'
import SkeletonBlock from './SkeletonBlock'
import PostCardSkeleton from './PostCardSkeleton'
import { BANNER_HEIGHT } from '@/components/communities/CommunityBanner'

const CommunityDetailsSkeleton = () => {
    return (
        <View className="flex-1">
            {/* Header - matches CommunityDetailsHeader layout */}
            <View className="border-b border-border dark:border-borderDark">
                {/* Banner - matches CommunityBanner */}
                <View
                    style={{ height: BANNER_HEIGHT }}
                    className="w-full items-center justify-center bg-muted/20 dark:bg-mutedDark/20"
                />

                {/* Content area: name, description, buttons */}
                <View className="px-4 pb-4 pt-4">
                    {/* Community name */}
                    <SkeletonBlock width="70%" height={24} borderRadius={6} />
                    {/* Description */}
                    <View className="mt-3">
                        <SkeletonBlock width="100%" height={14} borderRadius={4} />
                    </View>
                    <View className="mt-2">
                        <SkeletonBlock width="85%" height={14} borderRadius={4} />
                    </View>

                    {/* Buttons row */}
                    <View className="flex-row gap-2 mt-4">
                        <SkeletonBlock width="48%" height={36} borderRadius={8} />
                        <SkeletonBlock width="48%" height={36} borderRadius={8} />
                    </View>
                </View>
            </View>

            {/* Posts section - matches PostList with ListHeaderComponent */}
            <View className="px-4 py-2">
                <SkeletonBlock width={80} height={20} borderRadius={4} />
            </View>

            {/* Post cards */}
            {Array.from({ length: 4 }, (_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </View>
    )
}

export default CommunityDetailsSkeleton

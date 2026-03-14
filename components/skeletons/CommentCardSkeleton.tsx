import React from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useColorScheme } from 'nativewind'

const SkeletonBlock = ({
    width,
    height = 16,
    borderRadius = 4,
    style,
}: {
    width?: number | string
    height?: number
    borderRadius?: number
    style?: object
}) => {
    const { colorScheme = 'light' } = useColorScheme()
    const bgColor = colorScheme === 'dark' ? 'rgba(113, 118, 123, 0.4)' : 'rgba(83, 100, 113, 0.35)'

    return (
        <Animated.View
            style={[
                { width, height, borderRadius, backgroundColor: bgColor },
                style,
            ]}
        />
    )
}

const CommentCardSkeleton = () => {
    return (
        <View className='flex-row gap-3 p-4 border-b border-border dark:border-borderDark'>
            <SkeletonBlock width={40} height={40} borderRadius={20} />
            <View className='flex-1 min-w-0'>
                <View className='flex-row items-center gap-2 flex-wrap'>
                    <SkeletonBlock width='40%' height={14} borderRadius={7} />
                    <SkeletonBlock width={64} height={14} borderRadius={7} />
                    <SkeletonBlock width={80} height={14} borderRadius={7} />
                </View>
                <View className='gap-2 mt-2'>
                    <SkeletonBlock width='100%' height={14} />
                    <SkeletonBlock width='92%' height={14} />
                    <SkeletonBlock width='65%' height={14} />
                </View>
                <View className='flex-row gap-4 mt-5'>
                    <SkeletonBlock width={48} height={16} borderRadius={8} />
                    <SkeletonBlock width={48} height={16} borderRadius={8} />
                    <SkeletonBlock width={32} height={16} borderRadius={8} />
                </View>
            </View>
        </View>
    )
}

export default CommentCardSkeleton

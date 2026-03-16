import React from 'react'
import { View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import SkeletonBlock from './SkeletonBlock'

const UserProfileSkeleton = () => {
    return (
        <ThemedView className='flex-1'>
            <View style={{ height: 140 }} className='w-full'>
                <SkeletonBlock width="100%" height={140} />
            </View>
            <View style={{ marginTop: -44 }} className='px-4 pb-4 gap-3'>
                <SkeletonBlock width={80} height={80} borderRadius={40} />
                <View className='flex-row justify-between items-start mt-2'>
                    <View className='flex-1 pr-4 gap-2'>
                        <SkeletonBlock width="60%" height={20} />
                        <SkeletonBlock width="90%" height={16} />
                        <SkeletonBlock width="50%" height={16} />
                        <View className='flex-row gap-3 mt-2'>
                            <SkeletonBlock width={80} height={16} />
                            <SkeletonBlock width={80} height={16} />
                        </View>
                    </View>
                    <SkeletonBlock width={100} height={36} borderRadius={18} />
                </View>
            </View>
            <View className='flex-row px-4 pt-4'>
                <View className='flex-1 items-center border-b-4 py-3'>
                    <SkeletonBlock width="50%" height={18} />
                </View>
                <View className='flex-1 items-center border-b-4 py-3'>
                    <SkeletonBlock width="50%" height={18} />
                </View>
            </View>
            <View className='px-4 py-4 gap-4'>
                {[...Array(3)].map((_, index) => (
                    <View key={index} className='gap-2'>
                        <SkeletonBlock width="80%" height={16} />
                        <SkeletonBlock width="100%" height={14} />
                        <SkeletonBlock width="90%" height={14} />
                    </View>
                ))}
            </View>
        </ThemedView>
    )
}

export default UserProfileSkeleton


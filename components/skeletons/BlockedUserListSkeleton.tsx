import React from 'react'
import { View } from 'react-native'
import BlockedUserCardSkeleton from './BlockedUserCardSkeleton'

const SKELETON_COUNT = 8

const BlockedUserListSkeleton = () => {
    return (
        <View className='gap-4'>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <BlockedUserCardSkeleton key={i} />
            ))}
        </View>
    )
}

export default BlockedUserListSkeleton

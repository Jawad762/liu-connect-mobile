import React from 'react'
import { View } from 'react-native'
import PostCardSkeleton from './PostCardSkeleton'

const SKELETON_COUNT = 5

const PostListSkeleton = () => {
    return (
        <View>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </View>
    )
}

export default PostListSkeleton
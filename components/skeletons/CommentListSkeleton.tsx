import React from 'react'
import { View } from 'react-native'
import CommentCardSkeleton from './CommentCardSkeleton'

const SKELETON_COUNT = 5

const CommentListSkeleton = () => {
    return (
        <View>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <CommentCardSkeleton key={i} />
            ))}
        </View>
    )
}

export default CommentListSkeleton
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import usePost from '@/hooks/usePost'
import { ThemedText } from '@/components/reusable/themed-text'
import PostListSkeleton from '@/components/skeletons/PostListSkeleton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PostCard from '@/components/posts/PostCard'
import { ThemedView } from '@/components/reusable/themed-view'

const PostScreen = () => {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets();

    const { post, isLoading, error } = usePost({ publicId: id as string })

    if (isLoading) {
        return <PostListSkeleton />
    }

    if (error || !post) {
        return <ThemedText className='text-2xl font-bold'>Error: {error?.message}</ThemedText>
    }

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top }}>
            <PostCard post={post} />
        </ThemedView>
    )
}

export default PostScreen

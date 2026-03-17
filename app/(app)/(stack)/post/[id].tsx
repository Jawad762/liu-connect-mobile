import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import usePost from '@/hooks/usePost'
import { ThemedText } from '@/components/reusable/themed-text'
import ErrorState from '@/components/reusable/error-state'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/reusable/themed-view'
import PostDetailsCard from '@/components/posts/PostDetailsCard'
import PostCardSkeleton from '@/components/skeletons/PostCardSkeleton'
import CommentList from '@/components/comments/CommentList'
import { Pressable, View } from 'react-native'
import CreateCommentModal from '@/components/comments/CreateCommentModal'
import useComments from '@/hooks/useComments'
import GeneralHeader from '@/components/reusable/general-header'

const PostScreen = () => {
    const { id } = useLocalSearchParams()
    const insets = useSafeAreaInsets();
    const [createCommentModalVisible, setCreateCommentModalVisible] = useState(false);
    const { post, isFetching: isPostFetching, error, refetch: refetchPost } = usePost({ id: id as string })
    const { comments, isFetching: isCommentsFetching, isLoading: isCommentsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchComments } = useComments({ postId: id as string })

    const handleRefresh = () => {
        refetchPost()
        refetchComments()
    }

    if (!isPostFetching && (error || !post)) {
        return <ErrorState message={error?.message} onRetry={handleRefresh} />
    }

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12, paddingBottom: 100 }}>
            <View className='px-4 pb-3'>
                <GeneralHeader title='Post' />
            </View>
            <CommentList
                comments={comments}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                refetch={refetchComments}
                isLoading={isCommentsLoading}
                isRefreshing={isPostFetching || isCommentsFetching}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                    <>
                        {isPostFetching ? <PostCardSkeleton /> : post && <PostDetailsCard post={post} />}
                        <ThemedText className='text-2xl font-bold p-4'>Replies</ThemedText>
                    </>
                }
            />
            <View style={{ paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }} className='absolute bottom-0 left-6 right-6'>
                <Pressable className='rounded-full bg-surface dark:bg-surfaceDark p-4' onPress={() => setCreateCommentModalVisible(true)}>
                    <ThemedText className='text-muted dark:text-mutedDark'>Post your reply</ThemedText>
                </Pressable>
            </View>
            <CreateCommentModal visible={createCommentModalVisible} onRequestClose={() => setCreateCommentModalVisible(false)} postId={id as string} />
        </ThemedView>
    )
}

export default PostScreen

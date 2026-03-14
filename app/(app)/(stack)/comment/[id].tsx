import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ThemedText } from '@/components/reusable/themed-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/reusable/themed-view'
import CommentList from '@/components/comments/CommentList'
import { Pressable, View } from 'react-native'
import CreateCommentModal from '@/components/comments/CreateCommentModal'
import useComments from '@/hooks/useComments'
import useComment from '@/hooks/useComment'
import CommentCardSkeleton from '@/components/skeletons/CommentCardSkeleton'
import CommentDetailsCard from '@/components/comments/CommentDetailsCard'

const CommentScreen = () => {
    const { id, postId } = useLocalSearchParams()
    const insets = useSafeAreaInsets();
    const [createCommentModalVisible, setCreateCommentModalVisible] = useState(false);
    const { comment, isFetching: isCommentFetching, error, refetch: refetchComment } = useComment({ id: id as string })
    const { comments, isFetching: isCommentsFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchComments } = useComments({ parentCommentId: id as string, postId: postId as string })

    const handleRefresh = () => {
        refetchComment()
        refetchComments()
    }

    if (!isCommentFetching && (error || !comment)) {
        return <ThemedText className='text-2xl font-bold'>Error: {error?.message}</ThemedText>
    }

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top, paddingBottom: 100 }}>
            <CommentList
                comments={comments}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                refetch={refetchComments}
                isFetching={isCommentsFetching}
                isRefreshing={isCommentFetching || isCommentsFetching}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                    <>
                        {isCommentFetching ? <CommentCardSkeleton /> : comment && <CommentDetailsCard comment={comment} />}
                        <ThemedText className='text-2xl font-bold p-4'>Replies</ThemedText>
                    </>
                }
            />
            <View style={{ paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }} className='absolute bottom-0 left-6 right-6'>
                <Pressable className='rounded-full bg-surface dark:bg-surfaceDark p-4' onPress={() => setCreateCommentModalVisible(true)}> 
                    <ThemedText className='text-muted dark:text-mutedDark'>Post your reply</ThemedText>
                </Pressable>
            </View>
            <CreateCommentModal visible={createCommentModalVisible} onRequestClose={() => setCreateCommentModalVisible(false)} postId={comment?.postId ?? ''} parentId={id as string} />
        </ThemedView>
    )
}

export default CommentScreen

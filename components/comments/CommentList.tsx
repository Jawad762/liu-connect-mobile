import { Comment } from '@/types/comment.types';
import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import CommentCard from './CommentCard';
import CommentListSkeleton from '../skeletons/CommentListSkeleton';
import ErrorState from '../reusable/error-state';
import EmptyState from '../reusable/empty-state';

interface CommentListProps {
    comments: Comment[]
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    refetch: () => void
    isLoading: boolean
    isRefreshing?: boolean
    /** Optional override called on pull-to-refresh. Useful when the screen needs to
     *  refresh additional data alongside the comment list (e.g. a parent comment). */
    onRefresh?: () => void
    ListHeaderComponent?: React.ReactElement | null
    error?: Error | null
}

const CommentList = ({
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefreshing,
    onRefresh,
    ListHeaderComponent,
    error,
}: CommentListProps) => {
    if (error) {
        return <ErrorState message={error.message} onRetry={onRefresh ?? refetch} />
    }

    return (
        <View className='flex-1'>
            <FlatList
                data={isLoading ? [] : comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CommentCard comment={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing ?? false}
                        onRefresh={onRefresh ?? refetch}
                    />
                }
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={
                    isLoading
                        ? <CommentListSkeleton />
                        : <EmptyState message="No comments found" className='mt-20' />
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className='py-4 items-center'>
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default CommentList

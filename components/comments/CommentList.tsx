import { Comment } from '@/types/comment.types';
import React, { ReactNode } from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import CommentCard from './CommentCard';
import CommentListSkeleton from '../skeletons/CommentListSkeleton';

interface CommentListProps {
    comments: Comment[]
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    refetch: () => void
    isFetching: boolean
    isRefreshing?: boolean
    onRefresh?: () => void
    ListHeaderComponent?: ReactNode
}

const CommentList = ({ comments, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching, isRefreshing, onRefresh, ListHeaderComponent }: CommentListProps) => {
    return (
        <View className='flex-1'>
            <FlatList
                data={isFetching ? [] : comments}
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
                ListHeaderComponent={
                    <>
                        {ListHeaderComponent}
                        {isFetching && <CommentListSkeleton />}
                    </>
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
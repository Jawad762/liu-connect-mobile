import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import PostCard from './PostCard';
import PostListSkeleton from '../skeletons/PostListSkeleton';
import ErrorState from '../reusable/error-state';
import { Post } from '@/types/post.types';
import EmptyState from '../reusable/empty-state';

interface PostListProps {
    posts: Post[]
    isLoading: boolean
    error: Error | null | undefined
    refetch: () => void
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    ListHeaderComponent?: React.ReactElement | null
    isRefreshing?: boolean
}

const PostList = ({ posts, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, ListHeaderComponent, isRefreshing }: PostListProps) => {
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />
    }

    return (
        <View className='flex-1'>
            <FlatList
                data={isLoading ? [] : posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                ListHeaderComponent={ListHeaderComponent}
                refreshControl={<RefreshControl refreshing={isRefreshing ?? false} onRefresh={() => refetch()} />}
                ListEmptyComponent={
                    isLoading ? <PostListSkeleton /> : <EmptyState message="No posts found" />
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

export default PostList
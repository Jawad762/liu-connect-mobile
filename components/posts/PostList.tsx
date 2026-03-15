import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import PostCard from './PostCard';
import PostListSkeleton from '../skeletons/PostListSkeleton';
import ErrorState from '../reusable/error-state';
import { Post } from '@/types/post.types';
import EmptyState from '../reusable/empty-state';

const PostList = ({ posts, isFetching, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage }: { posts: Post[], isFetching: boolean, error: Error | null | undefined, refetch: () => void, fetchNextPage: () => void, hasNextPage: boolean, isFetchingNextPage: boolean }) => {
    if (isFetching) {
        return <PostListSkeleton />
    }

    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />
    }

    if (posts.length === 0) {
        return <EmptyState message="No posts found" />
    }

    return (
        <View className='flex-1'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />}
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
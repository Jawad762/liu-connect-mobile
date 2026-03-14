import usePosts from '@/hooks/usePosts';
import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import PostCard from './PostCard';
import PostListSkeleton from '../skeletons/PostListSkeleton';

const PostList = () => {
    const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching } = usePosts({ size: 10 });

    if (isLoading) {
        return <PostListSkeleton />
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
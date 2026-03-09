import usePosts from '@/hooks/usePosts';
import React from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
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
            keyExtractor={(item) => item.publicId}
            renderItem={({ item }) => <PostCard post={item} />}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            onEndReachedThreshold={0.8}
            onRefresh={() => refetch()}
            refreshing={isFetching}
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
import React from 'react'
import { View } from 'react-native'
import usePosts from '@/hooks/usePosts';
import PostList from '../posts/PostList';

const CommunitiesHome = () => {
    const { posts, isLoading, error, refetch, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = usePosts({ size: 10, communitiesOnly: true });
  return (
    <View className='flex-1'>
        <PostList posts={posts} isLoading={isLoading} error={error} refetch={refetch} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isRefreshing={isFetching} showCommunityName={true}/>
    </View>
  )
}

export default CommunitiesHome
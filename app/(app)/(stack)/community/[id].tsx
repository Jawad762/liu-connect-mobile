import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Alert, Platform, Pressable, View } from 'react-native'
import { ThemedView } from '@/components/reusable/themed-view'
import useCommunity from '@/hooks/useCommunity'
import usePosts from '@/hooks/usePosts'
import CommunityDetailsHeader from '@/components/communities/CommunityDetailsHeader'
import PostList from '@/components/posts/PostList'
import ErrorState from '@/components/reusable/error-state'
import CommunityDetailsSkeleton from '@/components/skeletons/CommunityDetailsSkeleton'
import CreatePostModal from '@/components/posts/CreatePostModal'
import { ThemedText } from '@/components/reusable/themed-text'
import { IconSymbol } from '@/components/reusable/icon-symbol.ios'
import { TAB_BAR_HEIGHT } from '@/constants/general'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import useAuthStore from '@/stores/auth.store'

const CommunityScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const user = useAuthStore((state) => state.user)
    const { colorScheme = 'light' } = useColorScheme()
    const [createPostModalVisible, setCreatePostModalVisible] = useState(false)
    const realTabBarHeight = TAB_BAR_HEIGHT + (Platform.OS === 'android' ? 16 : 0);
    const { community, isLoading, error, refetch } = useCommunity(id)
    const {
        posts,
        isLoading: isPostsLoading,
        error: postsError,
        refetch: refetchPosts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching: isPostsFetching,
    } = usePosts({ communityId: id, size: 10 })

    const handleRefresh = () => {
        refetch()
        refetchPosts()
    }

    if (error || (!isLoading && !community)) {
        return <ErrorState message={error?.message} onRetry={handleRefresh} />
    }

    return (
        <ThemedView className="flex-1">
            {isLoading ? (
                <CommunityDetailsSkeleton />
            ) : community ? (
                <>
                    <CommunityDetailsHeader
                        community={community}
                        onRefetch={handleRefresh}
                    />
                    <View className="flex-1 mt-2">
                        <PostList
                            posts={posts}
                            isLoading={isPostsLoading}
                            error={postsError}
                            refetch={refetchPosts}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isRefreshing={isPostsFetching}
                            ListHeaderComponent={
                                <View className="px-4 py-2">
                                    <ThemedText className="text-lg font-sans-semibold">Posts</ThemedText>
                                </View>
                            }
                            showCommunityName={false}
                        />
                    </View>

                    {/* Floating Button to open the create post modal */}
                    <Pressable
                        className="absolute right-6 bg-accent dark:bg-accentDark rounded-full p-5"
                        style={{ bottom: realTabBarHeight + 12 }}
                        onPress={() => {
                            if (community.isJoined || community.createdById === user?.id) {
                                setCreatePostModalVisible(true)
                            } else {
                                Alert.alert('Join to post', 'You need to join this community to create posts.')
                            }
                        }}
                    >
                        <IconSymbol name="plus" size={24} color={"white"} />
                    </Pressable>
                    <CreatePostModal
                        visible={createPostModalVisible}
                        onRequestClose={() => setCreatePostModalVisible(false)}
                        initialCommunity={{ id: community.id, name: community.name }}
                    />
                </>
            ) : null}
        </ThemedView>
    )
}

export default CommunityScreen

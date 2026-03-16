import React, { useMemo, useState } from 'react'
import { User } from '@/types/user.types'
import { Pressable, View } from 'react-native'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'
import { Colors } from '@/constants/theme-colors'
import { useColorScheme } from 'nativewind'
import useAuthStore from '@/stores/auth.store'
import { IconSymbol } from '../reusable/icon-symbol'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { userKeys } from '@/utils/query-keys'
import usePosts from '@/hooks/usePosts'
import useComments from '@/hooks/useComments'
import PostList from '../posts/PostList'
import CommentList from '../comments/CommentList'
import { ThemedView } from '../reusable/themed-view'
import { cn } from '@/utils/cn.utils'
import { BackButton } from '../reusable/back-button'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const UserProfile = ({ user }: { user: User }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const insets = useSafeAreaInsets();
    const authUser = useAuthStore((state) => state.user);
    const isOwnProfile = authUser?.id === user.id;
    const [selectedTab, setSelectedTab] = useState<'posts' | 'replies'>('posts');
    const queryClient = useQueryClient();

    const { posts, isLoading: isPostsLoading, error: postsError, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching: isPostsFetching, refetch: refetchPosts } = usePosts({ authorId: user.id, size: 10 });
    const { comments, isLoading: _isCommentsLoading, error: commentsError, fetchNextPage: fetchNextCommentsPage, hasNextPage: hasMoreComments, isFetchingNextPage: isFetchingNextComments, isFetching: isCommentsFetching, refetch: refetchComments } = useComments({ userId: user.id, size: 10 });

    const isFollowing = !!user.is_following;

    const followMutation = useMutation({
        mutationFn: () => isFollowing ? userService.unfollowUser(user.id) : userService.followUser(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
        },
    });

    const joinedText = useMemo(() => {
        const createdAt = new Date(user.createdAt as unknown as string);
        if (isNaN(createdAt.getTime())) return null;
        return `Joined ${createdAt.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
        })}`;
    }, [user.createdAt]);

    const ProfileHeader = () => (
        <View>
            <View style={{ height: 150, backgroundColor: Colors[colorScheme].surface }} className='w-full relative'>
                {router.canGoBack() && (
                    <Pressable onPress={() => router.back()} style={{ top: insets.top, left: 10, backgroundColor: 'black' }} className='absolute rounded-full p-2'><BackButton /></Pressable>
                )}
            </View>
            <View style={{ marginTop: -32 }} className='px-4 pb-4 gap-3'>
                <ProfileIcon avatarUrl={user.avatar_url} className='w-20 h-20' />
                <View className='flex-row justify-between items-start mt-2'>
                    <View className='flex-1 pr-4'>
                        <ThemedText className='text-xl font-bold'>{user.name}</ThemedText>
                        {user.bio && (
                            <ThemedText className='text-base text-muted dark:text-mutedDark mt-1'>
                                {user.bio}
                            </ThemedText>
                        )}
                        {(user.school || user.major) && (
                            <View className='gap-1 mt-2'>
                                {user.school && (
                                    <View className='flex-row items-center gap-2'>
                                        <IconSymbol name="building.2" size={16} color={Colors[colorScheme].icon} />
                                        <ThemedText className='text-sm'>{user.school}</ThemedText>
                                    </View>
                                )}
                                {user.major && (
                                    <View className='flex-row items-center gap-2'>
                                        <IconSymbol name="book.closed" size={16} color={Colors[colorScheme].icon} />
                                        <ThemedText className='text-sm'>{user.major}</ThemedText>
                                    </View>
                                )}
                            </View>
                        )}
                        {joinedText && (
                            <View className='flex-row items-center gap-2 mt-2'>
                                <IconSymbol name="calendar" size={16} color={Colors[colorScheme].icon} />
                                <ThemedText className='text-sm text-muted dark:text-mutedDark'>
                                    {joinedText}
                                </ThemedText>
                            </View>
                        )}
                        <View className='flex-row gap-3 mt-3'>
                            <ThemedText>
                                {user.following_count}{' '}
                                <ThemedText className='text-muted dark:text-mutedDark'>Following</ThemedText>
                            </ThemedText>
                            <ThemedText>
                                {user.followers_count}{' '}
                                <ThemedText className='text-muted dark:text-mutedDark'>Followers</ThemedText>
                            </ThemedText>
                        </View>
                    </View>
                    {!isOwnProfile && (
                        <Pressable
                            onPress={() => followMutation.mutate()}
                            disabled={followMutation.isPending}
                            className={`px-4 py-2 rounded-full border ${isFollowing ? 'bg-background dark:bg-backgroundDark border-border dark:border-borderDark' : 'bg-primary border-primary'
                                }`}
                        >
                            <ThemedText className={`text-sm font-sans-bold ${isFollowing ? '' : 'text-background dark:text-backgroundDark'}`}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </ThemedText>
                        </Pressable>
                    )}
                </View>
            </View>
            <View style={{ marginTop: 10 }} className='flex-row px-4'>
                {(['Posts', 'Replies'] as const).map((tab) => {
                    const isActive = selectedTab === tab.toLowerCase() as 'posts' | 'replies';
                    return (
                        <Pressable
                            key={tab}
                            onPress={() => setSelectedTab(tab.toLowerCase() as 'posts' | 'replies')}
                            className={cn('flex-1 items-center border-b-4 py-3', isActive ? 'border-accent' : 'border-transparent text-muted dark:text-mutedDark')}
                        >
                            <ThemedText className="text-base font-sans-bold">
                                {tab}
                            </ThemedText>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );

    return (
        <ThemedView className='flex-1'>
            {selectedTab === 'posts' ? (
                <PostList
                    posts={posts}
                    isLoading={isPostsLoading}
                    isFetching={isPostsFetching}
                    error={postsError}
                    refetch={refetchPosts}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    ListHeaderComponent={<ProfileHeader />}
                />
            ) : (
                <CommentList
                    comments={comments}
                    fetchNextPage={fetchNextCommentsPage}
                    hasNextPage={hasMoreComments}
                    isFetchingNextPage={isFetchingNextComments}
                    refetch={refetchComments}
                    isFetching={isCommentsFetching}
                    ListHeaderComponent={<ProfileHeader />}
                    isRefreshing={isCommentsFetching}
                />
            )}
        </ThemedView>
    )
}

export default UserProfile
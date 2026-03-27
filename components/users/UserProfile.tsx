import React, { memo, useMemo, useState } from 'react'
import { User } from '@/types/user.types'
import { Alert, Image, Pressable, View } from 'react-native'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'
import { Colors } from '@/constants/theme-colors'
import { useColorScheme } from 'nativewind'
import useAuthStore from '@/stores/auth.store'
import { IconSymbol } from '../reusable/icon-symbol'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { commentKeys, postKeys, userKeys } from '@/utils/query-keys.utils'
import usePosts from '@/hooks/usePosts'
import useComments from '@/hooks/useComments'
import PostList from '../posts/PostList'
import CommentList from '../comments/CommentList'
import { ThemedView } from '../reusable/themed-view'
import { cn } from '@/utils/cn.utils'
import { BackButton } from '../reusable/back-button'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '../reusable/button'
import { screens } from '@/utils/screens.utils'
import EditProfileModal from './EditProfileModal'
import { ImageViewerModal } from '../reusable/ImageViewerModal'
import ActionSheet from '../reusable/action-sheet'
import { EdgeInsets } from 'react-native-safe-area-context'

interface ProfileHeaderProps {
    user: User
    colorScheme: 'light' | 'dark'
    insets: EdgeInsets
    isOwnProfile: boolean
    isFollowing: boolean
    isFollowPending: boolean
    joinedText: string | null
    selectedTab: 'posts' | 'replies'
    onFollowPress: () => void
    onTabChange: (tab: 'posts' | 'replies') => void
    onEditProfilePress: () => void
    onCoverPress: () => void
    onAvatarPress: () => void
    onMenuPress: () => void
}

const ProfileHeader = memo(({
    user,
    colorScheme,
    insets,
    isOwnProfile,
    isFollowing,
    isFollowPending,
    joinedText,
    selectedTab,
    onFollowPress,
    onTabChange,
    onEditProfilePress,
    onCoverPress,
    onAvatarPress,
    onMenuPress,
}: ProfileHeaderProps) => (
    <View>
        <Pressable style={{ height: 150, backgroundColor: Colors[colorScheme].surface }} className='w-full relative' onPress={onCoverPress}>
            {user.cover_url && (
                <Image source={{ uri: user.cover_url }} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
            )}
            {router.canGoBack() && (
                <Pressable onPress={() => router.back()} style={{ top: insets.top, left: 10, backgroundColor: 'black' }} className='absolute rounded-full p-2'><BackButton color={"white"}/></Pressable>
            )}
            {!isOwnProfile && (
                <Pressable onPress={onMenuPress} style={{ top: insets.top, right: 10, backgroundColor: 'black' }} className='absolute rounded-full p-2'>
                    <IconSymbol name="ellipsis" size={20} color="white" />
                </Pressable>
            )}
        </Pressable>
        <View style={{ marginTop: -32 }} className='px-4 pb-4 gap-3'>
            <Pressable onPress={onAvatarPress}>
                <ProfileIcon avatarUrl={user.avatar_url} className='w-20 h-20' />
            </Pressable>
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
                        <Pressable onPress={() => router.push(screens.user.following(user.id))}>
                            <View className='flex-row items-center'>
                                <ThemedText>{user.following_count}{' '}</ThemedText>
                                <ThemedText className='text-muted dark:text-mutedDark'>Following</ThemedText>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => router.push(screens.user.followers(user.id))}>
                            <View className='flex-row items-center'>
                                <ThemedText>{user.followers_count}{' '}</ThemedText>
                                <ThemedText className='text-muted dark:text-mutedDark'>Followers</ThemedText>
                            </View>
                        </Pressable>
                    </View>
                </View>
                {!isOwnProfile ? (
                    <Button
                        variant={isFollowing ? 'outline' : 'primary'}
                        onPress={onFollowPress}
                        disabled={isFollowPending}
                        className='px-4'
                        textClassName='text-base'
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                ) : (
                    <Button
                        variant='outline'
                        textClassName='text-base'
                        onPress={onEditProfilePress}
                    >
                        Edit Profile
                    </Button>
                )}
            </View>
        </View>
        <View style={{ marginTop: 10 }} className='flex-row px-4'>
            {(['Posts', 'Replies'] as const).map((tab) => {
                const isActive = selectedTab === tab.toLowerCase() as 'posts' | 'replies';
                return (
                    <Pressable
                        key={tab}
                        onPress={() => onTabChange(tab.toLowerCase() as 'posts' | 'replies')}
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
));

const UserProfile = ({ user }: { user: User }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const insets = useSafeAreaInsets();
    const { user: authUser, setUser } = useAuthStore();
    const isOwnProfile = authUser?.id === user.id;
    const [selectedTab, setSelectedTab] = useState<'posts' | 'replies'>('posts');
    const [avatarViewerVisible, setAvatarViewerVisible] = useState(false);
    const [coverViewerVisible, setCoverViewerVisible] = useState(false);
    const queryClient = useQueryClient();
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const { posts, isLoading: isPostsLoading, error: postsError, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching: isPostsFetching, refetch: refetchPosts } = usePosts({ authorId: user.id, size: 10 });
    const { comments, isLoading: isCommentsLoading, error: commentsError, fetchNextPage: fetchNextCommentsPage, hasNextPage: hasMoreComments, isFetchingNextPage: isFetchingNextComments, isFetching: isCommentsFetching, refetch: refetchComments } = useComments({ userId: user.id, size: 10 });

    const isFollowing = !!user.is_following;

    const followMutation = useMutation({
        mutationFn: () => isFollowing ? userService.unfollowUser(user.id) : userService.followUser(user.id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
            if (authUser) {
                setUser({ ...authUser, following_count: data.data.following_count, followers_count: data.data.followers_count });
                queryClient.invalidateQueries({ queryKey: userKeys.detail(authUser.id) });
            }
        },
        onError: () => {
            Alert.alert('Oops!', `Failed to ${isFollowing ? 'unfollow' : 'follow'} this user. Please try again.`);
        },
    });

    const blockUserMutation = useMutation({
        mutationFn: () => userService.blockUser(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            queryClient.invalidateQueries({ queryKey: commentKeys.all });
            queryClient.invalidateQueries({ queryKey: userKeys.blocked.all });
            router.back();
        },
        onError: () => {
            Alert.alert('Oops!', 'Failed to block this user. Please try again.');
        },
    });

    const joinedText = useMemo(() => {
        const createdAt = new Date(user.createdAt);
        if (isNaN(createdAt.getTime())) return null;
        return `Joined ${createdAt.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
        })}`;
    }, [user.createdAt]);

    const handleBlockUser = () => {
        Alert.alert(
            'Block User',
            `Block ${user.name || 'this user'}? They will no longer be able to see your posts or send you messages.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Block', style: 'destructive', onPress: () => blockUserMutation.mutate() },
            ]
        );
    }

    const profileHeader = useMemo(() => (
        <ProfileHeader
            user={user}
            colorScheme={colorScheme}
            insets={insets}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            isFollowPending={followMutation.isPending}
            joinedText={joinedText}
            selectedTab={selectedTab}
            onFollowPress={() => followMutation.mutate()}
            onTabChange={setSelectedTab}
            onEditProfilePress={() => setEditProfileModalVisible(true)}
            onCoverPress={() => {
                if (!user.cover_url) return;
                setCoverViewerVisible(true);
            }}
            onAvatarPress={() => {
                setAvatarViewerVisible(true);
            }}
            onMenuPress={() => setMenuVisible(true)}
        />
    ), [user, colorScheme, insets, isOwnProfile, isFollowing, followMutation.isPending, joinedText, selectedTab]);

    return (
        <ThemedView className='flex-1'>
            {selectedTab === 'posts' ? (
                <PostList
                    posts={posts}
                    isLoading={isPostsLoading}
                    error={postsError}
                    refetch={refetchPosts}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    ListHeaderComponent={profileHeader}
                    isRefreshing={isPostsFetching}
                />
            ) : (
                <CommentList
                    comments={comments}
                    fetchNextPage={fetchNextCommentsPage}
                    hasNextPage={hasMoreComments}
                    isFetchingNextPage={isFetchingNextComments}
                    refetch={refetchComments}
                    isLoading={isCommentsLoading}
                    error={commentsError}
                    ListHeaderComponent={profileHeader}
                    isRefreshing={isCommentsFetching}
                />
            )}
            <ImageViewerModal
                visible={avatarViewerVisible}
                imageUri={user.avatar_url}
                onClose={() => setAvatarViewerVisible(false)}
            />
            <ImageViewerModal
                visible={coverViewerVisible}
                imageUri={user.cover_url}
                onClose={() => setCoverViewerVisible(false)}
            />
            {isOwnProfile && (
                <EditProfileModal
                    visible={editProfileModalVisible}
                    onRequestClose={() => setEditProfileModalVisible(false)}
                    user={user}
                />
            )}
            {!isOwnProfile && (
                <ActionSheet
                    visible={menuVisible}
                    onClose={() => setMenuVisible(false)}
                    actions={[
                        {
                            label: `Block ${user.name || 'User'}`,
                            icon: 'slash.circle',
                            color: '#ef4444',
                            onPress: handleBlockUser,
                        },
                    ]}
                />
            )}
        </ThemedView>
    )
}

export default UserProfile

import { Post } from '@/types/post.types'
import React, { useState } from 'react'
import { Alert, Pressable, Share, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import { formatRelativeDate } from '@/utils/date.utils'
import { IconSymbol } from '../reusable/icon-symbol'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { cn } from '@/utils/cn.utils'
import { getMediaItemStyle } from '@/utils/media-utils'
import { postService } from '@/services/post.service'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { postKeys } from '@/utils/query-keys'
import { APP_WEB_URL } from '@/constants/links'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'
import MediaItem from '../reusable/MediaItem'
import { ImageViewerModal } from '../reusable/ImageViewerModal'
import PostContextMenu from './PostContextMenu'
import UpdatePostModal from './UpdatePostModal'
import * as Clipboard from 'expo-clipboard';
import LoadingOverlay from '../reusable/loading-overlay'

type PostsQueryData = InfiniteData<{ data: Post[] }>

const PostCard = ({ post, showCommunityName = true }: { post: Post, showCommunityName?: boolean }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatePostModalVisible, setUpdatePostModalVisible] = useState(false);

    const handleLikePost = async () => {
        await queryClient.cancelQueries({ queryKey: postKeys.all })
        const previousDataList = queryClient.getQueriesData<PostsQueryData>({ queryKey: postKeys.all })

        queryClient.setQueriesData<PostsQueryData>(
            { queryKey: postKeys.all },
            (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((p) =>
                            p.id === post.id
                                ? { ...p, isLiked: !p.isLiked, likes_count: p.isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                                : p
                        ),
                    })),
                }
            }
        )

        try {
            const result = post.isLiked ? await postService.unlikePost(post.id) : await postService.likePost(post.id)
            if (!result.success) {
                throw new Error(result.message)
            }
        } catch (error) {
            previousDataList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while liking/unliking the post')
        }
    }

    const handleNavigateToProfile = () => {
        router.push(screens.user.profile(post.user.id))
    }

    const handleDeletePost = async () => {
        try {
            setIsDeleting(true)
            const result = await postService.deletePost(post.id)
            if (!result.success) {
                throw new Error(result.message)
            }
            queryClient.invalidateQueries({ queryKey: postKeys.all })
            Alert.alert('Success!', 'Post deleted successfully')
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while deleting the post')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCopyText = async () => {
        await Clipboard.setStringAsync(post.content)
        Alert.alert('Success!', 'Text copied to clipboard')
    }

    const handleBookmarkPost = async () => {
        await queryClient.cancelQueries({ queryKey: postKeys.all })
        await queryClient.cancelQueries({ queryKey: postKeys.bookmarks() })
        const previousDataList = queryClient.getQueriesData<PostsQueryData>({ queryKey: postKeys.all })
        const previousBookmarksList = queryClient.getQueriesData<PostsQueryData>({ queryKey: postKeys.bookmarks() })

        const patchPosts = (old: PostsQueryData | undefined) => {
            if (!old) return old
            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    data: page.data.map((p) =>
                        p.id === post.id ? { ...p, isBookmarked: !p.isBookmarked } : p
                    ),
                })),
            }
        }
        queryClient.setQueriesData<PostsQueryData>({ queryKey: postKeys.all }, patchPosts)
        queryClient.setQueriesData<PostsQueryData>({ queryKey: postKeys.bookmarks() }, patchPosts)

        try {
            const result = post.isBookmarked ? await postService.unbookmarkPost(post.id) : await postService.bookmarkPost(post.id)
            if (!result.success) {
                throw new Error(result.message)
            }
            queryClient.invalidateQueries({ queryKey: postKeys.bookmarks() })
        } catch (error) {
            previousDataList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            previousBookmarksList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while bookmarking the post')
        }
    }

    const handleSharePost = async () => {
        try {
            const url = `${APP_WEB_URL}/post/${post.id}`
            await Share.share({
                message: url,
            })
        } catch (error) {
            Alert.alert('Oops!', 'An error occurred while sharing the post')
        }
    }

    return (
        <Pressable onPress={() => router.push(screens.post.details(post.id))} className='p-4 border-b border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark'>
            {post.community && showCommunityName && (
                <Pressable style={{ marginLeft: 28 }} onPress={() => router.push(screens.communities.details(post.community!.id))} className='flex-row items-center gap-1 mb-2'>
                    <IconSymbol name='person.2.fill' size={16} color={Colors[colorScheme].muted} />
                    <ThemedText className='text-muted dark:text-mutedDark font-sans-bold'>
                        {post.community.name}
                    </ThemedText>
                </Pressable>
            )}
            <View className='flex-1 flex-row items-start gap-3'>
                <Pressable onPress={handleNavigateToProfile}>
                    <ProfileIcon avatarUrl={post.user.avatar_url} />
                </Pressable>

                <View className='flex-1 min-w-0'>

                    <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                        <Pressable onPress={handleNavigateToProfile} className='flex-row items-center gap-x-2'>
                            <ThemedText className='text-lg font-sans-bold' numberOfLines={1}>
                                {post.user.name}
                            </ThemedText>
                        </Pressable>
                        <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans' numberOfLines={1}>
                            • {formatRelativeDate(post.createdAt)}
                        </ThemedText>
                        <PostContextMenu post={post} onEdit={() => setUpdatePostModalVisible(true)} onDelete={handleDeletePost} onCopyText={handleCopyText} />
                    </View>
                    {post.content.trim().length > 0 && (
                        <ThemedText className='text-lg font-sans'>{post.content}</ThemedText>
                    )}
                    {post.media.length > 0 && (
                        <View className='flex-row flex-wrap gap-2 mt-2'>
                            {post.media.map((m, index) => (
                                <MediaItem
                                    key={m.id}
                                    uri={m.media_url}
                                    type={m.type}
                                    style={getMediaItemStyle(post.media.length, index)}
                                    onImagePress={() => m.type === 'IMAGE' && setFullScreenImageUri(m.media_url)}
                                />
                            ))}
                        </View>
                    )}
                    <View className='flex-row items-center gap-6 mt-5'>
                        <Pressable onPress={handleLikePost} className='flex-row items-center gap-1.5' hitSlop={8}>
                            <IconSymbol name={post.isLiked ? 'heart.fill' : 'heart'} size={20} color={post.isLiked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                            <ThemedText className={cn('text-sm font-sans', post.isLiked ? 'text-accent dark:text-accentDark' : 'text-muted dark:text-mutedDark')}>
                                {post.likes_count}
                            </ThemedText>
                        </Pressable>
                        <View className='flex-row items-center gap-1.5' hitSlop={8}>
                            <IconSymbol name='message' size={20} color={Colors[colorScheme].muted} />
                            <ThemedText className='text-sm font-sans text-muted dark:text-mutedDark'>
                                {post.comments_count}
                            </ThemedText>
                        </View>
                        <Pressable className='flex-row items-center gap-1.5 opacity-50' hitSlop={8}>
                            <IconSymbol name='chart.bar' size={20} color={Colors[colorScheme].muted} />
                        </Pressable>
                        <View className='flex-1' />
                        <Pressable onPress={handleBookmarkPost} hitSlop={8}>
                            <IconSymbol name={post.isBookmarked ? 'bookmark.fill' : 'bookmark'} size={20} color={post.isBookmarked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                        </Pressable>
                        <Pressable onPress={handleSharePost} hitSlop={8}>
                            <IconSymbol name='square.and.arrow.up' size={20} color={Colors[colorScheme].muted} />
                        </Pressable>
                    </View>
                    <ImageViewerModal
                        visible={!!fullScreenImageUri}
                        imageUri={fullScreenImageUri}
                        onClose={() => setFullScreenImageUri(null)}
                    />
                    <LoadingOverlay visible={isDeleting} />
                    <UpdatePostModal visible={updatePostModalVisible} onRequestClose={() => setUpdatePostModalVisible(false)} post={post} />
                </View>
            </View>

        </Pressable>
    )
}

export default PostCard

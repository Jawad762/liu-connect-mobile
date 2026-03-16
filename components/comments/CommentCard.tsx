import React, { useState } from 'react'
import { Alert, Pressable, Share, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import Tag from '../reusable/tag'
import { IconSymbol } from '../reusable/icon-symbol'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { cn } from '@/utils/cn.utils'
import { getMediaItemStyle } from '@/utils/media-utils'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { commentKeys, postKeys } from '@/utils/query-keys'
import { commentService } from '@/services/comment.service'
import { abbreviateMajor } from '@/utils/general.utils'
import { Comment } from '@/types/comment.types'
import MediaItem from '../reusable/MediaItem'
import { ImageViewerModal } from '../reusable/ImageViewerModal'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'
import * as Linking from 'expo-linking'
import { formatRelativeDate } from '@/utils/date.utils'
import * as Clipboard from 'expo-clipboard';
import CommentContextMenu from './CommentContextMenu'
import LoadingOverlay from '../reusable/loading-overlay'
import UpdateCommentModal from './UpdateCommentModal'

type CommentsQuerData = InfiniteData<{ data: Comment[] }>

const CommentCard = ({ comment }: { comment: Comment }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updateCommentModalVisible, setUpdateCommentModalVisible] = useState(false);

    const handleLikeComment = async () => {
        await queryClient.cancelQueries({ queryKey: commentKeys.all })
        await queryClient.cancelQueries({ queryKey: commentKeys.detail(comment.id) })
        const previousDataList = queryClient.getQueriesData<CommentsQuerData>({ queryKey: commentKeys.all })
        const previousComment = queryClient.getQueryData<Comment>(commentKeys.detail(comment.id))

        queryClient.setQueriesData<CommentsQuerData>(
            { queryKey: commentKeys.all },
            (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((c) =>
                            c.id === comment.id
                                ? { ...c, isLiked: !c.isLiked, likes_count: c.isLiked ? c.likes_count - 1 : c.likes_count + 1 }
                                : c
                        ),
                    })),
                }
            }
        )

        queryClient.setQueryData(commentKeys.detail(comment.id), (old: Comment | undefined) => {
            if (!old) return old
            return {
                ...old,
                isLiked: !old.isLiked,
                likes_count: old.isLiked ? old.likes_count - 1 : old.likes_count + 1,
            }
        })

        try {
            const result = comment.isLiked ? await commentService.unlikeComment(comment.id) : await commentService.likeComment(comment.id)
            if (!result.success) {
                throw new Error(result.message)
            }
        } catch (error) {
            previousDataList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            queryClient.setQueryData(commentKeys.detail(comment.id), previousComment)
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while liking/unliking the comment')
        }
    }

    const handleNavigateToProfile = () => {
        // TODO: router.push(`/profile/${comment.user.id}`)
    }

    const handleDeleteComment = async () => {
        try {
            setIsDeleting(true)
            const result = await commentService.deleteComment(comment.id)
            if (!result.success) {
                throw new Error(result.message)
            }
            queryClient.invalidateQueries({ queryKey: commentKeys.all })
            queryClient.invalidateQueries({ queryKey: commentKeys.detail(comment.id) })
            queryClient.invalidateQueries({ queryKey: postKeys.detail(comment.postId) })
            queryClient.invalidateQueries({ queryKey: postKeys.all })
            Alert.alert('Success!', 'Comment deleted successfully')
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while deleting the comment')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCopyText = async () => {
        await Clipboard.setStringAsync(comment.content)
        Alert.alert('Success!', 'Text copied to clipboard')
    }

    const handleBookmarkComment = async () => {
        await queryClient.cancelQueries({ queryKey: commentKeys.all })
        await queryClient.cancelQueries({ queryKey: commentKeys.bookmarks() })
        const previousDataList = queryClient.getQueriesData<CommentsQuerData>({ queryKey: commentKeys.all })
        const previousBookmarksList = queryClient.getQueriesData<CommentsQuerData>({ queryKey: commentKeys.bookmarks() })

        const patchComments = (old: CommentsQuerData | undefined) => {
            if (!old) return old
            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    data: page.data.map((c) =>
                        c.id === comment.id ? { ...c, isBookmarked: !c.isBookmarked } : c
                    ),
                })),
            }
        }
        queryClient.setQueriesData<CommentsQuerData>({ queryKey: commentKeys.all }, patchComments)
        queryClient.setQueriesData<CommentsQuerData>({ queryKey: commentKeys.bookmarks() }, patchComments)

        try {
            const result = comment.isBookmarked ? await commentService.unbookmarkComment(comment.id) : await commentService.bookmarkComment(comment.id)
            if (!result.success) {
                throw new Error(result.message)
            }
            queryClient.invalidateQueries({ queryKey: commentKeys.bookmarks() })
        } catch (error) {
            previousDataList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            previousBookmarksList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while bookmarking the comment')
        }
    }

    const handleShareComment = async () => {
        try {
            const url = Linking.createURL(`/comment/${comment.id}?postId=${comment.postId}`)
            await Share.share({
                message: `Check out this comment on Liu Connect: ${url}`,
            })
        } catch (error) {
            Alert.alert('Oops!', 'An error occurred while sharing the comment')
        }
    }

    return (
        <Pressable onPress={() => router.push(screens.comment.details(comment.id, comment.postId))} className='flex-row items-start gap-3 p-4 border-b border-border dark:border-borderDark'>
            <Pressable onPress={handleNavigateToProfile}>
                <ProfileIcon avatarUrl={comment.user.avatar_url} />
            </Pressable>
            <View className='flex-1 min-w-0'>
                <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                    <Pressable onPress={handleNavigateToProfile} className='flex-row items-center gap-x-2'>
                        <ThemedText className='text-lg font-sans-bold' numberOfLines={1}>
                            {comment.user.name}
                        </ThemedText>
                        {comment.user.major && (
                            <Tag label={abbreviateMajor(comment.user.major)} />
                        )}
                    </Pressable>
                    <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans' numberOfLines={1}>
                        • {formatRelativeDate(comment.createdAt)}
                    </ThemedText>
                    <CommentContextMenu comment={comment} onDelete={handleDeleteComment} onCopyText={handleCopyText} onEdit={() => setUpdateCommentModalVisible(true)} />
                </View>
                {comment.is_deleted ? (
                    <ThemedText className='text-lg font-sans mt-2 text-muted dark:text-mutedDark'>
                        This comment has been deleted
                    </ThemedText>
                ) : (
                    <>
                        {comment.content.trim().length > 0 && (
                            <ThemedText className='text-lg font-sans mt-2'>{comment.content}</ThemedText>
                        )}
                        {comment.media.length > 0 && (
                            <View className='flex-row flex-wrap gap-2 mt-2'>
                                {comment.media.map((m, index) => (
                                    <MediaItem
                                        key={m.id}
                                        uri={m.media_url}
                                        type={m.type}
                                        style={getMediaItemStyle(comment.media.length, index)}
                                        onImagePress={() => m.type === 'IMAGE' && setFullScreenImageUri(m.media_url)}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}
                <View className='flex-row items-center gap-6 mt-5'>
                    {comment.is_deleted ? (
                        <View className='flex-row items-center gap-1.5' hitSlop={8}>
                            <IconSymbol name='message' size={20} color={Colors[colorScheme].muted} />
                            <ThemedText className='text-sm font-sans text-muted dark:text-mutedDark'>
                                {comment.replies_count}
                            </ThemedText>
                        </View>
                    ) : (
                        <>
                            <Pressable onPress={handleLikeComment} className='flex-row items-center gap-1.5' hitSlop={8}>
                                <IconSymbol name={comment.isLiked ? 'heart.fill' : 'heart'} size={20} color={comment.isLiked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                                <ThemedText className={cn('text-sm font-sans', comment.isLiked ? 'text-accent dark:text-accentDark' : 'text-muted dark:text-mutedDark')}>
                                    {comment.likes_count}
                                </ThemedText>
                            </Pressable>
                            <View className='flex-row items-center gap-1.5' hitSlop={8}>
                                <IconSymbol name='message' size={20} color={Colors[colorScheme].muted} />
                                <ThemedText className='text-sm font-sans text-muted dark:text-mutedDark'>
                                    {comment.replies_count}
                                </ThemedText>
                            </View>
                            <Pressable className='flex-row items-center gap-1.5 opacity-50' hitSlop={8}>
                                <IconSymbol name='chart.bar' size={20} color={Colors[colorScheme].muted} />
                            </Pressable>
                            <View className='flex-1' />
                            <Pressable onPress={handleBookmarkComment} hitSlop={8}>
                                <IconSymbol name={comment.isBookmarked ? 'bookmark.fill' : 'bookmark'} size={20} color={comment.isBookmarked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                            </Pressable>
                            <Pressable onPress={handleShareComment} hitSlop={8}>
                                <IconSymbol name='square.and.arrow.up' size={20} color={Colors[colorScheme].muted} />
                            </Pressable>
                        </>
                    )}

                </View>
                <ImageViewerModal
                    visible={!!fullScreenImageUri}
                    imageUri={fullScreenImageUri}
                    onClose={() => setFullScreenImageUri(null)}
                />
                <LoadingOverlay visible={isDeleting} />
            </View>
            <UpdateCommentModal visible={updateCommentModalVisible} onRequestClose={() => setUpdateCommentModalVisible(false)} comment={comment} />
        </Pressable>
    )
}

export default CommentCard

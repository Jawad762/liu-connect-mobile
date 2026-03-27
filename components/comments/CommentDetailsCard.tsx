import React, { useMemo, useState } from 'react'
import { commentKeys, postKeys } from '@/utils/query-keys.utils'
import { Alert, Pressable, Share, View } from 'react-native'
import MediaItem from '../reusable/MediaItem'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import Tag from '../reusable/tag'
import { IconSymbol } from '../reusable/icon-symbol'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { cn } from '@/utils/cn.utils'
import { getMediaItemStyle } from '@/utils/media.utils'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { abbreviateMajor } from '@/utils/general.utils'
import { APP_WEB_URL } from '@/constants/links'
import { ImageViewerModal } from '../reusable/ImageViewerModal'
import { Comment } from '@/types/comment.types'
import { commentService } from '@/services/comment.service'
import * as Clipboard from 'expo-clipboard';
import ActionSheet, { ActionSheetItem } from '../reusable/action-sheet'
import LoadingOverlay from '../reusable/loading-overlay'
import UpdateCommentModal from './UpdateCommentModal'
import ReportCommentModal from './ReportCommentModal'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import useAuthStore from '@/stores/auth.store'

type CommentsQueryData = InfiniteData<{ data: Comment[] }>

const CommentDetailsCard = ({ comment }: { comment: Comment }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();
    const currentUserId = useAuthStore(state => state.user?.id)
    const isOwnComment = currentUserId === comment.userId
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [updateCommentModalVisible, setUpdateCommentModalVisible] = useState(false);
    const [reportCommentModalVisible, setReportCommentModalVisible] = useState(false);

    const handleLikeComment = async () => {
        await queryClient.cancelQueries({ queryKey: commentKeys.all })
        await queryClient.cancelQueries({ queryKey: commentKeys.detail(comment.id) })
        const previousDataList = queryClient.getQueriesData<CommentsQueryData>({ queryKey: commentKeys.all })
        const previousComment = queryClient.getQueryData<Comment>(commentKeys.detail(comment.id))

        queryClient.setQueriesData<CommentsQueryData>(
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
        await queryClient.cancelQueries({ queryKey: commentKeys.detail(comment.id) })
        const previousDataList = queryClient.getQueriesData<CommentsQueryData>({ queryKey: commentKeys.all })
        const previousComment = queryClient.getQueryData<Comment>(commentKeys.detail(comment.id))
        queryClient.setQueriesData<CommentsQueryData>(
            { queryKey: commentKeys.all },
            (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((c) =>
                            c.id === comment.id
                                ? { ...c, isBookmarked: !c.isBookmarked }
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
                isBookmarked: !old.isBookmarked,
            }
        })
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
            queryClient.setQueryData(commentKeys.detail(comment.id), previousComment)
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while bookmarking the comment')
        }
    }

    const actions = useMemo<ActionSheetItem[]>(() => [
        ...(comment.content.trim().length > 0 ? [{
            label: 'Copy Text',
            icon: 'doc.on.doc' as const,
            onPress: handleCopyText,
        }] : []),
        ...(isOwnComment ? [
            { label: 'Edit Comment', icon: 'pencil' as const, onPress: () => setUpdateCommentModalVisible(true) },
            { label: 'Delete Comment', icon: 'trash' as const, color: '#ef4444', onPress: handleDeleteComment },
        ] : [
            { label: 'Report Comment', icon: 'flag' as const, color: '#ef4444', onPress: () => setReportCommentModalVisible(true) },
        ]),
    ], [comment.content, isOwnComment])

    const handleShareComment = async () => {
        try {
            const url = `${APP_WEB_URL}/comment/${comment.id}?postId=${comment.postId}`
            await Share.share({
                message: url,
            })
        } catch (error) {
            Alert.alert('Oops!', 'An error occurred while sharing the comment')
        }
    }

    const handleNavigateToProfile = () => {
        router.push(screens.user.profile(comment.user.id))
    }

    return (
        <Pressable className='flex-row items-start gap-3 p-4 border-b border-border dark:border-borderDark'>
            <Pressable onPress={handleNavigateToProfile}>
                <ProfileIcon avatarUrl={comment.user.avatar_url} className='h-14 w-14' />
            </Pressable>
            <View className='flex-1 min-w-0'>
                <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                    <ThemedText className='text-xl font-sans-bold' numberOfLines={1}>
                        {comment.user.name}
                    </ThemedText>
                    <Pressable onPress={() => setContextMenuVisible(true)} className="ml-auto p-1 -m-1" hitSlop={8}>
                        <IconSymbol name="ellipsis" size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                </View>
                {comment.is_deleted ? (
                    <ThemedText className='text-xl font-sans mt-2 text-muted dark:text-mutedDark'>
                        This comment has been deleted
                    </ThemedText>
                ) : (
                    <>
                        {comment.content.trim().length > 0 && (
                            <ThemedText className='text-xl font-sans mt-2'>{comment.content}</ThemedText>
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
                        <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans mt-2' numberOfLines={1}>
                            {new Date(comment.createdAt).toLocaleString()}
                        </ThemedText>
                    </>
                )}
                {!comment.is_deleted && (
                    <View className='flex-row items-center gap-6 mt-5'>
                        <Pressable onPress={handleLikeComment} className='flex-row items-center gap-1.5' hitSlop={8}>
                            <IconSymbol name={comment.isLiked ? 'heart.fill' : 'heart'} size={20} color={comment.isLiked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                            <ThemedText className={cn('text-sm font-sans', comment.isLiked ? 'text-accent dark:text-accentDark' : 'text-muted dark:text-mutedDark')}>
                                {comment.likes_count}
                            </ThemedText>
                        </Pressable>
                        <Pressable className='flex-row items-center gap-1.5' hitSlop={8}>
                            <IconSymbol name='message' size={20} color={Colors[colorScheme].muted} />
                            <ThemedText className='text-sm font-sans text-muted dark:text-mutedDark'>
                                {comment.replies_count}
                            </ThemedText>
                        </Pressable>
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
                    </View>
                )}
                <ImageViewerModal
                    visible={!!fullScreenImageUri}
                    imageUri={fullScreenImageUri}
                    onClose={() => setFullScreenImageUri(null)}
                />
                <LoadingOverlay visible={isDeleting} />
            </View>
            <UpdateCommentModal visible={updateCommentModalVisible} onRequestClose={() => setUpdateCommentModalVisible(false)} comment={comment} />
            <ReportCommentModal visible={reportCommentModalVisible} onRequestClose={() => setReportCommentModalVisible(false)} comment={comment} />
            <ActionSheet visible={contextMenuVisible} onClose={() => setContextMenuVisible(false)} actions={actions} />
        </Pressable>
    )
}

export default CommentDetailsCard

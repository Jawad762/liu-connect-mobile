import React, { useState } from 'react'
import { Alert, Pressable, View, ViewStyle } from 'react-native'
import MediaItem from '../reusable/MediaItem'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import Tag from '../reusable/tag'
import { IconSymbol } from '../reusable/icon-symbol'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { cn } from '@/utils/cn.utils'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { abbreviateMajor } from '@/utils/general.utils'
import { ImageViewerModal } from '../reusable/ImageViewerModal'
import { Comment } from '@/types/comment.types'
import { commentService } from '@/services/comment.service'

type CommentsQueryData = InfiniteData<{ data: Comment[] }>

const CommentDetailsCard = ({ comment }: { comment: Comment }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const handleLikeComment = async () => {
        const previousDataList = queryClient.getQueriesData<CommentsQueryData>({ queryKey: ['comments'] })
        const previousComment = queryClient.getQueryData<Comment>(['comment', comment.id])

        queryClient.setQueriesData<CommentsQueryData>(
            { queryKey: ['comments'] },
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

        queryClient.setQueryData(['comment', comment.id], (old: Comment | undefined) => {
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
            queryClient.setQueryData(['comment', comment.id], previousComment)
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while liking/unliking the comment')
        }
    }

    return (
        <Pressable className='flex-row gap-3 p-4 border-b border-border dark:border-borderDark'>
            <ProfileIcon avatarUrl={comment.user.avatar_url} />
            <View className='flex-1 min-w-0'>
                <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                    <ThemedText className='text-lg font-sans-bold' numberOfLines={1}>
                        {comment.user.name}
                    </ThemedText>
                    {comment.user.major && (
                        <Tag label={abbreviateMajor(comment.user.major)} />
                    )}
                    <Pressable className='ml-auto p-1 -m-1' hitSlop={8}>
                        <IconSymbol name='ellipsis' size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                </View>
                {comment.content.trim().length > 0 && (
                    <ThemedText className='text-xl font-sans mt-2'>{comment.content}</ThemedText>
                )}
                {comment.media.length > 0 && (
                    <View className='flex-row flex-wrap gap-2 mt-2'>
                        {comment.media.map((m, index) => {
                            const count = comment.media.length;
                            let itemStyle: ViewStyle = { width: '100%' };
                            if (count === 2) itemStyle = { width: '48%' };
                            else if (count === 3) itemStyle = index < 2 ? { width: '48%' } : { width: '100%' };
                            else if (count === 4) itemStyle = { width: '48%' };

                            return (
                                <MediaItem
                                    key={m.id}
                                    uri={m.media_url}
                                    type={m.type}
                                    style={itemStyle}
                                    onImagePress={() => m.type === 'IMAGE' && setFullScreenImageUri(m.media_url)}
                                />
                            )
                        })}
                    </View>
                )}
                <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans mt-2' numberOfLines={1}>
                    {new Date(comment.createdAt).toLocaleString()}
                </ThemedText>
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
                    <Pressable hitSlop={8}>
                        <IconSymbol name='bookmark' size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                    <Pressable hitSlop={8}>
                        <IconSymbol name='square.and.arrow.up' size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                </View>
                <ImageViewerModal
                    visible={!!fullScreenImageUri}
                    imageUri={fullScreenImageUri}
                    onClose={() => setFullScreenImageUri(null)}
                />
            </View>
        </Pressable>
    )
}

export default CommentDetailsCard

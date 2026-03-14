import { Post } from '@/types/post.types'
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
import { postService } from '@/services/post.service'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { abbreviateMajor } from '@/utils/general.utils'
import { ImageViewerModal } from '../reusable/ImageViewerModal'

type PostsQueryData = InfiniteData<{ data: Post[] }>

const PostDetailsCard = ({ post }: { post: Post }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const handleLikePost = async () => {
        const previousDataList = queryClient.getQueriesData<PostsQueryData>({ queryKey: ['posts'] })
        const previousPost = queryClient.getQueryData<Post>(['post', post.id])

        queryClient.setQueriesData<PostsQueryData>(
            { queryKey: ['posts'] },
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

        queryClient.setQueryData(['post', post.id], (old: Post | undefined) => {
            if (!old) return old
            return {
                ...old,
                isLiked: !old.isLiked,
                likes_count: old.isLiked ? old.likes_count - 1 : old.likes_count + 1,
            }
        })

        try {
            const result = post.isLiked ? await postService.unlikePost({ id: post.id }) : await postService.likePost({ id: post.id })
            if (!result.success) {
                throw new Error(result.message)
            }
        } catch (error) {
            previousDataList.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
            queryClient.setQueryData(['post', post.id], previousPost)
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while liking/unliking the post')
        }
    }

    return (
        <Pressable className='flex-row gap-3 p-4 border-b border-border dark:border-borderDark'>
            <ProfileIcon avatarUrl={post.user.avatar_url} />
            <View className='flex-1 min-w-0'>
                <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                    <ThemedText className='text-lg font-sans-bold' numberOfLines={1}>
                        {post.user.name}
                    </ThemedText>
                    {post.user.major && (
                        <Tag label={abbreviateMajor(post.user.major)} />
                    )}
                    <Pressable className='ml-auto p-1 -m-1' hitSlop={8}>
                        <IconSymbol name='ellipsis' size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                </View>
                {post.community && (
                    <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans mt-0.5'>
                        @{post.community.name}
                    </ThemedText>
                )}
                {post.content.trim().length > 0 && (
                    <ThemedText className='text-xl font-sans mt-2'>{post.content}</ThemedText>
                )}
                {post.media.length > 0 && (
                    <View className='flex-row flex-wrap gap-2 mt-2'>
                        {post.media.map((m, index) => {
                            const count = post.media.length;
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
                    {new Date(post.createdAt).toLocaleString()}
                </ThemedText>
                <View className='flex-row items-center gap-6 mt-5'>
                    <Pressable onPress={handleLikePost} className='flex-row items-center gap-1.5' hitSlop={8}>
                        <IconSymbol name={post.isLiked ? 'heart.fill' : 'heart'} size={20} color={post.isLiked ? Colors[colorScheme].accent : Colors[colorScheme].muted} />
                        <ThemedText className={cn('text-sm font-sans', post.isLiked ? 'text-accent dark:text-accentDark' : 'text-muted dark:text-mutedDark')}>
                            {post.likes_count}
                        </ThemedText>
                    </Pressable>
                    <Pressable className='flex-row items-center gap-1.5' hitSlop={8}>
                        <IconSymbol name='message' size={20} color={Colors[colorScheme].muted} />
                        <ThemedText className='text-sm font-sans text-muted dark:text-mutedDark'>
                            {post.comments_count}
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

export default PostDetailsCard

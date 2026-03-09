import { Post } from '@/types/post.types'
import React from 'react'
import { Alert, Image, Pressable, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import { formatDate } from '@/utils/date.utils'
import Tag from '../reusable/tag'
import { abbreviateMajor } from '@/utils/post.utils'
import { IconSymbol } from '../reusable/icon-symbol'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { cn } from '@/utils/cn.utils'
import { postService } from '@/services/post.service'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'

type PostsQueryData = InfiniteData<{ data: Post[] }>

const PostCard = ({ post }: { post: Post }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const queryClient = useQueryClient();

    const handleLikePost = async () => {
        const previousDataList = queryClient.getQueriesData<PostsQueryData>({ queryKey: ['posts'] })

        queryClient.setQueriesData<PostsQueryData>(
            { queryKey: ['posts'] },
            (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((p) =>
                            p.publicId === post.publicId
                                ? { ...p, isLiked: !p.isLiked, likes_count: p.isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                                : p
                        ),
                    })),
                }
            }
        )

        try {
            const result = post.isLiked ? await postService.unlikePost({ publicId: post.publicId }) : await postService.likePost({ publicId: post.publicId })
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

    return (
        <View className='flex-row gap-3 p-4 border-b border-border dark:border-borderDark'>
            <ProfileIcon avatarUrl={post.user.avatar_url} />
            <View className='flex-1 min-w-0'>
                <View className='flex-row flex-wrap items-center gap-x-2 gap-y-1'>
                    <ThemedText className='text-lg font-sans-bold' numberOfLines={1}>
                        {post.user.name}
                    </ThemedText>
                    {post.user.major && (
                        <Tag label={abbreviateMajor(post.user.major)} />
                    )}
                    <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans' numberOfLines={1}>
                        • {formatDate(post.createdAt)}
                    </ThemedText>
                    <Pressable className='ml-auto p-1 -m-1' hitSlop={8}>
                        <IconSymbol name='ellipsis' size={20} color={Colors[colorScheme].muted} />
                    </Pressable>
                </View>
                {post.community && (
                    <ThemedText className='text-sm text-muted dark:text-mutedDark font-sans mt-0.5'>
                        @{post.community.name}
                    </ThemedText>
                )}
                <ThemedText className='text-lg font-sans mt-2'>{post.content}</ThemedText>
                {post.media.length > 0 && (
                    <View className='flex-row flex-wrap gap-2 mt-3'>
                        {post.media.map((media) => (
                            <Image
                                key={media.id}
                                source={{ uri: media.media_url }}
                                className='w-full aspect-video rounded-xl'
                                resizeMode='cover'
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
            </View>
        </View>
    )
}

export default PostCard
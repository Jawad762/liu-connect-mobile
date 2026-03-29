import { Notification } from '@/types/notification.types'
import { formatRelativeDate } from '@/utils/date.utils'
import { screens } from '@/utils/screens.utils'
import { cn } from '@/utils/cn.utils'
import { Href, router } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'
import MediaItem from '../reusable/MediaItem'
import { inferMediaType } from '@/utils/media.utils'

const NotificationCard = ({ notification }: { notification: Notification }) => {
    const handleNavigateToActor = () => {
        router.push(screens.user.profile(notification.actorId))
    }

    const handlePress = () => {
        if (notification.redirect_url) {
            router.push(notification.redirect_url as Href)
        }
    }

    const bodyText = notification.body?.trim()

    return (
        <Pressable
            onPress={handlePress}
            className={cn(
                'flex-row items-start gap-3 p-4 border-b border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark',
                !notification.read && 'bg-muted/10 dark:bg-mutedDark/15'
            )}
        >
            <Pressable onPress={handleNavigateToActor}>
                <ProfileIcon avatarUrl={notification.actor.avatar_url} />
            </Pressable>
            <View className='flex-1 min-w-0 gap-1'>
                <ThemedText className='text-base font-sans-bold' numberOfLines={3}>
                    {notification.title}
                </ThemedText>
                {!!bodyText ? (
                    <ThemedText
                        className='text-sm font-sans text-muted dark:text-mutedDark'
                        numberOfLines={4}
                    >
                        {bodyText}
                    </ThemedText>
                ) : notification.media_url ? (
                    <MediaItem uri={notification.media_url} type={inferMediaType(notification.media_url)} onImagePress={() => handlePress()} />
                ) : null}
                <ThemedText className='text-xs font-sans text-muted dark:text-mutedDark mt-0.5'>
                    {formatRelativeDate(notification.createdAt)}
                </ThemedText>
            </View>
        </Pressable>
    )
}

export default NotificationCard

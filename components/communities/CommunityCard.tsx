import React from 'react'
import { Image, Pressable, View } from 'react-native'
import { Community } from '@/types/community.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import { ThemedText } from '../reusable/themed-text'
import { getInitials } from '@/utils/string.utils'

const CommunityCard = ({ community }: { community: Community }) => {
    const initials = getInitials(community.name)

    return (
        <Pressable
            onPress={() => router.push(screens.communities.details(community.id))}
            className="flex-row items-center gap-3 px-4 py-4 border-b border-border dark:border-borderDark active:bg-border active:dark:bg-borderDark"
        >
            {community.avatar_url ? (
                <Image source={{ uri: community.avatar_url }} className="w-14 h-14 rounded-xl" />
            ) : (
                <View className="w-14 h-14 rounded-xl bg-accent dark:bg-accentDark items-center justify-center">
                    <ThemedText className="text-lg font-sans-bold text-white">{initials}</ThemedText>
                </View>
            )}
            <View className="flex-1">
                <ThemedText className="text-base font-sans-semibold">{community.name}</ThemedText>
                {community.description ? (
                    <ThemedText
                        className="text-sm text-muted dark:text-mutedDark mt-0.5"
                        numberOfLines={2}
                    >
                        {community.description}
                    </ThemedText>
                ) : null}
            </View>
        </Pressable>
    )
}

export default CommunityCard

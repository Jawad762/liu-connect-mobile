import React from 'react'
import { Alert, Pressable, View } from 'react-native'
import { User } from '@/types/user.types'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import ProfileIcon from '../reusable/profile-icon'
import { ThemedText } from '../reusable/themed-text'
import { userService } from '@/services/user.service'
import { userKeys } from '@/utils/query-keys.utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../reusable/button'

const BlockedUserCard = ({ user }: { user: User }) => {
    const queryClient = useQueryClient()

    const unblockMutation = useMutation({
        mutationFn: () => userService.unblockUser(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.blocked.all })
            queryClient.invalidateQueries({ queryKey: userKeys.all })
        },
        onError: () => {
            Alert.alert('Error', 'Failed to unblock user. Please try again.')
        },
    })

    const handleUnblockPress = () => {
        Alert.alert(
            'Unblock User',
            `Are you sure you want to unblock ${user.name || 'this user'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Unblock', onPress: () => unblockMutation.mutate() },
            ]
        )
    }

    return (
        <Pressable
            onPress={() => router.push(screens.user.profile(user.id))}
            className="mx-4 my-1.5 overflow-hidden rounded-2xl border border-border dark:border-borderDark"
        >
            <View className="flex-1 flex-row items-center gap-3 px-4 py-3">
                <View className="flex-1 flex-row items-center gap-3">
                    <ProfileIcon avatarUrl={user.avatar_url} className="w-12 h-12" />
                    <ThemedText className="text-base font-semibold flex-shrink" numberOfLines={1}>
                        {user.name || 'Unknown User'}
                    </ThemedText>
                </View>

                <Button
                    variant="outline"
                    size="sm"
                    onPress={handleUnblockPress}
                    disabled={unblockMutation.isPending}
                    loading={unblockMutation.isPending}
                    className='m-auto'
                >
                    Unblock
                </Button>
            </View>
        </Pressable>
    )
}

export default BlockedUserCard

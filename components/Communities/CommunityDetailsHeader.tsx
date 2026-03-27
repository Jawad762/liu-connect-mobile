import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Community } from '@/types/community.types'
import { ThemedText } from '../reusable/themed-text'
import { Button, GradientButton } from '../reusable/button'
import useAuthStore from '@/stores/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { communityKeys } from '@/utils/query-keys.utils'
import { communityService } from '@/services/community.service'
import { Alert } from 'react-native'
import UpdateCommunityModal from './UpdateCommunityModal'
import ConfirmationDialog from '../reusable/confirmation-dialog'
import { IconSymbol } from '../reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import CommunityBanner from './CommunityBanner'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CommunityDetailsHeader = ({
    community,
    onRefetch,
}: {
    community: Community
    onRefetch?: () => void
}) => {
    const insets = useSafeAreaInsets()
    const user = useAuthStore((state) => state.user)
    const queryClient = useQueryClient()
    const { colorScheme = 'light' } = useColorScheme()
    const [joinLoading, setJoinLoading] = useState(false)
    const [leaveLoading, setLeaveLoading] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
    const [leaveDialogVisible, setLeaveDialogVisible] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const isOwner = user?.id === community.createdById

    const handleJoin = async () => {
        try {
            setJoinLoading(true)
            const result = await communityService.joinCommunity(community.id)
            if (!result.success) throw new Error(result.message)
            queryClient.invalidateQueries({ queryKey: communityKeys.detail(community.id) })
            queryClient.invalidateQueries({ queryKey: communityKeys.all })
            onRefetch?.()
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'Failed to join community'
            )
        } finally {
            setJoinLoading(false)
        }
    }

    const handleLeaveConfirm = async () => {
        try {
            setLeaveLoading(true)
            const result = await communityService.leaveCommunity(community.id)
            if (!result.success) throw new Error(result.message)
            queryClient.invalidateQueries({ queryKey: communityKeys.detail(community.id) })
            queryClient.invalidateQueries({ queryKey: communityKeys.all })
            onRefetch?.()
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'Failed to leave community'
            )
        } finally {
            setLeaveLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            const result = await communityService.deleteCommunity(community.id)
            if (!result.success) throw new Error(result.message)
            setDeleteDialogVisible(false)
            queryClient.invalidateQueries({ queryKey: communityKeys.all })
            onRefetch?.()
            router.replace(screens.communities.index)
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'Failed to delete community'
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <View className="border-b border-border dark:border-borderDark relative">
            <CommunityBanner avatarUrl={community.avatar_url} name={community.name} />
            {router.canGoBack() && (
                <Pressable style={{ top: insets.top + 8, left: 16 }} onPress={() => router.back()} className='absolute  p-2 rounded-full bg-background dark:bg-backgroundDark'>
                    <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].foreground} />
                </Pressable>
            )}
            <View className="px-4 pb-4 pt-4">
                <ThemedText className="text-xl font-sans-bold">{community.name}</ThemedText>
                {community.description ? (
                    <ThemedText className="text-sm text-muted dark:text-mutedDark mt-1">
                        {community.description}
                    </ThemedText>
                ) : null}

            <View className="flex-row gap-2 mt-4">
                {isOwner ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => setEditModalVisible(true)}
                            className="flex-1"
                            leftIcon={<IconSymbol name="pencil" size={16} color={Colors[colorScheme].foreground} />}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => setDeleteDialogVisible(true)}
                            className="flex-1"
                            leftIcon={<IconSymbol name="trash" size={16} color={Colors[colorScheme].foreground} />}
                        >
                            Delete
                        </Button>
                    </>
                ) : (
                    <>
                        {community.isJoined ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onPress={() => setLeaveDialogVisible(true)}
                                loading={leaveLoading}
                                disabled={leaveLoading}
                                className="flex-1"
                            >
                                Leave
                            </Button>
                        ) : (
                            <GradientButton
                                size="sm"
                                onPress={handleJoin}
                                loading={joinLoading}
                                disabled={joinLoading}
                                className="flex-1"
                                textClassName="text-white"
                            >
                                Join
                            </GradientButton>
                        )}
                    </>
                )}
            </View>
            </View>

            <UpdateCommunityModal
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
                community={community}
            />
            <ConfirmationDialog
                visible={deleteDialogVisible}
                onRequestClose={() => !deleteLoading && setDeleteDialogVisible(false)}
                title="Delete community"
                message="Are you sure? This cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogVisible(false)}
                loading={deleteLoading}
            />
            <ConfirmationDialog
                visible={leaveDialogVisible}
                onRequestClose={() => !leaveLoading && setLeaveDialogVisible(false)}
                title="Leave community"
                message="Are you sure you want to leave this community?"
                onConfirm={async () => {
                    await handleLeaveConfirm()
                    setLeaveDialogVisible(false)
                }}
                onCancel={() => setLeaveDialogVisible(false)}
                loading={leaveLoading}
            />
        </View>
    )
}

export default CommunityDetailsHeader

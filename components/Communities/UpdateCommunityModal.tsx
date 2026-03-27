import { Colors } from '@/constants/theme'
import type { Community } from '@/types/community.types'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, GradientButton } from '../reusable/button'
import useAuthStore from '@/stores/auth.store'
import { Redirect } from 'expo-router'
import { communityService } from '@/services/community.service'
import { useQueryClient } from '@tanstack/react-query'
import { communityKeys } from '@/utils/query-keys.utils'
import { screens } from '@/utils/screens.utils'
import { ThemedText } from '../reusable/themed-text'
import useImageUpload from '@/hooks/useImageUpload'
import LoadingOverlay from '../reusable/loading-overlay'
import CommunityBanner from './CommunityBanner'
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@/constants/general'
import { IconSymbol } from '../reusable/icon-symbol'

const UpdateCommunityModal = ({
    visible,
    onRequestClose,
    community,
}: {
    visible: boolean
    onRequestClose: () => void
    community: Community
}) => {
    const { colorScheme = 'light' } = useColorScheme()
    const [name, setName] = useState(community.name)
    const [description, setDescription] = useState(community.description ?? '')
    const [loading, setLoading] = useState(false)
    const insets = useSafeAreaInsets()
    const user = useAuthStore((state) => state.user)
    const queryClient = useQueryClient()
    const initialAvatar = community.avatar_url ? [{ url: community.avatar_url, type: 'IMAGE' as const }] : []
    const { media, resetMedia, isUploading, handlePickFromLibrary, handleRemoveMedia } = useImageUpload(initialAvatar)
    const avatarUrl = media.length > 0 ? media[0].url : null

    const handleUpdate = async () => {
        const trimmedName = name.trim()
        if (!trimmedName) {
            Alert.alert('Oops!', 'Community name is required')
            return
        }
        if (trimmedName.length < NAME_MIN_LENGTH) {
            Alert.alert('Oops!', `Name must be at least ${NAME_MIN_LENGTH} characters`)
            return
        }
        if (trimmedName.length > NAME_MAX_LENGTH) {
            Alert.alert('Oops!', `Name must be less than ${NAME_MAX_LENGTH} characters`)
            return
        }
        try {
            setLoading(true)
            const result = await communityService.updateCommunity(community.id, {
                name: trimmedName,
                description: description.trim() || null,
                avatar_url: avatarUrl,
            })
            if (!result.success) throw new Error(result.message)
            queryClient.invalidateQueries({ queryKey: communityKeys.all })
            queryClient.invalidateQueries({ queryKey: communityKeys.detail(community.id) })
            onRequestClose()
            Alert.alert('Success', 'Community updated successfully')
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'An error occurred while updating the community'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (visible) {
            setName(community.name)
            setDescription(community.description ?? '')
            resetMedia(community.avatar_url ? [{ url: community.avatar_url, type: 'IMAGE' as const }] : [])
        }
    }, [visible, community])

    if (!user) {
        return <Redirect href={screens.auth.login} />
    }

    const hasChanges =
        name.trim() !== community.name ||
        (description.trim() || null) !== (community.description ?? null) ||
        avatarUrl !== (community.avatar_url ?? null)

    return (
        <Modal
            visible={visible}
            onRequestClose={onRequestClose}
            animationType="slide"
            backdropColor={Colors[colorScheme].background}
        >
            <View style={{
                paddingTop: Platform.select({ ios: insets.top, android: insets.top + 8, default: insets.top }),
            }} className="flex-row items-center justify-between p-4">
                <Button
                    variant="outline"
                    size="sm"
                    onPress={onRequestClose}
                    disabled={loading}
                    className="min-w-20"
                    textClassName="text-sm"
                >
                    Cancel
                </Button>
                <GradientButton
                    size="sm"
                    onPress={handleUpdate}
                    disabled={loading || !hasChanges}
                    className="min-w-24"
                    textClassName="text-sm text-white"
                    loading={loading}
                >
                    Save Changes
                </GradientButton>
            </View>

            <View className='relative'>
                <CommunityBanner
                    avatarUrl={avatarUrl}
                    name={name.trim() || community.name}
                    onPress={() => !loading && !isUploading && handlePickFromLibrary()}
                />
                {avatarUrl && (
                    <Pressable style={{ top: 16, right: 16 }} className='absolute' onPress={() => handleRemoveMedia(0)} disabled={loading}>
                        <IconSymbol name="trash" size={24} color={Colors[colorScheme].foreground} />
                    </Pressable>
                )}
            </View>

            <KeyboardAvoidingView
                className="flex-1 mt-4"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="flex-1 px-4 pb-8"
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="mb-5">
                        <ThemedText className="text-base font-sans-medium mb-2">Name</ThemedText>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Community name"
                            placeholderTextColor={Colors[colorScheme].muted}
                            className="h-14 rounded-[28px] border border-border dark:border-borderDark bg-surface dark:bg-surfaceDark px-6 text-white font-sans text-base"
                            maxLength={NAME_MAX_LENGTH}
                            editable={!loading}
                        />
                        <ThemedText className='text-xs text-right mt-1' style={{ color: Colors[colorScheme].muted }}>
                            {name.length}/{NAME_MAX_LENGTH}
                        </ThemedText>
                    </View>

                    <View className="mb-5">
                        <ThemedText className="text-base font-sans-medium mb-2">Description (optional)</ThemedText>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="What's this community about?"
                            placeholderTextColor={Colors[colorScheme].muted}
                            className="min-h-[100px] rounded-2xl border border-border dark:border-borderDark bg-surface dark:bg-surfaceDark px-6 py-4 text-white font-sans text-base"
                            multiline
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            editable={!loading}
                        />
                        <ThemedText className='text-xs text-right mt-1' style={{ color: Colors[colorScheme].muted }}>
                            {description.length}/{DESCRIPTION_MAX_LENGTH}
                        </ThemedText>
                    </View>
                </ScrollView>
                <LoadingOverlay visible={isUploading} />
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default UpdateCommunityModal

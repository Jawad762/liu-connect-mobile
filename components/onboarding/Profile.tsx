import React, { useEffect, useState } from 'react'
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native'
import { Button, GradientButton } from '../reusable/button'
import { ThemedText } from '../reusable/themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileIcon from '../reusable/profile-icon'
import { User } from '@/types/user.types'
import { IconSymbol } from '../reusable/icon-symbol'
import useImageUpload from '@/hooks/useImageUpload'
import { userService } from '@/services/user.service'
import { userKeys } from '@/utils/query-keys.utils'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/stores/auth.store'
import LoadingOverlay from '../reusable/loading-overlay'
import { BIO_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@/constants/general'
import { ThemedView } from '../reusable/themed-view'
import { AnalyzeScheduleResponse } from '@/types/ai.types'
import SchoolMajorModal, { PickerMode } from './SchoolMajorModal'
import { LIU_MAJORS_BY_SCHOOL, LiusMajor, LiusSchool } from '@/constants/academics'

const Profile = ({
    user,
    aiResponse,
    onNext,
    onBack,
}: {
    user: User
    aiResponse: AnalyzeScheduleResponse | null
    onNext: () => void
    onBack: () => void
}) => {
    const [name, setName] = useState(aiResponse?.name ?? user.name ?? '')
    const [bio, setBio] = useState(user.bio ?? '')
    const [school, setSchool] = useState<LiusSchool | null>(null)
    const [major, setMajor] = useState<LiusMajor | null>(null)
    const [pickerVisible, setPickerVisible] = useState(false)
    const [pickerMode, setPickerMode] = useState<PickerMode>('school')

    const { width } = useWindowDimensions()
    const { colorScheme = 'light' } = useColorScheme()
    const { user: authUser, setUser } = useAuthStore()
    const insets = useSafeAreaInsets()
    const {
        media: avatarMedia,
        resetMedia: resetAvatarMedia,
        isUploading: isUploadingAvatar,
        handlePickFromLibrary: pickAvatarFromLibrary,
    } = useImageUpload()
    const {
        media: coverMedia,
        resetMedia: resetCoverMedia,
        isUploading: isUploadingCover,
        handlePickFromLibrary: pickCoverFromLibrary,
    } = useImageUpload()
    const avatarUrl = avatarMedia.length > 0 ? avatarMedia[0].url : user.avatar_url
    const coverUrl = coverMedia.length > 0 ? coverMedia[0].url : user.cover_url
    const queryClient = useQueryClient()
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)

    useEffect(() => {
        setName(aiResponse?.name ?? user.name ?? '')
        setBio(user.bio ?? '')
        resetAvatarMedia()
        resetCoverMedia()
    }, [aiResponse])

    const openPicker = (mode: PickerMode) => {
        setPickerMode(mode)
        setPickerVisible(true)
    }

    const handleSelectSchool = (selected: LiusSchool) => {
        setSchool(selected)
        // Reset major if it no longer belongs to the newly selected school
        if (major && !(LIU_MAJORS_BY_SCHOOL[selected] as readonly string[]).includes(major)) {
            setMajor(null)
        }
    }

    const handleSave = async () => {
        if (name.trim().length < NAME_MIN_LENGTH) {
            Alert.alert('Invalid name', `Name must be at least ${NAME_MIN_LENGTH} characters.`)
            return
        }
        try {
            setProfileUpdateLoading(true)
            const result = await userService.updateProfile({
                name,
                bio,
                avatar_url: avatarUrl,
                cover_url: coverUrl,
                school: school ?? undefined,
                major: major ?? undefined,
            })
            if (!result.success) throw new Error(result.message)
            queryClient.invalidateQueries({ queryKey: userKeys.all })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) })
            if (authUser) {
                setUser({ ...authUser, name, bio, avatar_url: avatarUrl, cover_url: coverUrl, school, major })
            }
            onNext()
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'An error occurred while updating the profile'
            )
        } finally {
            setProfileUpdateLoading(false)
        }
    }

    return (
        <ThemedView className="flex-1" style={{ width }}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ paddingLeft: insets.left, paddingRight: insets.right }}
            >
                <View className="flex-row items-center justify-between px-4 pb-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onPress={onBack}
                        className="min-w-20"
                        textClassName="text-sm"
                    >
                        ← Back
                    </Button>
                    <ThemedText style={{ marginTop: -6 }} className="text-xl font-sans-bold">
                        Your Profile
                    </ThemedText>
                    <GradientButton
                        size="sm"
                        onPress={handleSave}
                        loading={profileUpdateLoading}
                        disabled={profileUpdateLoading}
                        className="min-w-20"
                        textClassName="text-sm text-white"
                    >
                        Continue
                    </GradientButton>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <Pressable
                        style={{ height: 110, backgroundColor: Colors[colorScheme].surface }}
                        className="w-full"
                        onPress={pickCoverFromLibrary}
                    >
                        {coverUrl && (
                            <Image source={{ uri: coverUrl }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                        )}
                        <View
                            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            className="absolute items-center justify-center"
                        >
                            <IconSymbol name="photo.on.rectangle.angled" size={28} color="white" />
                        </View>
                    </Pressable>
                    <View style={{ marginTop: -36 }} className="px-4 pb-8 gap-1">
                        <Pressable onPress={pickAvatarFromLibrary} className="relative w-20 h-20 mb-3">
                            <ProfileIcon avatarUrl={avatarUrl} className="w-full h-full" />
                            <View
                                style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                className="absolute items-center justify-center"
                            >
                                <IconSymbol name="photo.on.rectangle.angled" size={28} color="white" />
                            </View>
                        </Pressable>

                        {/* Name */}
                        <View
                            className="flex-row border-b border-border dark:border-borderDark items-center"
                            style={{ gap: 12, paddingVertical: 14 }}
                        >
                            <ThemedText className="text-base font-sans-medium" style={{ width: 52 }}>
                                Name
                            </ThemedText>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                maxLength={NAME_MAX_LENGTH}
                                style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
                                className="text-accent dark:text-accentDark"
                                placeholder="Your name"
                                placeholderTextColor={Colors[colorScheme].muted}
                            />
                            <ThemedText className="text-xs" style={{ color: Colors[colorScheme].muted }}>
                                {name.length}/{NAME_MAX_LENGTH}
                            </ThemedText>
                        </View>

                        {/* Bio */}
                        <View
                            className="flex-row border-b border-border dark:border-borderDark items-start"
                            style={{ gap: 12, paddingVertical: 14 }}
                        >
                            <ThemedText
                                className="text-base font-sans-medium"
                                style={{ width: 52, marginTop: Platform.OS === 'ios' ? 1 : 2 }}
                            >
                                Bio
                            </ThemedText>
                            <View className="flex-1">
                                <TextInput
                                    value={bio}
                                    onChangeText={setBio}
                                    maxLength={BIO_MAX_LENGTH}
                                    style={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        minHeight: 80,
                                        textAlignVertical: 'top',
                                    }}
                                    className="text-accent dark:text-accentDark"
                                    placeholder="Write something about yourself..."
                                    placeholderTextColor={Colors[colorScheme].muted}
                                    multiline
                                    numberOfLines={4}
                                />
                                <ThemedText
                                    className="text-xs text-right mt-1"
                                    style={{ color: Colors[colorScheme].muted }}
                                >
                                    {bio.length}/{BIO_MAX_LENGTH}
                                </ThemedText>
                            </View>
                        </View>

                        {/* School picker */}
                        <Pressable
                            onPress={() => openPicker('school')}
                            className="flex-row border-b border-border dark:border-borderDark items-center"
                            style={{ gap: 12, paddingVertical: 14 }}
                        >
                            <ThemedText className="text-base font-sans-medium" style={{ width: 52 }}>
                                School
                            </ThemedText>
                            <ThemedText
                                className="flex-1 text-base"
                                numberOfLines={1}
                                style={{
                                    color: school
                                        ? Colors[colorScheme].foreground
                                        : Colors[colorScheme].muted,
                                }}
                            >
                                {school ?? 'Select school'}
                            </ThemedText>
                            <IconSymbol
                                name="chevron.right"
                                size={16}
                                color={Colors[colorScheme].muted}
                            />
                        </Pressable>

                        {/* Major picker */}
                        <Pressable
                            onPress={() => {
                                if (school) openPicker('major')
                            }}
                            className="flex-row border-b border-border dark:border-borderDark items-center"
                            style={{
                                gap: 12,
                                paddingVertical: 14,
                                opacity: school ? 1 : 0.4,
                            }}
                        >
                            <ThemedText className="text-base font-sans-medium" style={{ width: 52 }}>
                                Major
                            </ThemedText>
                            <ThemedText
                                className="flex-1 text-base"
                                numberOfLines={1}
                                style={{
                                    color: major
                                        ? Colors[colorScheme].foreground
                                        : Colors[colorScheme].muted,
                                }}
                            >
                                {major ?? (school ? 'Select major' : 'Select school first')}
                            </ThemedText>
                            <IconSymbol
                                name="chevron.right"
                                size={16}
                                color={Colors[colorScheme].muted}
                            />
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <LoadingOverlay visible={isUploadingAvatar || isUploadingCover} />

            <SchoolMajorModal
                visible={pickerVisible}
                mode={pickerMode}
                selectedSchool={school}
                selectedMajor={major}
                onSelectSchool={handleSelectSchool}
                onSelectMajor={setMajor}
                onClose={() => setPickerVisible(false)}
            />
        </ThemedView>
    )
}

export default Profile

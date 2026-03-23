import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, View } from 'react-native'
import { Button, GradientButton } from '../reusable/button'
import { ThemedText } from '../reusable/themed-text';
import { Colors } from '@/constants/theme-colors';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileIcon from '../reusable/profile-icon';
import { User } from '@/types/user.types';
import { IconSymbol } from '../reusable/icon-symbol';
import useImageUpload from '@/hooks/useImageUpload';
import { userService } from '@/services/user.service';
import { userKeys } from '@/utils/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/auth.store';
import LoadingOverlay from '../reusable/loading-overlay';
import { BIO_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@/constants/general';

const EditProfileModal = ({ visible, onRequestClose, user }: { visible: boolean; onRequestClose: () => void, user: User }) => {
    const [name, setName] = useState(user.name ?? '');
    const [bio, setBio] = useState(user.bio ?? '');

    const { colorScheme = 'light' } = useColorScheme();
    const { user: authUser, setUser } = useAuthStore()
    const insets = useSafeAreaInsets();
    const {
        media: avatarMedia,
        resetMedia: resetAvatarMedia,
        isUploading: isUploadingAvatar,
        handlePickFromLibrary: pickAvatarFromLibrary
    } = useImageUpload();
    const {
        media: coverMedia,
        resetMedia: resetCoverMedia,
        isUploading: isUploadingCover,
        handlePickFromLibrary: pickCoverFromLibrary
    } = useImageUpload();
    const avatarUrl = avatarMedia.length > 0 ? avatarMedia[0].url : user.avatar_url;
    const coverUrl = coverMedia.length > 0 ? coverMedia[0].url : user.cover_url;
    const queryClient = useQueryClient();
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setName(user.name ?? '');
            setBio(user.bio ?? '');
            resetAvatarMedia();
            resetCoverMedia();
        }
    }, [visible]);

    const handleSave = async () => {
        if (name.trim().length < NAME_MIN_LENGTH) {
            Alert.alert('Invalid name', `Name must be at least ${NAME_MIN_LENGTH} characters.`);
            return;
        }
        try {
            setProfileUpdateLoading(true);
            const result = await userService.updateProfile({ name, bio, avatar_url: avatarUrl, cover_url: coverUrl });
            if (!result.success) throw new Error(result.message);
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
            if (authUser) {
                setUser({ ...authUser, name, bio, avatar_url: avatarUrl, cover_url: coverUrl, school: authUser.school, major: authUser.major });
            }
            onRequestClose();
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while updating the profile');
        } finally {
            setProfileUpdateLoading(false);
        }
    }

    const disableSave = useMemo(() => {
        return (
            name === (user.name ?? '') &&
            bio === (user.bio ?? '') &&
            avatarUrl === user.avatar_url &&
            coverUrl === user.cover_url
        );
    }, [name, bio, avatarUrl, coverUrl, user.name, user.bio, user.avatar_url, user.cover_url]);

    return (
        <Modal visible={visible} onRequestClose={onRequestClose} animationType="slide" backdropColor={Colors[colorScheme].background}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    paddingTop: Platform.select({ ios: insets.top, android: insets.top + 12, default: insets.top }),
                }}
            >
                <View className='flex-row items-center justify-between px-4 pb-3'>
                    <Button
                        variant='outline'
                        size='sm'
                        onPress={() => { resetAvatarMedia(); resetCoverMedia(); onRequestClose(); }}
                        className='min-w-20'
                        textClassName='text-sm'
                    >
                        Cancel
                    </Button>
                    <ThemedText style={{ marginTop: -6 }} className='text-xl font-sans-bold'>Edit Profile</ThemedText>
                    <GradientButton
                        size='sm'
                        onPress={handleSave}
                        loading={profileUpdateLoading}
                        disabled={profileUpdateLoading || disableSave}
                        className='min-w-20'
                        textClassName='text-sm text-white'
                    >
                        Save
                    </GradientButton>
                </View>
                <Pressable style={{ height: 130, backgroundColor: Colors[colorScheme].surface }} className='w-full relative' onPress={pickCoverFromLibrary}>
                    {coverUrl && (
                        <Image source={{ uri: coverUrl }} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                    )}
                    <View style={{ top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} className='absolute'>
                        <IconSymbol name='photo.on.rectangle.angled' size={32} color='white' />
                    </View>
                </Pressable>
                <View style={{ marginTop: -32 }} className='px-4 pb-4 gap-1'>
                    <Pressable onPress={pickAvatarFromLibrary} className='relative w-20 h-20 mb-2'>
                        <ProfileIcon avatarUrl={avatarUrl} className='w-full h-full' />
                        <View style={{ top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} className='absolute'>
                            <IconSymbol name='photo.on.rectangle.angled' size={32} color='white' />
                        </View>
                    </Pressable>
                    <View
                        className='flex-row border-b border-border dark:border-borderDark items-center'
                        style={{ gap: 12, paddingVertical: 14 }}
                    >
                        <ThemedText className='text-base font-sans-medium' style={{ width: 44 }}>Name</ThemedText>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            maxLength={NAME_MAX_LENGTH}
                            style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
                            className='text-accent dark:text-accentDark'
                            placeholder='Your name'
                            placeholderTextColor={Colors[colorScheme].muted}
                        />
                        <ThemedText className='text-xs text-right mt-1' style={{ color: Colors[colorScheme].muted }}>
                            {name.length}/{NAME_MAX_LENGTH}
                        </ThemedText>
                    </View>
                    <View
                        className='flex-row border-b border-border dark:border-borderDark items-start'
                        style={{ gap: 12, paddingVertical: 14 }}
                    >
                        <ThemedText
                            className='text-base font-sans-medium'
                            style={{ width: 44, marginTop: Platform.OS === 'ios' ? 1 : 2 }}
                        >
                            Bio
                        </ThemedText>
                        <View className='flex-1'>
                            <TextInput
                                value={bio}
                                onChangeText={setBio}
                                maxLength={BIO_MAX_LENGTH}
                                style={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    minHeight: 88,
                                    textAlignVertical: 'top',
                                }}
                                className='text-accent dark:text-accentDark'
                                placeholder='Write something about yourself...'
                                placeholderTextColor={Colors[colorScheme].muted}
                                multiline
                                numberOfLines={4}
                            />
                            <ThemedText className='text-xs text-right mt-1' style={{ color: Colors[colorScheme].muted }}>
                                {bio.length}/{BIO_MAX_LENGTH}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <LoadingOverlay visible={isUploadingAvatar || isUploadingCover} />
        </Modal>
    )
}

export default EditProfileModal
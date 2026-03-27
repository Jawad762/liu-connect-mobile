import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, GradientButton } from '../reusable/button';
import { IconSymbol } from '../reusable/icon-symbol';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';
import { postService } from '@/services/post.service';
import { validatePost } from '@/utils/post.utils';
import { getMediaItemStyle } from '@/utils/media-utils';
import useMediaUpload from '@/hooks/useMediaUpload';
import LoadingOverlay from '../reusable/loading-overlay';
import { ThemedText } from '../reusable/themed-text';
import MediaItem from '../reusable/MediaItem';
import { POST_CONTENT_MAX_LENGTH, POST_MEDIA_MAX_COUNT } from '@/constants/general';
import { ImageViewerModal } from '../reusable/ImageViewerModal';
import { useQueryClient } from '@tanstack/react-query';
import { screens } from '@/utils/screens';
import { postKeys } from '@/utils/query-keys';
import CommunityPickerModal from '../communities/CommunityPickerModal';

interface InitialCommunity {
    id: string
    name: string
}

const CreatePostModal = ({
    visible,
    onRequestClose,
    initialCommunity,
}: {
    visible: boolean
    onRequestClose: () => void
    initialCommunity?: InitialCommunity | null
}) => {
    const { colorScheme: colorScheme = 'light' } = useColorScheme();
    const [content, setContent] = useState('');
    const [postCreationLoading, setPostCreationLoading] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState<{ id: string, name: string } | null>(initialCommunity ?? null);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);
    const [communityPickerVisible, setCommunityPickerVisible] = useState(false);

    const { media, resetMedia, isUploading, atLimit, remainingSlots, handlePickFromLibrary, handlePickFromCamera, handleRemoveMedia } = useMediaUpload(POST_MEDIA_MAX_COUNT);

    const handleClose = () => onRequestClose();

    const handlePost = async () => {
        try {
            setPostCreationLoading(true);
            const contentValidation = validatePost(content, media);
            if (!contentValidation.success) throw new Error(contentValidation.message);
            const result = await postService.createPost({ content, communityId: selectedCommunity?.id ?? null, media });
            if (!result.success) throw new Error(result.message);
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            setContent('');
            resetMedia();
            onRequestClose();
            Alert.alert('Success', 'Post created successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while creating the post');
        } finally {
            setPostCreationLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            textInputRef.current?.focus();
        }
    }, [visible]);

    useEffect(() => {
        if (visible) {
            setSelectedCommunity(initialCommunity ?? null);
        } else {
            setContent('');
            resetMedia();
            setSelectedCommunity(null);
        }
    }, [visible, initialCommunity]);

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onRequestClose}
            animationType="slide"
            backdropColor={Colors[colorScheme].background}
        >
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    paddingTop: Platform.select({ ios: insets.top, android: insets.top + 8, default: insets.top }),
                }}
            >
                <View className='flex-row items-center justify-between px-4 pb-3'>
                    <Button
                        variant='outline'
                        size='sm'
                        onPress={handleClose}
                        disabled={postCreationLoading}
                        className='min-w-20'
                        textClassName='text-sm'
                    >
                        Cancel
                    </Button>
                    <GradientButton
                        size='sm'
                        onPress={handlePost}
                        disabled={postCreationLoading}
                        className='min-w-20'
                        textClassName='text-sm text-white'
                        loading={postCreationLoading}
                    >
                        Post
                    </GradientButton>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='flex-1 flex-row items-start px-4'>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                    <View className='flex-1'>
                        <Pressable
                            onPress={() => setCommunityPickerVisible(true)}
                            style={{ marginLeft: 16, alignSelf: 'flex-start' }}
                            className='flex-row items-center gap-2 mb-3 py-2 px-3 rounded-full border border-border dark:border-borderDark'
                        >
                            <ThemedText className='text-sm font-sans-medium text-accent dark:text-accentDark'>
                                {selectedCommunity?.name ? `${selectedCommunity.name}` : 'Everyone'}
                            </ThemedText>
                            <IconSymbol name='chevron.down' size={16} color={Colors[colorScheme].accent} />
                        </Pressable>
                        <TextInput
                            ref={textInputRef}
                            onChangeText={setContent}
                            value={content}
                            multiline
                            scrollEnabled={false}
                            maxLength={POST_CONTENT_MAX_LENGTH}
                            placeholder='What are you thinking?'
                            placeholderTextColor={Colors[colorScheme].muted}
                            style={{ minHeight: 48 }}
                            className='px-6 text-white font-sans text-xl mb-4'
                        />

                        {media.length > 0 && (
                            <View className='flex-row flex-wrap gap-2'>
                                {media.map((m, index) => (
                                    <MediaItem
                                        key={`${m.url}-${index}`}
                                        uri={m.url}
                                        type={m.type}
                                        style={getMediaItemStyle(media.length, index) as ViewStyle}
                                        onRemove={() => handleRemoveMedia(index)}
                                        onImagePress={() => setFullScreenImageUri(m.url)}
                                    />
                                ))}
                            </View>
                        )}

                        <View className='mt-3 flex-row items-center gap-4'>
                            <Pressable
                                onPress={handlePickFromLibrary}
                                disabled={isUploading}
                                style={{ padding: 8, opacity: atLimit ? 0.4 : 1 }}
                            >
                                <IconSymbol name='photo.on.rectangle.angled' size={24} color={Colors[colorScheme].accent} />
                            </Pressable>
                            <Pressable
                                onPress={handlePickFromCamera}
                                disabled={isUploading}
                                style={{ padding: 8, opacity: atLimit ? 0.4 : 1 }}
                            >
                                <IconSymbol name='camera.fill' size={24} color={Colors[colorScheme].accent} />
                            </Pressable>
                            {media.length > 0 && (
                                <ThemedText className='text-xs font-sans text-muted dark:text-mutedDark'>
                                    {atLimit ? `${POST_MEDIA_MAX_COUNT}/${POST_MEDIA_MAX_COUNT} · Max reached` : `${media.length}/${POST_MEDIA_MAX_COUNT} · ${remainingSlots} left`}
                                </ThemedText>
                            )}
                        </View>
                    </View>
                </ScrollView>

                <CommunityPickerModal
                    visible={communityPickerVisible}
                    onRequestClose={() => setCommunityPickerVisible(false)}
                    currentCommunity={selectedCommunity}
                    setCurrentCommunity={(community) => {
                        setSelectedCommunity(community ?? null);
                    }}
                />
                <LoadingOverlay visible={isUploading} />
                <ImageViewerModal
                    visible={!!fullScreenImageUri}
                    imageUri={fullScreenImageUri}
                    onClose={() => setFullScreenImageUri(null)}
                />
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreatePostModal;

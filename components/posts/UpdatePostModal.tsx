import { Colors } from '@/constants/theme';
import type { Post } from '@/types/post.types';
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
import { screens } from '@/utils/screens.utils';
import { validatePost } from '@/utils/post.utils';
import { getMediaItemStyle } from '@/utils/media.utils';
import useMediaUpload from '@/hooks/useMediaUpload';
import LoadingOverlay from '../reusable/loading-overlay';
import { ThemedText } from '../reusable/themed-text';
import MediaItem from '../reusable/MediaItem';
import { POST_CONTENT_MAX_LENGTH, POST_MEDIA_MAX_COUNT } from '@/constants/general';
import { ImageViewerModal } from '../reusable/ImageViewerModal';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/utils/query-keys.utils';

const UpdatePostModal = ({ visible, onRequestClose, post }: { visible: boolean; onRequestClose: () => void; post: Post }) => {
    const { colorScheme: colorScheme = 'light' } = useColorScheme();
    const [content, setContent] = useState(post.content);
    const [postUpdateLoading, setPostUpdateLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const initialMedia = (post.media ?? []).map((m) => ({ url: m.media_url, type: m.type }));
    const { media, resetMedia, isUploading, atLimit, remainingSlots, handlePickFromLibrary, handlePickFromCamera, handleRemoveMedia } = useMediaUpload(POST_MEDIA_MAX_COUNT, initialMedia);

    const handleClose = () => onRequestClose();

    const handleUpdate = async () => {
        try {
            setPostUpdateLoading(true);
            const contentValidation = validatePost(content, media);
            if (!contentValidation.success) throw new Error(contentValidation.message);
            const result = await postService.updatePost(post.id, { content, media });
            if (!result.success) throw new Error(result.message);
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
            setContent('');
            resetMedia();
            onRequestClose();
            Alert.alert('Success', 'Post updated successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while updating the post');
        } finally {
            setPostUpdateLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            textInputRef.current?.focus();
            setContent(post.content);
            resetMedia((post.media ?? []).map((m) => ({ url: m.media_url, type: m.type })));
        } else {
            setContent('');
            resetMedia();
        }
    }, [visible, post]);

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    const hasChanges = post.content !== content || media.length !== post.media.length ||
        media.some((m, i) => post.media[i]?.media_url !== m.url || post.media[i]?.type !== m.type);

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
                        disabled={postUpdateLoading}
                        className='min-w-20'
                        textClassName='text-sm'
                    >
                        Cancel
                    </Button>
                    <GradientButton
                        size='sm'
                        onPress={handleUpdate}
                        disabled={postUpdateLoading || !hasChanges}
                        className='min-w-20'
                        textClassName='text-sm text-white'
                        loading={postUpdateLoading}
                    >
                        Save Changes
                    </GradientButton>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='flex-1 flex-row items-start px-4'>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                    <View className='flex-1'>
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

export default UpdatePostModal;

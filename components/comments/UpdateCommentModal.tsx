import { Colors } from '@/constants/theme';
import type { Comment } from '@/types/comment.types';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, GradientButton } from '../reusable/button';
import { IconSymbol } from '../reusable/icon-symbol';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';
import { validateComment } from '@/utils/comment.utils';
import { screens } from '@/utils/screens';
import { getMediaItemStyle } from '@/utils/media-utils';
import useMediaUpload from '@/hooks/useMediaUpload';
import LoadingOverlay from '../reusable/loading-overlay';
import { ThemedText } from '../reusable/themed-text';
import MediaItem from '../reusable/MediaItem';
import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_MEDIA_MAX_COUNT } from '@/constants/general';
import { ImageViewerModal } from '../reusable/ImageViewerModal';
import { commentService } from '@/services/comment.service';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys, commentKeys } from '@/utils/query-keys';

const UpdateCommentModal = ({ visible, onRequestClose, comment }: { visible: boolean; onRequestClose: () => void; comment: Comment }) => {
    const { colorScheme: colorScheme = 'light' } = useColorScheme();
    const [content, setContent] = useState(comment.content);
    const [commentUpdateLoading, setCommentUpdateLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const initialMedia = (comment.media ?? []).map((m) => ({ url: m.media_url, type: m.type }));
    const { media, resetMedia, isUploading, atLimit, remainingSlots, handlePickFromLibrary, handlePickFromCamera, handleRemoveMedia } = useMediaUpload(COMMENT_MEDIA_MAX_COUNT, initialMedia);

    const handleClose = () => onRequestClose();

    const handleUpdate = async () => {
        try {
            setCommentUpdateLoading(true);
            const contentValidation = validateComment(content, media);
            if (!contentValidation.success) throw new Error(contentValidation.message);
            const result = await commentService.updateComment(comment.id, { content, media });
            if (!result.success) throw new Error(result.message);
            queryClient.invalidateQueries({ queryKey: commentKeys.all });
            queryClient.invalidateQueries({ queryKey: commentKeys.detail(comment.id) });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(comment.postId) });
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            setContent('');
            resetMedia();
            onRequestClose();
            Alert.alert('Success', 'Comment updated successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while updating the comment');
        } finally {
            setCommentUpdateLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            textInputRef.current?.focus();
            setContent(comment.content);
            resetMedia((comment.media ?? []).map((m) => ({ url: m.media_url, type: m.type })));
        } else {
            setContent('');
            resetMedia();
        }
    }, [visible, comment]);

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    const hasChanges = comment.content !== content || media.length !== comment.media.length ||
        media.some((m, i) => comment.media[i]?.media_url !== m.url || comment.media[i]?.type !== m.type);

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
                        disabled={commentUpdateLoading}
                        className='min-w-20'
                        textClassName='text-sm'
                    >
                        Cancel
                    </Button>
                    <GradientButton
                        size='sm'
                        onPress={handleUpdate}
                        disabled={commentUpdateLoading || !hasChanges}
                        className='min-w-20'
                        textClassName='text-sm text-white'
                        loading={commentUpdateLoading}
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
                            maxLength={COMMENT_CONTENT_MAX_LENGTH}
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
                                    {atLimit ? `${COMMENT_MEDIA_MAX_COUNT}/${COMMENT_MEDIA_MAX_COUNT} · Max reached` : `${media.length}/${COMMENT_MEDIA_MAX_COUNT} · ${remainingSlots} left`}
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

export default UpdateCommentModal;

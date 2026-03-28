import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, GradientButton } from '../reusable/button';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';
import { validateComment } from '@/utils/comment.utils';
import { getMediaItemStyle } from '@/utils/media.utils';
import useMediaUpload from '@/hooks/useMediaUpload';
import LoadingOverlay from '../reusable/loading-overlay';
import { ThemedText } from '../reusable/themed-text';
import MediaItem from '../reusable/MediaItem';
import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_MEDIA_MAX_COUNT } from '@/constants/general';
import { ImageViewerModal } from '../reusable/ImageViewerModal';
import { commentService } from '@/services/comment.service';
import { useQueryClient } from '@tanstack/react-query';
import { screens } from '@/utils/screens.utils';
import { postKeys, commentKeys } from '@/utils/query-keys.utils';

const CreateCommentModal = ({ visible, onRequestClose, postId, parentId }: { visible: boolean; onRequestClose: () => void; postId: string; parentId?: string }) => {
    const { colorScheme: colorScheme = 'light' } = useColorScheme();
    const [content, setContent] = useState('');
    const [commentCreationLoading, setCommentCreationLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const { media, resetMedia, isUploading, atLimit, remainingSlots, handlePickFromLibrary, handlePickFromCamera, handleRemoveMedia } = useMediaUpload(COMMENT_MEDIA_MAX_COUNT);

    const handleClose = () => onRequestClose();

    const handleComment = async () => {
        try {
            setCommentCreationLoading(true);
            const contentValidation = validateComment(content, media);
            if (!contentValidation.success) throw new Error(contentValidation.message);
            const result = await commentService.createComment({ content, media, postId, parentCommentId: parentId });
            if (!result.success) throw new Error(result.message);
            queryClient.invalidateQueries({ queryKey: commentKeys.all });
            if (parentId) queryClient.invalidateQueries({ queryKey: commentKeys.detail(parentId) });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            setContent('');
            resetMedia();
            onRequestClose();
            Alert.alert('Success', 'Comment created successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while creating the comment');
        } finally {
            setCommentCreationLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            textInputRef.current?.focus();
        }
    }, [visible]);

    useEffect(() => {
        if (!visible) {
            setContent('');
            resetMedia();
        }
    }, [visible]);

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
                        disabled={commentCreationLoading}
                        className='min-w-20'
                        textClassName='text-sm'
                    >
                        Cancel
                    </Button>
                    <GradientButton
                        size='sm'
                        onPress={handleComment}
                        disabled={commentCreationLoading}
                        className='min-w-20'
                        textClassName='text-sm text-white'
                        loading={commentCreationLoading}
                    >
                        Reply
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
                                <MaterialCommunityIcons name="image-multiple" size={24} color={Colors[colorScheme].accent} />
                            </Pressable>
                            <Pressable
                                onPress={handlePickFromCamera}
                                disabled={isUploading}
                                style={{ padding: 8, opacity: atLimit ? 0.4 : 1 }}
                            >
                                <MaterialCommunityIcons name="camera" size={24} color={Colors[colorScheme].accent} />
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

export default CreateCommentModal;

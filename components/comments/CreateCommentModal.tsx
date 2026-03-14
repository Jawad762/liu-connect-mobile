import { Colors } from '@/constants/theme';
import type { CreateCommentMedia } from '@/types/comment.types';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, ViewStyle } from 'react-native';
import { openSettings } from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, GradientButton } from '../reusable/button';
import { IconSymbol } from '../reusable/icon-symbol';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';
import { validatePost } from '@/utils/post.utils';
import { useImageUploader, uploadFiles } from '@/lib/uploadthing';
import { inferMediaType } from '@/utils/media-utils';
import LoadingOverlay from '../reusable/loading-overlay';
import { ThemedText } from '../reusable/themed-text';
import MediaItem from '../reusable/MediaItem';
import * as ImagePicker from 'expo-image-picker';
import { MAX_MEDIA, MAX_POST_CONTENT_LENGTH } from '@/constants/general';
import { ImageViewerModal } from '../reusable/ImageViewerModal';
import { commentService } from '@/services/comment.service';
import { useQueryClient } from '@tanstack/react-query';

const CreateCommentModal = ({ visible, onRequestClose, postId, parentId }: { visible: boolean; onRequestClose: () => void, postId: string, parentId?: string }) => {
    const { colorScheme: colorScheme = 'light' } = useColorScheme();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<CreateCommentMedia[]>([]);
    const [commentCreationLoading, setCommentCreationLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();
    const [customUploading, setCustomUploading] = useState(false);
    const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

    const onUploadComplete = (res: { ufsUrl?: string; url?: string; name?: string; key?: string }[]) =>
        setMedia((m) =>
            [...m, ...res.map((r) => ({ url: r.ufsUrl ?? r.url ?? '', type: inferMediaType(r.name ?? r.key ?? '') }))].slice(0, MAX_MEDIA)
        );
    const onUploadError = (e: Error) => {
        Alert.alert('Upload failed', e.message);
        console.error(e);
    };
    const imagePerms = () =>
        Alert.alert('Permission needed', 'Grant photo access to attach media', [
            { text: 'Dismiss' },
            { text: 'Open Settings', onPress: openSettings },
        ]);

    const { openImagePicker, isUploading } = useImageUploader('mediaUploader', {
        onClientUploadComplete: onUploadComplete,
        onUploadError,
    });

    const remainingSlots = MAX_MEDIA - media.length;

    const handlePickFromLibrary = async () => {
        if (remainingSlots <= 0) {
            Alert.alert('Media limit reached', 'Comments can include up to 4 media items. Remove one to add more.');
            return;
        }
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (newStatus !== 'granted') {
                imagePerms();
                return;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            selectionLimit: remainingSlots,
            quality: 1,
        });
        if (result.canceled || !result.assets?.length) return;
        setCustomUploading(true);
        try {
            const files = await Promise.all(
                result.assets.map(async (a) => {
                    const res = await fetch(a.uri);
                    const blob = await res.blob();
                    const name = a.fileName ?? a.uri.split('/').pop() ?? 'file';
                    const file = new File([blob], name, { type: a.mimeType ?? a.type ?? undefined });
                    return Object.assign(file, { uri: a.uri }) as File & { uri: string };
                })
            );
            const uploaded = await uploadFiles('mediaUploader', { files });
            if (uploaded?.length) onUploadComplete(uploaded);
        } catch (err) {
            onUploadError(err instanceof Error ? err : new Error('Upload failed'));
        } finally {
            setCustomUploading(false);
        }
    };

    const handlePickFromCamera = () => {
        if (remainingSlots <= 0) {
            Alert.alert('Media limit reached', 'Comments can include up to 4 media items. Remove one to add more.');
            return;
        }
        openImagePicker({ source: 'camera', onInsufficientPermissions: imagePerms });
    };

    const handleRemoveMedia = (index: number) =>
        setMedia((prev) => prev.filter((_, i) => i !== index));

    const handleClose = () => onRequestClose();

    const handleComment = async () => {
        try {
            setCommentCreationLoading(true);
            const contentValidation = validatePost(content, media);
            if (!contentValidation.success) throw new Error(contentValidation.message);
            const result = await commentService.createComment({ content, media, postId, parentCommentId: parentId });
            if (!result.success) throw new Error(result.message);
            setContent('');
            setMedia([]);
            onRequestClose();
            Alert.alert('Success', 'Comment created successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while creating the comment');
        } finally {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            queryClient.invalidateQueries({ queryKey: ['comment', parentId] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
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
            setMedia([]);
        }
    }, [visible]);

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    const atLimit = media.length >= MAX_MEDIA;

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
                            maxLength={MAX_POST_CONTENT_LENGTH}
                            placeholder='What are you thinking?'
                            placeholderTextColor={Colors[colorScheme].muted}
                            style={{ minHeight: 48 }}
                            className='px-6 text-white font-sans text-xl mb-4'
                        />

                        {media.length > 0 && (
                            <View className='flex-row flex-wrap gap-2'>
                                {media.map((m, index) => {
                                    const count = media.length;
                                    let itemStyle: ViewStyle = { width: '100%' };
                                    if (count === 2) itemStyle = { width: '48%' };
                                    else if (count === 3) itemStyle = index < 2 ? { width: '48%' } : { width: '100%' };
                                    else if (count === 4) itemStyle = { width: '48%' };

                                    return (
                                        <MediaItem
                                            key={`${m.url}-${index}`}
                                            uri={m.url}
                                            type={m.type}
                                            style={itemStyle}
                                            onRemove={() => handleRemoveMedia(index)}
                                            onImagePress={() => setFullScreenImageUri(m.url)}
                                        />
                                    );
                                })}
                            </View>
                        )}

                        <View className='mt-3 flex-row items-center gap-4'>
                            <Pressable
                                onPress={handlePickFromLibrary}
                                disabled={isUploading || customUploading}
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
                                    {atLimit ? '4/4 · Max reached' : `${media.length}/4 · ${remainingSlots} left`}
                                </ThemedText>
                            )}
                        </View>
                    </View>
                </ScrollView>

                <LoadingOverlay visible={isUploading || customUploading} />
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

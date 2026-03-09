import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View } from 'react-native'
import { Button, GradientButton } from '../reusable/button';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';
import { postService } from '@/services/post.service';
import { validatePostContent } from '@/utils/post.utils';

const CreatePostModal = ({ visible, onRequestClose }: { visible: boolean, onRequestClose: () => void }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [postCreationLoading, setPostCreationLoading] = useState(false);
    const [communityPublicId, setCommunityPublicId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);

    const handleClose = () => {
        onRequestClose();
    }

    const handlePost = async () => {
        try {
            setPostCreationLoading(true);
            const contentValidation = validatePostContent(content);
            if (!contentValidation.success) {
                throw new Error(contentValidation.message);
            }
            const result = await postService.createPost({ content, communityPublicId, media });
            if (!result.success) {
                throw new Error(result.message);
            }
            onRequestClose();
            Alert.alert('Success', 'Post created successfully');
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while creating the post');
        } finally {
            setPostCreationLoading(false);
        }
    }

    useEffect(() => {
        if (visible) {
            textInputRef.current?.focus();
        }
    }, [visible]);

    if (!user) {
        return <Redirect href="/login" />;
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
                        <TextInput ref={textInputRef} onChangeText={setContent} multiline numberOfLines={6} maxLength={300} placeholder='What are you thinking?' className='flex-1 px-6 text-white font-sans text-xl' />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal >
    )
}
export default CreatePostModal
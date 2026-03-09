import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef } from 'react'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View } from 'react-native'
import { Button } from '../reusable/button';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileIcon from '../reusable/profile-icon';
import useAuthStore from '@/stores/auth.store';
import { Redirect } from 'expo-router';

const CreatePostModal = ({ visible, onRequestClose }: { visible: boolean, onRequestClose: () => void }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const textInputRef = useRef<TextInput>(null);

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRequestClose();
    }

    const handlePost = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRequestClose();
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
            <KeyboardAvoidingView className="flex-1" style={{ paddingLeft: insets.left, paddingRight: insets.right, paddingTop: insets.top }}>
                <View className='border flex-row items-center justify-between'>
                    <Button variant='outline' onPress={handleClose} className='py-3 px-4 min-w-28' textClassName='text-sm' viewHeight={40}>Cancel</Button>
                    <Button variant='primary' onPress={handlePost} className='py-3 px-4 min-w-28' textClassName='text-sm' viewHeight={40}>Post</Button>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='flex-row items-start px-4'>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                    <View className='flex-1'>
                        <TextInput ref={textInputRef} multiline numberOfLines={6} maxLength={300} placeholder='What are you thinking?' className='flex-1 h-full px-6 text-white font-sans text-xl' />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default CreatePostModal
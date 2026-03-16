import React from 'react'
import { Pressable, View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { screens } from '@/utils/screens'
import { ThemedText } from '../reusable/themed-text'
import ProfileIcon from '../reusable/profile-icon'
import { DrawerActions } from '@react-navigation/native'

const NotificationsHeader = () => {
    const user = useAuthStore((state) => state.user);
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    return (
        <ThemedView className="p-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <View className='flex-row items-center justify-between gap-2'>
                <Pressable onPress={openDrawer}>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                </Pressable>
                <ThemedText className='text-xl font-sans-medium'>Notifications</ThemedText>
                <View className='w-6'></View>
            </View>
        </ThemedView>
    )
}

export default NotificationsHeader
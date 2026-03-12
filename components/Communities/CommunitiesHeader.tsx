import React from 'react'
import { Pressable, View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { ThemedText } from '../reusable/themed-text'
import { cn } from '@/utils/cn.utils'
import ProfileIcon from '../reusable/profile-icon'
import { DrawerActions } from '@react-navigation/native'

const CommunitiesHeader = () => {
    const user = useAuthStore((state) => state.user);

    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const tabs = ["Home", "Explore"]

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <ThemedView className="px-4 pt-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <View className='flex-row items-center justify-between gap-2'>
                <Pressable onPress={openDrawer}>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                </Pressable>
                <ThemedText className='text-xl font-sans-medium'>Communities</ThemedText>
                <View className='w-6'></View>
            </View>
            <View className='w-full flex-row justify-center'>
                {tabs.map((tab, i) => (
                    <ThemedText key={tab} className={cn(i === 0 ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "flex-1 text-center text-lg border-b-4 p-2")}>{tab}</ThemedText>
                ))}
            </View>
        </ThemedView>
    )
}

export default CommunitiesHeader
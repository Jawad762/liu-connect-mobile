import React, { useState } from 'react'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { ThemedView } from '../reusable/themed-view'
import { ThemedText } from '../reusable/themed-text'
import useAuthStore from '@/stores/auth.store'
import { Href, Redirect, router } from 'expo-router'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme-colors'
import { menus } from '@/constants/menus'
import { screens } from '@/utils/screens.utils'
import ProfileIcon from '../reusable/profile-icon'
import { authService } from '@/services/auth.service'
import ConfirmationDialog from '../reusable/confirmation-dialog'
import { resetPushTokenSyncCache } from '@/hooks/usePushNotifications'

const DrawerContent = (_props: DrawerContentComponentProps) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);
    const user = useAuthStore((state) => state.user);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            const response = await authService.logout();
            if (!response.success) {
                Alert.alert('Error', response.message);
                throw new Error(response.message);
            }
            resetPushTokenSyncCache();
            logout();
            router.replace(screens.auth.login);
        } catch (error) {
            console.error(error);
            return;
        } finally {
            setLogoutLoading(false);
        }
    }

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    const menuItems = menus(user.id);

    return (
        <SafeAreaView className='bg-background dark:bg-backgroundDark flex-1 border-r-[0.25px] border-border dark:border-borderDark'>
            <ThemedView className='flex-1'>
                <View className='p-4 gap-2'>
                    <Pressable onPress={() => router.push(screens.user.profile(user.id))} className='flex-row items-center gap-2'>
                        <ProfileIcon avatarUrl={user.avatar_url} />
                    </Pressable>
                    <ThemedText className='font-sans-bold text-lg'>{user.name}</ThemedText>
                    {(user.school || user.major) && (
                        <View className='gap-2'>
                            {user.school && (
                                <View className='flex-row items-center gap-2'>
                                    <MaterialCommunityIcons name="office-building" size={16} color={Colors[colorScheme].icon} />
                                    <ThemedText className='text-sm font-sans'>{user.school}</ThemedText>
                                </View>
                            )}
                            {user.major && (
                                <View className='flex-row items-center gap-2'>
                                    <MaterialCommunityIcons name="book-open-variant" size={16} color={Colors[colorScheme].icon} />
                                    <ThemedText className='text-sm font-sans'>{user.major}</ThemedText>
                                </View>
                            )}
                        </View>
                    )}
                    <View className='flex-row gap-3'>
                        <ThemedText>{user.following_count} <ThemedText className='text-muted dark:text-mutedDark'>Following</ThemedText></ThemedText>
                        <ThemedText>{user.followers_count} <ThemedText className='text-muted dark:text-mutedDark'>Followers</ThemedText></ThemedText>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='gap-2 mt-12'>
                    {menuItems.map((menu) => (
                        <Pressable onPress={() => router.push(menu.href as Href)} key={menu.name} className='p-4 flex-row items-center gap-6 active:bg-border active:dark:bg-borderDark'>
                            <MaterialCommunityIcons name={menu.icon} size={24} color={Colors[colorScheme].icon} />
                            <ThemedText className='text-2xl font-sans-bold'>{menu.name}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>

                <Pressable onPress={() => setConfirmationDialogVisible(true)} className='p-4 mt-auto flex-row items-center gap-6 border-t-[0.25px] border-border dark:border-borderDark pt-4 active:bg-border active:dark:bg-borderDark'>
                    <MaterialCommunityIcons name="logout" size={24} color={Colors[colorScheme].icon} />
                    <ThemedText className='text-2xl font-sans-bold'>Logout</ThemedText>
                </Pressable>
            </ThemedView>
            <ConfirmationDialog visible={confirmationDialogVisible} onRequestClose={() => setConfirmationDialogVisible(false)} title='Logout' message='Are you sure you want to logout?' onConfirm={handleLogout} onCancel={() => setConfirmationDialogVisible(false)} loading={logoutLoading} />
        </SafeAreaView>
    )
}

export default DrawerContent
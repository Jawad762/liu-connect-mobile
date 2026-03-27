import React from 'react'
import { Pressable, View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import { ThemedText } from '../reusable/themed-text'
import { cn } from '@/utils/cn.utils'
import ProfileIcon from '../reusable/profile-icon'
import { DrawerActions } from '@react-navigation/native'
import { IconSymbol } from '../reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'

const CommunitiesHeader = ({
    selectedTab,
    setSelectedTab,
    onCreatePress,
}: {
    selectedTab: "home" | "explore"
    setSelectedTab: (tab: "home" | "explore") => void
    onCreatePress?: () => void
}) => {
    const user = useAuthStore((state) => state.user);

    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const tabs = ["Home", "Explore"]

    const { colorScheme = "light" } = useColorScheme();

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    return (
        <ThemedView className="px-4 pt-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <View className='flex-row items-center justify-between gap-2'>
                <Pressable onPress={openDrawer}>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                </Pressable>
                <ThemedText className='text-xl font-sans-medium'>Communities</ThemedText>
                {onCreatePress ? (
                    <Pressable onPress={onCreatePress} className="p-1">
                        <IconSymbol name="plus.circle.fill" size={28} color={Colors[colorScheme].accent} />
                    </Pressable>
                ) : (
                    <View className='w-6'></View>
                )}
            </View>
            <View className='w-full flex-row'>
                {tabs.map((tab) => (
                    <Pressable key={tab} className='flex-1' onPress={() => setSelectedTab(tab.toLowerCase() as "home" | "explore")}>
                        <ThemedText className={cn(tab.toLowerCase() === selectedTab ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "text-center text-lg border-b-4 p-2")}>{tab}</ThemedText>
                    </Pressable>
                ))}
            </View>
        </ThemedView>
    )
}

export default CommunitiesHeader
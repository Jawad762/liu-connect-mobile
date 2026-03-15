import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { Image } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import { cn } from '@/utils/cn.utils'
import ProfileIcon from '../reusable/profile-icon'
import { DrawerActions } from '@react-navigation/native'

const HomeHeader = ({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) => {
    const user = useAuthStore((state) => state.user);
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    // TODO: Get user'scommunities from API
    const communities = [{ name: "CSCI300", id: "1" }, { name: "Basketball", id: "2" }, { name: "Art Club", id: "3" }]
    const tabs = [{ name: "For you", id: "for-you" }, { name: "Following", id: "following" }]

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <ThemedView className="px-4 pt-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <View className='flex-row justify-between gap-2'>
                <Pressable onPress={openDrawer}>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                </Pressable>
                <Image source={require("@/assets/images/icon.png")} className="w-10 h-10 rounded-full" />
                <View className='w-6'></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='flex-row gap-3'>
                {tabs.map((tab, i) => (
                    <Pressable key={tab.id} onPress={() => setSelectedTab(tab.id)}>
                        <ThemedText key={tab.id} className={cn(tab.id === selectedTab ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "text-lg border-b-4 p-2")}>{tab.name}</ThemedText>
                    </Pressable>
                ))}
                {communities.map((tab, i) => (
                    <Pressable key={tab.id} onPress={() => setSelectedTab(tab.id)}>
                        <ThemedText key={tab.id} className={cn(tab.id === selectedTab ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "text-lg border-b-4 p-2")}>{tab.name}</ThemedText>
                    </Pressable>
                ))}
            </ScrollView>
        </ThemedView>
    )
}

export default HomeHeader
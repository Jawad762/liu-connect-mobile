import React from 'react'
import { Pressable, View, Image, FlatList, useWindowDimensions } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import { ThemedText } from '../reusable/themed-text'
import { cn } from '@/utils/cn.utils'
import ProfileIcon from '../reusable/profile-icon'
import { DrawerActions } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'
import useCommunities from '@/hooks/useCommunities'

const HomeHeader = ({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) => {
    const user = useAuthStore((state) => state.user);
    const navigation = useNavigation();
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const logo = colorScheme === "light" ? require("@/assets/images/logo.png") : require("@/assets/images/logo-dark.png");

    const { width } = useWindowDimensions();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const { communities, fetchNextPage, hasNextPage, isFetchingNextPage } = useCommunities({ userOnly: true, size: 10 });
    const tabs = [{ name: "For you", id: "for-you" }, { name: "Following", id: "following" }, ...communities.map((community) => ({ name: community.name, id: community.id }))]

    if (!user) {
        return <Redirect href={screens.auth.login} />;
    }

    return (
        <ThemedView className="px-4 pt-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <View className='flex-row justify-between gap-2'>
                <Pressable onPress={openDrawer}>
                    <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
                </Pressable>
                <Image source={logo} className="w-10 h-10 rounded-full" />
                <View className='w-6'></View>
            </View>
            {communities.length > 0 ? (
            <FlatList
                keyExtractor={(item) => item.id}
                data={tabs}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 12
                }}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                renderItem={({ item }) => (
                    <Pressable key={item.id} onPress={() => setSelectedTab(item.id)}>
                        <ThemedText className={cn(item.id === selectedTab ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "text-lg border-b-4 p-2")}>{item.name}</ThemedText>
                    </Pressable>
                )} />
            ) : (
                <View className=' items-center justify-center flex-row gap-3'>
                    {tabs.map((tab) => (
                        <Pressable key={tab.id} onPress={() => setSelectedTab(tab.id)} className='flex-1'>
                            <ThemedText className={cn(tab.id === selectedTab ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "text-lg text-center border-b-4 p-2")}>{tab.name}</ThemedText>
                        </Pressable>
                    ))}
                </View>
            )}
        </ThemedView>
    );
};

export default HomeHeader;

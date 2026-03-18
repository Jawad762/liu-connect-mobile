import React from 'react'
import { Platform, Pressable, TextInput, View } from 'react-native'
import { ThemedView } from '../reusable/themed-view'
import useAuthStore from '@/stores/auth.store'
import { Redirect, useNavigation } from 'expo-router'
import { IconSymbol } from '../reusable/icon-symbol'
import ProfileIcon from '../reusable/profile-icon'
import { Colors } from '@/constants/theme-colors'
import { useColorScheme } from 'nativewind'
import { DrawerActions } from '@react-navigation/native'
import { cn } from '@/utils/cn.utils'

const SearchHeader = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) => {
    const user = useAuthStore((state) => state.user);
    const { colorScheme: colorScheme = "light" } = useColorScheme();

    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <ThemedView className="flex-row items-center p-4 gap-3 border-b-[0.25px] border-border dark:border-borderDark">
            <Pressable onPress={openDrawer}>
                <ProfileIcon avatarUrl={user.avatar_url} className='w-10 h-10' />
            </Pressable>
            <View style={{ backgroundColor: Colors[colorScheme].surface }} className={cn('flex-1 flex-row items-center gap-2 px-3 rounded-full', Platform.OS === 'android' ? 'py-0' : 'py-3')}>
                <IconSymbol name="magnifyingglass" size={16} color={Colors[colorScheme].muted} />
                <TextInput
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    className="flex-1 min-w-0 text-foreground dark:text-foregroundDark font-sans-medium"
                    placeholder="Search"
                />
            </View>
        </ThemedView>
    )
}

export default SearchHeader
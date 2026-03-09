import React, { useState } from 'react'
import { Drawer } from 'expo-router/drawer';
import DrawerContent from '@/components/shared/DrawerContent';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';
import { IconSymbol } from '@/components/reusable/icon-symbol';
import { TAB_BAR_HEIGHT } from '@/constants/general';
import CreatePostModal from '@/components/posts/CreatePostModal';
import * as Haptics from 'expo-haptics';

const _layout = () => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useState(false);

    const handleOpenCreatePostModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsCreatePostModalVisible(true);
    }

    return (
        <>
            <Drawer
                screenOptions={{
                    drawerStyle: { width: 280 },
                    drawerLabel: () => null,
                    headerShown: false,
                    drawerActiveBackgroundColor: Colors[colorScheme].background,
                    drawerActiveTintColor: Colors[colorScheme].accent,
                    drawerInactiveTintColor: Colors[colorScheme].muted,
                    drawerItemStyle: {
                        marginVertical: 10,
                    },
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                }}
                drawerContent={(props) => <DrawerContent {...props} />}
            />

            {/* Floating Button to open the create post modal */}
            <Pressable
                className="absolute right-6 bg-accent dark:bg-accentDark rounded-full p-5"
                style={{ bottom: TAB_BAR_HEIGHT + 12 }}
                onPress={handleOpenCreatePostModal}
            >
                <IconSymbol name="plus" size={24} color={Colors[colorScheme].foreground} />
            </Pressable>

            {/* Create Post Modal */}
            <CreatePostModal visible={isCreatePostModalVisible} onRequestClose={() => setIsCreatePostModalVisible(false)} />
        </>
    );
};

export default _layout
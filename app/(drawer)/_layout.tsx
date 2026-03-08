import React from 'react'
import { Drawer } from 'expo-router/drawer';
import DrawerContent from '@/components/shared/DrawerContent';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';

const _layout = () => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    return (
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
    );
};

export default _layout
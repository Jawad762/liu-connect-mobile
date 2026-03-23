import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';

import { HapticTab } from '@/components/reusable/haptic-tab';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IconSymbol } from '@/components/reusable/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from "nativewind";
import { TAB_BAR_HEIGHT } from '@/constants/general';
import { Platform, View } from 'react-native';
import useNotifications from '@/hooks/useNotifications';

export default function TabLayout() {
  const { colorScheme: colorScheme = "light" } = useColorScheme();
  const realTabBarHeight = TAB_BAR_HEIGHT + (Platform.OS === 'android' ? 16 : 0);
  const { notifications } = useNotifications({ size: 10 });
  const hasUnreadNotifications = useMemo(() => notifications.some(notification => !notification.read), [notifications]);

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
          tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme].background,
            paddingTop: 6,
            height: realTabBarHeight,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: 'Communities',
            tabBarIcon: ({ color }) => <IconSymbol size={35} name="person.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color }) => (
              <View className='relative'>
                {hasUnreadNotifications && <View className='absolute z-50 -top-1 -right-1 w-3 h-3 bg-accent dark:bg-accentDark rounded-full' />}
                <IconSymbol size={26} name="bell.fill" color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
  );
}

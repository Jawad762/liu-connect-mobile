import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/reusable/haptic-tab';
import { IconSymbol } from '@/components/reusable/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colorScheme: colorScheme = "light" } = useColorScheme();
  const insets = useSafeAreaInsets();

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
            paddingBottom: insets.bottom
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color} />,
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
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="bell.fill" color={color} />,
          }}
        />
      </Tabs>
  );
}

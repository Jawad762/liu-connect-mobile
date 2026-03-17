import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import 'react-native-reanimated';
import "./global.css"
import { useColorScheme } from "nativewind";
import useAuthStore from '@/stores/auth.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PushNotification } from '@/types/notification.types';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isAuthenticated = useAuthStore(state => !!state.accessToken && !!state.refreshToken);
  const queryClient = new QueryClient();
  
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Handle notification press in background
    const response = Notifications.getLastNotificationResponse()
    if (response?.notification.request.content.data) {
      const data = response.notification.request.content.data as unknown as PushNotification;
      if (data.redirectPath) {
        router.push(data.redirectPath);
      } else {
        console.error('Incorrect or missing redirect path in notification');
      }
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="rate-limited" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

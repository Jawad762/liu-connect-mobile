import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="(stack)" />
        </Stack>
    );
}

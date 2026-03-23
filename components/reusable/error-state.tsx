import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ThemedText } from './themed-text';
import { Button } from './button';
import { Colors } from '@/constants/theme';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    const router = useRouter();
    const { colorScheme = 'light' } = useColorScheme();
    const accentColor = Colors[colorScheme].accent;
    const canGoBack = router.canGoBack();
    const displayMessage = message || 'Something went wrong';

    return (
        <View style={{ paddingHorizontal: 16 }} className='flex-1 items-center justify-center'>
            <View className='items-center w-full max-w-sm'>
                <View className='bg-surface dark:bg-surfaceDark rounded-full p-6 mb-4'>
                    <MaterialIcons
                        name='error-outline'
                        size={48}
                        color={accentColor}
                    />
                </View>

                <ThemedText className='text-xl font-sans-bold text-center leading-7 mb-8'>
                    {displayMessage}
                </ThemedText>

                <View className='w-full gap-3'>
                    {onRetry && (
                        <Button
                            variant='primary'
                            size='lg'
                            fullWidth
                            onPress={onRetry}
                            className='mb-0'
                        >
                            Try again
                        </Button>
                    )}
                    {canGoBack && (
                        <Button
                            variant='outline'
                            size='lg'
                            fullWidth
                            onPress={() => router.back()}
                            className='mb-0'
                        >
                            Go back
                        </Button>
                    )}
                </View>
            </View>
        </View>
    );
}

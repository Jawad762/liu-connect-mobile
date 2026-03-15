import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from 'nativewind';
import { ThemedText } from './themed-text';
import { Button } from './button';
import { Colors } from '@/constants/theme';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    const { colorScheme = 'light' } = useColorScheme();
    const mutedColor = Colors[colorScheme].muted;

    return (
        <View className='flex-1 items-center justify-center px-8 gap-4'>
            <View className='w-20 h-20 rounded-full bg-surface dark:bg-surfaceDark items-center justify-center'>
                <MaterialIcons
                    name='wifi-off'
                    size={36}
                    color={mutedColor}
                />
            </View>

            <View className='items-center gap-1'>
                <ThemedText className='text-lg font-sans-bold text-center'>
                    Something went wrong
                </ThemedText>
                {message && (
                    <ThemedText className='text-sm text-center text-muted dark:text-mutedDark leading-5'>
                        {message}
                    </ThemedText>
                )}
            </View>

            {onRetry && (
                <Button
                    variant='outline'
                    size='sm'
                    onPress={onRetry}
                    className='mb-0 mt-2'
                >
                    Try again
                </Button>
            )}
        </View>
    );
}

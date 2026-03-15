import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './themed-text';

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export default function EmptyState({
    title = 'Nothing to see here!',
    message,
}: EmptyStateProps) {
    return (
        <View className='flex-1 items-center justify-center px-8 border-2 border-red-500'>
            <View className='items-center gap-1'>
                <ThemedText className='text-xl font-sans-bold text-center'>
                    {title}
                </ThemedText>
                {message && (
                    <ThemedText className='text-base text-center text-muted dark:text-mutedDark leading-5'>
                        {message}
                    </ThemedText>
                )}
            </View>
        </View>
    );
}

import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './themed-text';
import { cn } from '@/utils/cn.utils';

interface EmptyStateProps {
    title?: string;
    message?: string;
    className?: string;
}

export default function EmptyState({
    title = 'Nothing to see here!',
    message,
    className,
}: EmptyStateProps) {
    return (
        <View className={cn('flex-1 items-center justify-center px-8', className)}>
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

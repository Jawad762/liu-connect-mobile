import React from 'react'
import { View } from 'react-native'
import { ThemedText } from './themed-text'
import { BackButton } from './back-button'
import { router } from 'expo-router'

const GeneralHeader = ({ title }: { title: string }) => {
    return (
        <View className="relative flex-row justify-center items-center gap-2">
            {router.canGoBack() && (
                <View className="absolute left-0 top-1/2 -translate-y-1/2"
                >
                    <BackButton />
                </View>
            )}
            <ThemedText className="text-white text-2xl font-sans-bold text-center">
                {title}
            </ThemedText>
        </View>
    )
}

export default GeneralHeader
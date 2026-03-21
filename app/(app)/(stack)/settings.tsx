import { ThemedView } from '@/components/reusable/themed-view'
import React from 'react'
import GeneralHeader from '@/components/reusable/general-header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'

const settings = () => {
    const insets = useSafeAreaInsets();

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4">
                <GeneralHeader title="Settings" />
            </View>
        </ThemedView>
    )
}

export default settings
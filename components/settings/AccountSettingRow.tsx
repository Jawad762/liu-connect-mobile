import React from 'react'
import { Pressable, View } from 'react-native'
import { ThemedText } from '@/components/reusable/themed-text'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'

const AccountSettingRow = ({
    title,
    subtitle,
    onPress,
}: {
    title: string
    subtitle: string
    onPress: () => void
}) => {
    const { colorScheme = 'light' } = useColorScheme()

    return (
        <Pressable
            onPress={onPress}
            className="p-4 flex-row justify-between items-center border-b border-border dark:border-borderDark active:bg-muted/20 active:dark:bg-mutedDark/20"
        >
            <View className="flex-1 mr-4">
                <ThemedText className="text-xl font-sans-medium">{title}</ThemedText>
                <ThemedText className="text-base text-muted dark:text-mutedDark mt-1">
                    {subtitle}
                </ThemedText>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors[colorScheme].muted} />
        </Pressable>
    )
}

export default AccountSettingRow

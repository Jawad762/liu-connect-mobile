import React from 'react'
import { FlatList, Modal, Pressable, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import { ThemedView } from '../reusable/themed-view'
import { IconSymbol } from '../reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    LIU_MAJORS_BY_SCHOOL,
    LIU_SCHOOL_OPTIONS,
    LiusMajor,
    LiusSchool,
} from '@/constants/academics'

export type PickerMode = 'school' | 'major'

interface SchoolMajorModalProps {
    visible: boolean
    mode: PickerMode
    selectedSchool: LiusSchool | null
    selectedMajor: LiusMajor | null
    onSelectSchool: (school: LiusSchool) => void
    onSelectMajor: (major: LiusMajor) => void
    onClose: () => void
}

const SchoolMajorModal = ({
    visible,
    mode,
    selectedSchool,
    selectedMajor,
    onSelectSchool,
    onSelectMajor,
    onClose,
}: SchoolMajorModalProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()

    const items: readonly string[] =
        mode === 'school'
            ? LIU_SCHOOL_OPTIONS
            : selectedSchool
            ? LIU_MAJORS_BY_SCHOOL[selectedSchool]
            : []

    const selectedValue = mode === 'school' ? selectedSchool : selectedMajor
    const title = mode === 'school' ? 'Select School' : 'Select Major'

    const handleSelect = (item: string) => {
        if (mode === 'school') {
            onSelectSchool(item as LiusSchool)
        } else {
            onSelectMajor(item as LiusMajor)
        }
        onClose()
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
                <View
                    className="flex-row items-center justify-between px-5 py-4 border-b border-border dark:border-borderDark"
                >
                    <ThemedText className="text-lg font-sans-bold">{title}</ThemedText>
                    <Pressable onPress={onClose} hitSlop={8}>
                        <IconSymbol
                            name="xmark.circle.fill"
                            size={28}
                            color={Colors[colorScheme].muted}
                        />
                    </Pressable>
                </View>

                <FlatList
                    data={items as string[]}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                    renderItem={({ item }) => {
                        const isSelected = item === selectedValue
                        return (
                            <Pressable
                                onPress={() => handleSelect(item)}
                                className="flex-row items-center justify-between px-5 border-b border-border dark:border-borderDark"
                                style={{ paddingVertical: 16 }}
                            >
                                <ThemedText
                                    className="flex-1 text-base font-sans-medium pr-4"
                                    style={isSelected ? { color: Colors[colorScheme].accent } : undefined}
                                >
                                    {item}
                                </ThemedText>
                                {isSelected && (
                                    <IconSymbol
                                        name="checkmark"
                                        size={16}
                                        color={Colors[colorScheme].accent}
                                    />
                                )}
                            </Pressable>
                        )
                    }}
                />
            </ThemedView>
        </Modal>
    )
}

export default SchoolMajorModal

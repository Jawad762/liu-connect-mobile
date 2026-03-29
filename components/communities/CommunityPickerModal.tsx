import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import useCommunities from '@/hooks/useCommunities'
import useDebounce from '@/hooks/useDebounce'
import { cn } from '@/utils/cn.utils'

const CommunityPickerModal = ({ visible, onRequestClose, currentCommunity, setCurrentCommunity }: { visible: boolean, onRequestClose: () => void, currentCommunity: { id: string, name: string } | null, setCurrentCommunity: (community: { id: string, name: string } | null) => void }) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchValue, setSearchValue] = useState('')

    useDebounce({
        action: () => setSearchValue(searchQuery),
        delay: 400,
        dependencies: [searchQuery],
    })

    const { communities } = useCommunities({
        userOnly: true,
        search: searchValue || undefined,
        size: 20,
    })
    const items = [{ id: null, name: 'Everyone' }, ...communities.map((c) => ({ id: c.id, name: c.name }))]

    useEffect(() => {
        if (!visible) setSearchQuery('')
    }, [visible])

    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent
            onRequestClose={onRequestClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1 justify-end'
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <Pressable
                    className='flex-1'
                    onPress={onRequestClose}
                />
                <View className='bg-surface dark:bg-surfaceDark border-t border-border dark:border-borderDark rounded-t-2xl max-h-[60%]'>
                    <View className='py-3 border-b border-border dark:border-borderDark'>
                        <ThemedText className='text-center font-sans-semibold'>Post to</ThemedText>
                    </View>
                    <View
                        style={{ backgroundColor: Colors[colorScheme].surface }}
                        className={cn(
                            'mx-4 mt-2 mb-2 flex-row items-center gap-2 rounded-full px-4 border border-border dark:border-borderDark',
                            Platform.OS === 'android' ? 'py-2' : 'py-3'
                        )}
                    >
                        <MaterialCommunityIcons name="magnify" size={18} color={Colors[colorScheme].muted} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search communities"
                            placeholderTextColor={Colors[colorScheme].muted}
                            className="flex-1 min-w-0 text-foreground dark:text-foregroundDark font-sans"
                        />
                    </View>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id ?? 'everyone'}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setCurrentCommunity(item.id ? { id: item.id, name: item.name } : null)
                                    onRequestClose()
                                }}
                                className='flex-row items-center gap-3 px-4 py-4 border-b border-border dark:border-borderDark'
                            >
                                <View className='w-10 h-10 rounded-full bg-accent/30 dark:bg-accentDark/30 items-center justify-center'>
                                    <ThemedText className='text-sm font-sans-bold'>
                                        {item.id ? item.name.slice(0, 2).toUpperCase() : '#'}
                                    </ThemedText>
                                </View>
                                <ThemedText className='flex-1 font-sans-medium'>{item.name}</ThemedText>
                                {(currentCommunity?.id ?? null) === (item.id ?? null) && (
                                    <MaterialCommunityIcons name="check-circle" size={20} color={Colors[colorScheme].accent} />
                                )}
                            </Pressable>
                        )}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default CommunityPickerModal
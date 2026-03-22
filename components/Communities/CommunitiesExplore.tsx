import React, { useState } from 'react'
import { Platform, TextInput, View } from 'react-native'
import useCommunities from '@/hooks/useCommunities'
import CommunityList from './CommunityList'
import useDebounce from '@/hooks/useDebounce'
import { IconSymbol } from '../reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { cn } from '@/utils/cn.utils'

const CommunitiesExplore = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const { colorScheme = 'light' } = useColorScheme()

    useDebounce({
        action: () => setSearchValue(searchQuery),
        delay: 400,
        dependencies: [searchQuery],
    })

    const {
        communities,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useCommunities({ search: searchValue || undefined, size: 10 })

    return (
        <View className="flex-1">
            <View
                style={{ backgroundColor: Colors[colorScheme].surface }}
                className={cn(
                    'mx-4 mt-3 mb-2 flex-row items-center gap-2 rounded-full px-4',
                    Platform.OS === 'android' ? 'py-2' : 'py-3'
                )}
            >
                <IconSymbol name="magnifyingglass" size={18} color={Colors[colorScheme].muted} />
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search communities"
                    placeholderTextColor={Colors[colorScheme].muted}
                    className="flex-1 min-w-0 text-foreground dark:text-foregroundDark font-sans"
                />
            </View>
            <CommunityList
                communities={communities}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isRefreshing={isFetching}
            />
        </View>
    )
}

export default CommunitiesExplore

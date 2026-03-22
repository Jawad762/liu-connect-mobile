import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import CommunityCard from './CommunityCard'
import CommunityListSkeleton from '../skeletons/CommunityListSkeleton'
import ErrorState from '../reusable/error-state'
import { Community } from '@/types/community.types'
import EmptyState from '../reusable/empty-state'

interface CommunityListProps {
    communities: Community[]
    isLoading: boolean
    error: Error | null | undefined
    refetch: () => void
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    ListHeaderComponent?: React.ReactElement | null
    isRefreshing?: boolean
}

const CommunityList = ({
    communities,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ListHeaderComponent,
    isRefreshing,
}: CommunityListProps) => {
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />
    }

    return (
        <View className="flex-1">
            <FlatList
                data={isLoading ? [] : communities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CommunityCard community={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                ListHeaderComponent={ListHeaderComponent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing ?? false} onRefresh={() => refetch()} />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <CommunityListSkeleton />
                    ) : (
                        <EmptyState className="mt-20" message="No communities found" />
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4 items-center">
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default CommunityList

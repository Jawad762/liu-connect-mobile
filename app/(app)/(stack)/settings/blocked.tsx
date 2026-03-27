import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'
import { ThemedView } from '@/components/reusable/themed-view'
import GeneralHeader from '@/components/reusable/general-header'
import { useBlockedUsers } from '@/hooks/useBlockedUsers'
import BlockedUserListSkeleton from '@/components/skeletons/BlockedUserListSkeleton'
import EmptyState from '@/components/reusable/empty-state'
import ErrorState from '@/components/reusable/error-state'
import BlockedUserCard from '@/components/users/BlockedUserCard'

const Blocked = () => {
    const insets = useSafeAreaInsets()
    const { users, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlockedUsers({ size: 10 })

    return (
        <ThemedView className="flex-1 gap-6" style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4 border-b border-border dark:border-borderDark">
                <GeneralHeader title="Settings > Blocked Users" />
            </View>

            {error ? <ErrorState message={error.message} onRetry={refetch} /> : (
                <FlatList
                    data={users}
                    renderItem={({ item }) => <BlockedUserCard user={item} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                    onEndReachedThreshold={0.8}
                    ListEmptyComponent={
                        isLoading ? <BlockedUserListSkeleton /> : <EmptyState message="No users found" className='mt-20' />
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator />
                            </View>
                        ) : null
                    }
                    refreshControl={
                        <RefreshControl refreshing={isFetching ?? false} onRefresh={refetch} />
                    }
                />
            )}

        </ThemedView>
    )
}

export default Blocked

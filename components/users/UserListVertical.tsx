import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { User } from '@/types/user.types'
import UserCardVertical from './UserCardVertical'
import UserListSkeletonVertical from '../skeletons/UserListSkeletonVertical'
import ErrorState from '../reusable/error-state'
import EmptyState from '../reusable/empty-state'

interface UserListVerticalProps {
    users: User[]
    isLoading: boolean
    isRefreshing?: boolean
    error: Error | null | undefined
    refetch: () => void
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
}

const UserListVertical = ({
    users,
    isLoading,
    isRefreshing,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: UserListVerticalProps) => {
    if (error) return <ErrorState message={error.message} onRetry={refetch} />

    return (
        <View className="flex-1">
            <FlatList
                data={isLoading ? [] : users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UserCardVertical user={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing ?? false} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    isLoading ? <UserListSkeletonVertical /> : <EmptyState message="No users found" className='mt-20' />
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

export default UserListVertical

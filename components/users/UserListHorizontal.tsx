import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { User } from '@/types/user.types'
import UserCardHorizontal from './UserCardHorizontal'
import UserListSkeleton from '../skeletons/UserListSkeleton'
import ErrorState from '../reusable/error-state'
import EmptyState from '../reusable/empty-state'

interface UserListHorizontalProps {
    users: User[]
    isLoading: boolean
    error: Error | null | undefined
    refetch: () => void
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
}

const UserListHorizontal = ({
    users,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: UserListHorizontalProps) => {
    if (isLoading) return <UserListSkeleton />
    if (error) return <ErrorState message={error.message} onRetry={refetch} />
    if (users.length === 0) return <EmptyState  className='mt-10 w-full flex-0' title="Nothing to see here!" message="No users found" />

    return (
        <FlatList
            data={users}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserCardHorizontal user={item} />}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            onEndReachedThreshold={0.8}
            ListFooterComponent={isFetchingNextPage ? <View className="px-3 justify-center"><ActivityIndicator /></View> : null}
        />
    )
}

export default UserListHorizontal

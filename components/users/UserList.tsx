import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import UserCard from './UserCard';
import UserListSkeleton from '../skeletons/UserListSkeleton';
import ErrorState from '../reusable/error-state';
import { User } from '@/types/user.types';
import EmptyState from '../reusable/empty-state';

const UserList = ({ users, isLoading, isFetching, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage }: { users: User[], isLoading: boolean, isFetching: boolean, error: Error | null | undefined, refetch: () => void, fetchNextPage: () => void, hasNextPage: boolean, isFetchingNextPage: boolean }) => {
    if (isLoading) {
        return <UserListSkeleton />
    }

    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />
    }

    if (users.length === 0) {
        return <EmptyState message="No users found" />
    }

    return (
        <View>
            <FlatList
                data={users}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UserCard user={item} />}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
            />
        </View>
    )
}

export default UserList
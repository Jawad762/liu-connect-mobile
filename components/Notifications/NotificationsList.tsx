import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import useNotifications from '@/hooks/useNotifications'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'
import EmptyState from '../reusable/empty-state'
import NotificationCard from './NotificationCard'
import NotificationListSkeleton from './NotificationListSkeleton'
import ErrorState from '../reusable/error-state'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notification.service'
import { notificationKeys } from '@/utils/query-keys'

const NotificationsList = () => {
    const queryClient = useQueryClient()
    const { notifications, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useNotifications({ size: 10 })

    const { mutate: markAllRead } = useMutation({
        mutationFn: notificationService.readAllNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        },
    })

    useFocusEffect(
        useCallback(() => {
            if (error) return
            markAllRead()
        }, [markAllRead, error]),
    )
   
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />
    }
    
    return (
        <View className='flex-1'>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard notification={item} />}
                showsVerticalScrollIndicator={false}
                onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                onEndReachedThreshold={0.8}
                refreshControl={<RefreshControl refreshing={isFetching ?? false} onRefresh={() => refetch()} />}
                ListEmptyComponent={
                    isLoading ? <NotificationListSkeleton /> : <EmptyState message="No notifications found" />
                }
                ListFooterComponent={
                    isFetchingNextPage ? <View className='py-4 items-center'><ActivityIndicator /></View> : null
                }
            />
        </View>
    )
}

export default NotificationsList
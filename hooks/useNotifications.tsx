import { notificationService } from '@/services/notification.service'
import { notificationKeys } from '@/utils/query-keys.utils'
import { useInfiniteQuery } from '@tanstack/react-query'

const useNotifications = ({ size = 10 }: { size?: number }) => {
    const { data, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: notificationKeys.list(size),
        queryFn: ({ pageParam = 1 }) => notificationService.getNotifications({ page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const notifications = data?.pages.flatMap((page) => page.data) ?? []
    return { notifications, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage }
}

export default useNotifications
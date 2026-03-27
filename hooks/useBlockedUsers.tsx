import { userService } from "@/services/user.service"
import { userKeys } from "@/utils/query-keys.utils"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useBlockedUsers = ({ size = 10 }: { size?: number }) => {
    const { data, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: userKeys.blocked.list(size),
        queryFn: ({ pageParam = 1 }) => userService.getBlockedUsers({ page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const users = data?.pages.flatMap((page) => page.data) ?? []
    return { users, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage }
}
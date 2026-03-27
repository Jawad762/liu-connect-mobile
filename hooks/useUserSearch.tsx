import { useInfiniteQuery } from '@tanstack/react-query'
import { userKeys } from '@/utils/query-keys.utils'
import { SearchUsersQuery } from '@/types/user.types'
import { userService } from '@/services/user.service'

const useUserSearch = ({ query, size = 10 }: SearchUsersQuery) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: userKeys.search(query, size),
        queryFn: ({ pageParam = 1 }) => userService.search({ query, page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
        enabled: !!query && query.length > 0,
    })
    const users = data?.pages.flatMap((page) => page.data) ?? []
    return { users, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default useUserSearch

import { userService } from "@/services/user.service"
import { userKeys } from "@/utils/query-keys"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useFollowers = ({ id, size }: { id: string, size?: number }) => {
    const { data, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: userKeys.followers(id, size),
        queryFn: ({ pageParam }) => userService.getFollowers(id, { page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const followers = data?.pages.flatMap((page) => page.data) ?? []
    return { followers, isLoading, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage }
}
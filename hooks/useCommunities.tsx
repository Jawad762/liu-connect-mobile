import { communityService } from '@/services/community.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { communityKeys } from '@/utils/query-keys.utils'
import { GetCommunitiesQuery } from '@/types/community.types'

const useCommunities = (query: GetCommunitiesQuery = {}) => {
    const size = query.size ?? 10
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: communityKeys.list({ ...query, size }),
        queryFn: ({ pageParam = 1 }) =>
            communityService.getCommunities({ ...query, page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const communities = data?.pages.flatMap((page) => page.data) ?? []
    return { communities, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default useCommunities

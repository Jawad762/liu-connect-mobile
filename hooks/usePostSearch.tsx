import { postService } from '@/services/post.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postKeys } from '@/utils/query-keys'
import { SearchPostsQuery } from '@/types/post.types'

const usePostSearch = ({ query, size = 10 }: SearchPostsQuery) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: postKeys.search(query, size),
        queryFn: ({ pageParam = 1 }) => postService.search({ query, page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
        enabled: !!query && query.length > 0,
    })
    const posts = data?.pages.flatMap((page) => page.data) ?? []
    return { posts, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default usePostSearch

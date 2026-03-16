import { postService } from '@/services/post.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postKeys } from '@/utils/query-keys'

const usePosts = ({ communityId, authorId, size = 10, followingOnly = false }: { communityId?: string, authorId?: string, size?: number, followingOnly?: boolean }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: postKeys.list({ communityId, authorId, followingOnly, size }),
        queryFn: ({ pageParam = 1 }) => postService.getPosts({ page: pageParam, size, communityId, authorId, followingOnly }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const posts = data?.pages.flatMap((page) => page.data) ?? []
    return { posts, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default usePosts

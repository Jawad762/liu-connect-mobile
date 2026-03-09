import { postService } from '@/services/post.service'
import { useInfiniteQuery } from '@tanstack/react-query'

const usePosts = ({ communityPublicId, userPublicId, size = 10 }: { communityPublicId?: string, userPublicId?: string, size?: number }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: ['posts', communityPublicId, userPublicId, size],
        queryFn: ({ pageParam = 1 }) => postService.getPosts({ page: pageParam, size, communityPublicId, userPublicId }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
    })
    const posts = data?.pages.flatMap((page) => page.data) ?? []
    return { posts, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default usePosts
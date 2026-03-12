import { postService } from '@/services/post.service'
import { useInfiniteQuery } from '@tanstack/react-query'

const usePosts = ({ communityPublicId, authorPublicId, size = 10, followingOnly = false }: { communityPublicId?: string, authorPublicId?: string, size?: number, followingOnly?: boolean }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: ['posts', communityPublicId, authorPublicId, size],
        queryFn: ({ pageParam = 1 }) => postService.getPosts({ page: pageParam, size, communityPublicId, authorPublicId, followingOnly }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
    })
    const posts = data?.pages.flatMap((page) => page.data) ?? []
    return { posts, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default usePosts
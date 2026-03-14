import { commentService } from '@/services/comment.service'
import { useInfiniteQuery } from '@tanstack/react-query'

const useComments = ({ size = 10, postId, parentCommentId, userId }: { size?: number, postId: string, parentCommentId?: string, userId?: string }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: ['comments', postId, parentCommentId, userId, size],
        queryFn: ({ pageParam = 1 }) => commentService.getComments({ page: pageParam, size, postId, parentCommentId, userId }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
    })
    const comments = data?.pages.flatMap((page) => page.data) ?? []
    return { comments, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default useComments

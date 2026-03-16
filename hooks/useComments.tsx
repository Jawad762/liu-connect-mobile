import { commentService } from '@/services/comment.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { commentKeys } from '@/utils/query-keys'

const useComments = ({ size = 10, postId, parentCommentId, userId }: { size?: number, postId: string, parentCommentId?: string, userId?: string }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: commentKeys.list({ page: 1, size, postId, parentCommentId, userId }),
        queryFn: ({ pageParam = 1 }) => commentService.getComments({ page: pageParam, size, postId, parentCommentId, userId }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const comments = data?.pages.flatMap((page) => page.data) ?? []
    return { comments, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default useComments

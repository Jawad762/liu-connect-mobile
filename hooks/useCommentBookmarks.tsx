import { commentService } from '@/services/comment.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { commentKeys } from '@/utils/query-keys'

const useCommentBookmarks = ({ size = 10 }: { size?: number }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: commentKeys.bookmarks(size),
        queryFn: ({ pageParam = 1 }) => commentService.getBookmarkedComments({ page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const commentBookmarks = data?.pages.flatMap((page) => page.data) ?? []
    return { commentBookmarks, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default useCommentBookmarks

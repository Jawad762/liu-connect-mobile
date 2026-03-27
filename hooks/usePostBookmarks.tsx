import { postService } from '@/services/post.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postKeys } from '@/utils/query-keys.utils'

const usePostBookmarks = ({ size = 10 }: { size?: number }) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useInfiniteQuery({
        queryKey: postKeys.bookmarks(size),
        queryFn: ({ pageParam = 1 }) => postService.getBookmarkedPosts({ page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.length === size ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        retry: false,
    })
    const postBookmarks = data?.pages.flatMap((page) => page.data) ?? []
    return { postBookmarks, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch }
}

export default usePostBookmarks

import { commentService } from '@/services/comment.service'
import { useQuery } from '@tanstack/react-query'
import { commentKeys } from '@/utils/query-keys.utils'

const useComment = ({ id }: { id: string }) => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: commentKeys.detail(id),
        queryFn: () => commentService.getComment(id),
    })
    return { comment: data?.data, isLoading, error, refetch, isFetching }
}

export default useComment

import { postService } from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'
import { postKeys } from '@/utils/query-keys.utils'

const usePost = ({ id }: { id: string }) => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => postService.getPost(id),
    })
    return { post: data?.data, isLoading, error, refetch, isFetching }
}

export default usePost

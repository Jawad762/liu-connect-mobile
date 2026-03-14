import { postService } from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'

const usePost = ({ id }: { id: string }) => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getPost(id),
    })
    return { post: data?.data, isLoading, error, refetch, isFetching }
}

export default usePost

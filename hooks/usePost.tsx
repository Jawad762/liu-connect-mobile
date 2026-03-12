import { postService } from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'

const usePost = ({ publicId }: { publicId: string }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['post', publicId],
        queryFn: () => postService.getPost(publicId),
    })
    return { post: data?.data, isLoading, error, refetch }
}

export default usePost
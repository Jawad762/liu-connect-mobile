import { communityService } from '@/services/community.service'
import { useQuery } from '@tanstack/react-query'
import { communityKeys } from '@/utils/query-keys'

const useCommunity = (id: string | undefined) => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: communityKeys.detail(id ?? ''),
        queryFn: () => communityService.getCommunity(id!),
        enabled: !!id,
        retry: false,
    })
    return { community: data?.data, isLoading, error, refetch, isFetching }
}

export default useCommunity

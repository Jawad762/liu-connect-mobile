import React from 'react'
import { communityKeys } from '@/utils/query-keys.utils'
import { communityService } from '@/services/community.service'
import { useQuery } from '@tanstack/react-query'

const useSuggestedCommunities = (courseCodes: string[]) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: communityKeys.suggested(courseCodes),
    queryFn: () => communityService.getSuggestedCommunities(courseCodes),
    enabled: courseCodes.length > 0,
  })
  return { communities: data?.data ?? [], isLoading, error, refetch, isFetching }
}

export default useSuggestedCommunities
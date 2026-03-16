import { ThemedView } from '@/components/reusable/themed-view';
import UserProfile from '@/components/users/UserProfile';
import { useUser } from '@/hooks/useUser';
import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import ErrorState from '@/components/reusable/error-state';
import UserProfileSkeleton from '@/components/skeletons/UserProfileSkeleton';

const UserScreen = () => {
    const { id } = useLocalSearchParams()
    const { user, isFetching, error, refetch } = useUser({ id: id as string })

    if (isFetching) {
      return <UserProfileSkeleton />
    }

    if (error || !user) {
      return <ErrorState message={error?.message} onRetry={refetch} />
    }

  return (
    <ThemedView className="flex-1">
      <UserProfile user={user} />
    </ThemedView>
  )
}

export default UserScreen
import React from 'react'
import { View } from 'react-native'
import UserCardSkeleton from './UserCardSkeleton'

const SKELETON_COUNT = 8

const UserListSkeleton = () => {
  return (
    <View className='flex-row gap-4'>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </View>
  )
}

export default UserListSkeleton
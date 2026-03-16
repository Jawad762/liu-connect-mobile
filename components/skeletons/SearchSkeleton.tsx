import React from 'react'
import { View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import UserListSkeleton from './UserListSkeleton'
import PostListSkeleton from './PostListSkeleton'

const SearchSkeleton = () => {
    return (
        <View className="flex-1">
            <View className="gap-1 p-4">
                <ThemedText className="text-xl font-sans-medium">Users</ThemedText>
                <UserListSkeleton />
            </View>

            <View className="gap-1 p-4">
                <ThemedText className="text-xl font-sans-medium">Posts</ThemedText>
                <PostListSkeleton />
            </View>
        </View>
    )
}

export default SearchSkeleton


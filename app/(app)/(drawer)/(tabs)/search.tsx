import { ThemedView } from "@/components/reusable/themed-view";
import SearchHeader from "@/components/search/SearchHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import useUserSearch from "@/hooks/useUserSearch";
import usePostSearch from "@/hooks/usePostSearch";
import { View } from "react-native";
import PostList from "@/components/posts/PostList";
import SearchSkeleton from "@/components/skeletons/SearchSkeleton";
import ErrorState from "@/components/reusable/error-state";
import useDebounce from "@/hooks/useDebounce";
import UserListHorizontal from "@/components/users/UserListHorizontal";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { users, isLoading: isLoadingUsers, error: errorUsers, fetchNextPage: fetchNextPageUsers, hasNextPage: hasNextPageUsers, isFetchingNextPage: isFetchingNextPageUsers, isFetching: isFetchingUsers, refetch: refetchUsers } = useUserSearch({ query: searchValue, size: 10 });
  const { posts, isLoading: isLoadingPosts, error: errorPosts, fetchNextPage: fetchNextPagePosts, hasNextPage: hasNextPagePosts, isFetchingNextPage: isFetchingNextPagePosts, isFetching: isFetchingPosts, refetch: refetchPosts } = usePostSearch({ query: searchValue, size: 10 });

  useDebounce({
    action: () => setSearchValue(searchQuery),
    delay: 500,
    dependencies: [searchQuery],
  });

  const isLoading = isLoadingUsers || isLoadingPosts;
  const isError = errorUsers || errorPosts;

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isLoading ? (
        <SearchSkeleton />
      ) : isError ? (
        <ErrorState message={errorUsers?.message || errorPosts?.message} onRetry={refetchUsers || refetchPosts} />
      ) : searchValue.length > 0 ? (
        <View className="flex-1">
          {users.length > 0 && (
            <View className="p-4">
              <UserListHorizontal users={users} isLoading={isLoadingUsers} error={errorUsers} refetch={refetchUsers} fetchNextPage={fetchNextPageUsers} hasNextPage={hasNextPageUsers} isFetchingNextPage={isFetchingNextPageUsers} />
            </View>
          )}
          {posts.length > 0 && (
            <View className="flex-1 p-4">
              <PostList posts={posts} isLoading={isLoadingPosts} isRefreshing={isFetchingPosts} error={errorPosts} refetch={refetchPosts} fetchNextPage={fetchNextPagePosts} hasNextPage={hasNextPagePosts} isFetchingNextPage={isFetchingNextPagePosts} />
            </View>
          )}
        </View>
      ) : null}
    </ThemedView>
  );
}

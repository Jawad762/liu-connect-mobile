import HomeHeader from "@/components/home/HomeHeader";
import PostList from "@/components/posts/PostList";
import { ThemedView } from "@/components/reusable/themed-view";
import usePosts from "@/hooks/usePosts";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<string>("for-you");

  const isCommunityTab = selectedTab !== "for-you" && selectedTab !== "following";
  const isFollowingTab = selectedTab === "following";

  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, error, isFetching } = usePosts({ size: 10, communityId: isCommunityTab ? selectedTab : undefined, followingOnly: isFollowingTab });


  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top }}>
      <HomeHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <PostList posts={posts} isLoading={isLoading} isRefreshing={isFetching} error={error} refetch={refetch} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
    </ThemedView>
  );
}

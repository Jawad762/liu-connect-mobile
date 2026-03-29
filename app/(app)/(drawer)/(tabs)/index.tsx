import HomeHeader from "@/components/home/HomeHeader";
import PostList from "@/components/posts/PostList";
import { ThemedView } from "@/components/reusable/themed-view";
import usePosts from "@/hooks/usePosts";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useCommunities from "@/hooks/useCommunities";

interface Tab {
  name: string;
  id: string;
}

function TabContent({ tabId, width }: { tabId: string; width: number }) {
  const isCommunityTab = tabId !== "for-you" && tabId !== "following";
  const isFollowingTab = tabId === "following";

  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, error, isFetching } = usePosts({
    size: 10,
    communityId: isCommunityTab ? tabId : undefined,
    followingOnly: isFollowingTab,
  });

  return (
    <View style={{ width }}>
      <PostList
        posts={posts}
        isLoading={isLoading}
        isRefreshing={isFetching}
        error={error}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<string>("for-you");
  const { width } = useWindowDimensions();

  const pagerRef = useRef<ScrollView>(null);
  const headerListRef = useRef<FlatList<Tab>>(null);

  const { communities, fetchNextPage: fetchNextCommunityPage, hasNextPage: hasNextCommunityPage, isFetchingNextPage: isFetchingNextCommunityPage } = useCommunities({ userOnly: true, size: 10 });
  const tabs: Tab[] = [{ name: "For you", id: "for-you" }, { name: "Following", id: "following" }, ...communities.map((community) => ({ name: community.name, id: community.id }))];

  const goToTab = (tabId: string) => {
    const index = tabs.findIndex((t) => t.id === tabId);
    if (index === -1) return;
    setSelectedTab(tabId);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
    try {
      headerListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    } catch {
      // scrollToIndex can throw if the item isn't rendered yet
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    const tab = tabs[index];
    if (tab && tab.id !== selectedTab) {
      setSelectedTab(tab.id);
      try {
        headerListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      } catch {
        // scrollToIndex can throw if the item isn't rendered yet
      }
    }
  };

  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top }}>
      <HomeHeader
        selectedTab={selectedTab}
        setSelectedTab={goToTab}
        tabs={tabs}
        hasNextCommunityPage={hasNextCommunityPage}
        isFetchingNextCommunityPage={isFetchingNextCommunityPage}
        fetchNextCommunityPage={fetchNextCommunityPage}
        listRef={headerListRef}
      />
      <ScrollView
        ref={pagerRef}
        className="flex-1"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        hitSlop={{ left: -32 }}
      >
        {tabs.map((tab) => (
          <TabContent key={tab.id} tabId={tab.id} width={width} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

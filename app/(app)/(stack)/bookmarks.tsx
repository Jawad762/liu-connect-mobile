import CommentList from "@/components/comments/CommentList";
import PostList from "@/components/posts/PostList";
import GeneralHeader from "@/components/reusable/general-header";
import { ThemedText } from "@/components/reusable/themed-text";
import { ThemedView } from "@/components/reusable/themed-view";
import useCommentBookmarks from "@/hooks/useCommentBookmarks";
import usePostBookmarks from "@/hooks/usePostBookmarks";
import { cn } from "@/utils/cn.utils";
import { useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const TABS = ["posts", "comments"] as const;
type Tab = typeof TABS[number];

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<Tab>("posts");
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);

  const { postBookmarks, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching, isLoading, error } = usePostBookmarks({ size: 10 });
  const { commentBookmarks, fetchNextPage: fetchNextCommentPage, hasNextPage: hasNextCommentPage, isFetchingNextPage: isFetchingNextCommentPage, refetch: refetchComment, isLoading: isLoadingComment, isFetching: isFetchingComments, error: commentError } = useCommentBookmarks({ size: 10 });

  const goToTab = (tab: Tab) => {
    const index = TABS.indexOf(tab);
    setSelectedTab(tab);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    const tab = TABS[index];
    if (tab && tab !== selectedTab) {
      setSelectedTab(tab);
    }
  };

  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
      <View className="p-4">
        <GeneralHeader title="Bookmarks" />
        <View className='w-full flex-row justify-center pt-4'>
          <Pressable onPress={() => goToTab("posts")} className={cn(selectedTab === "posts" ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "flex-1 border-b-4")}>
            <ThemedText className="text-center text-lg border-b-4 p-2">Posts</ThemedText>
          </Pressable>
          <Pressable onPress={() => goToTab("comments")} className={cn(selectedTab === "comments" ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "flex-1 border-b-4")}>
            <ThemedText className="text-center text-lg border-b-4 p-2">Comments</ThemedText>
          </Pressable>
        </View>
      </View>
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
        <View style={{ width }}>
          <PostList posts={postBookmarks} isLoading={isLoading} isRefreshing={isFetching} error={error} refetch={refetch} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
        </View>
        <View style={{ width }}>
          <CommentList comments={commentBookmarks} isLoading={isLoadingComment} isRefreshing={isFetchingComments} error={commentError} refetch={refetchComment} fetchNextPage={fetchNextCommentPage} hasNextPage={hasNextCommentPage} isFetchingNextPage={isFetchingNextCommentPage} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

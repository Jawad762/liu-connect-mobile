import CommentList from "@/components/comments/CommentList";
import PostList from "@/components/posts/PostList";
import GeneralHeader from "@/components/reusable/general-header";
import { ThemedText } from "@/components/reusable/themed-text";
import { ThemedView } from "@/components/reusable/themed-view";
import useCommentBookmarks from "@/hooks/useCommentBookmarks";
import usePostBookmarks from "@/hooks/usePostBookmarks";
import { cn } from "@/utils/cn.utils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<string>("posts");

  const { postBookmarks, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching, isLoading, error } = usePostBookmarks({ size: 10 });
  const { commentBookmarks, fetchNextPage: fetchNextCommentPage, hasNextPage: hasNextCommentPage, isFetchingNextPage: isFetchingNextCommentPage, refetch: refetchComment, isFetching: isFetchingComment, error: commentError } = useCommentBookmarks({ size: 10 });

  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
      <View className="p-4">
        <GeneralHeader title="Bookmarks" />
        <View className='w-full flex-row justify-center pt-4'>
          <Pressable onPress={() => setSelectedTab("posts")} className={cn(selectedTab === "posts" ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "flex-1 border-b-4")}>
            <ThemedText className="text-center text-lg border-b-4 p-2">Posts</ThemedText>
          </Pressable>
          <Pressable onPress={() => setSelectedTab("comments")} className={cn(selectedTab === "comments" ? "font-sans-medium border-accent" : "border-transparent text-muted dark:text-mutedDark", "flex-1 border-b-4")}>
            <ThemedText className="text-center text-lg border-b-4 p-2">Comments</ThemedText>
          </Pressable>
        </View>
      </View>
      {selectedTab === "posts" && (
        <PostList posts={postBookmarks} isLoading={isLoading} isFetching={isFetching} error={error} refetch={refetch} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
      )}
      {selectedTab === "comments" && (
        <CommentList comments={commentBookmarks} isFetching={isFetchingComment} error={commentError} refetch={refetchComment} fetchNextPage={fetchNextCommentPage} hasNextPage={hasNextCommentPage} isFetchingNextPage={isFetchingNextCommentPage} />
      )}
    </ThemedView>
  );
}

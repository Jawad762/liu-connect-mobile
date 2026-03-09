import HomeHeader from "@/components/home/HomeHeader";
import PostList from "@/components/posts/PostList";
import { ThemedView } from "@/components/reusable/themed-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top }}>
      <HomeHeader />
      <PostList />
    </ThemedView>
  );
}

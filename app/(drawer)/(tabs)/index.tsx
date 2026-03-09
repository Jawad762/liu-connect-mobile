import HomeHeader from "@/components/home/HomeHeader";
import { ThemedView } from "@/components/reusable/themed-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ paddingTop: insets.top }}>
      <HomeHeader />
    </ThemedView>
  );
}

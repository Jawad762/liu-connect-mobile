import { ThemedView } from "@/components/reusable/themed-view";
import SearchHeader from "@/components/Search/SearchHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ paddingTop: insets.top }}>
      <SearchHeader />
    </ThemedView>
  );
}

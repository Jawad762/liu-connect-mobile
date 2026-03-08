import { ThemedView } from "@/components/reusable/themed-view";
import CommunitiesHeader from "@/components/Communities/CommunitiesHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ paddingTop: insets.top }}>
      <CommunitiesHeader />
    </ThemedView>
  );
}

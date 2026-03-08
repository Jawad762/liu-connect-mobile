import { ThemedView } from "@/components/reusable/themed-view";
import NotificationsHeader from "@/components/Notifications/NotificationsHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ paddingTop: insets.top }}>
      <NotificationsHeader />
    </ThemedView>
  );
}

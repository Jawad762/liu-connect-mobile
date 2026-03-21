import { ThemedView } from "@/components/reusable/themed-view";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationsList from "@/components/notifications/NotificationsList";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView className='flex-1' style={{ paddingTop: insets.top }}>
      <NotificationsHeader />
      <NotificationsList />
    </ThemedView>
  );
}

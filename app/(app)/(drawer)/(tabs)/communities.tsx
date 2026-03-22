import { ThemedView } from "@/components/reusable/themed-view";
import CommunitiesHeader from "@/components/communities/CommunitiesHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import CommunitiesHome from "@/components/communities/CommunitiesHome";
import CommunitiesExplore from "@/components/communities/CommunitiesExplore";
import CreateCommunityModal from "@/components/communities/CreateCommunityModal";

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<"home" | "explore">("home");
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <CommunitiesHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        onCreatePress={() => setCreateModalVisible(true)}
      />
      {selectedTab === "home" ? <CommunitiesHome /> : <CommunitiesExplore />}
      <CreateCommunityModal
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      />
    </ThemedView>
  );
}

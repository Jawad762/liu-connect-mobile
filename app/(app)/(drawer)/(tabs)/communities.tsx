import { ThemedView } from "@/components/reusable/themed-view";
import CommunitiesHeader from "@/components/communities/CommunitiesHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import CommunitiesHome from "@/components/communities/CommunitiesHome";
import CommunitiesExplore from "@/components/communities/CommunitiesExplore";
import CreateCommunityModal from "@/components/communities/CreateCommunityModal";
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const TABS = ["home", "explore"] as const;
type Tab = typeof TABS[number];

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<Tab>("home");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);

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
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <CommunitiesHeader
        selectedTab={selectedTab}
        setSelectedTab={goToTab}
        onCreatePress={() => setCreateModalVisible(true)}
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
        <View style={{ width, flex: 1 }}>
          <CommunitiesHome />
        </View>
        <View style={{ width, flex: 1 }}>
          <CommunitiesExplore />
        </View>
      </ScrollView>
      <CreateCommunityModal
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      />
    </ThemedView>
  );
}

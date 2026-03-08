import { useRef, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, type Href } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Button } from "@/components/reusable/button";
import { ONBOARDING_SCREENS } from "@/constants/onboarding";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(offsetX / width));
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(offsetX / width));
  };

  const goToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/login" as Href);
  };

  const goToRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/register" as Href);
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <GradientBackground>
        <View style={{ paddingTop: insets.top + 56 }} className="flex-row justify-center items-center">
          <Image style={{ width: 80, height: 80 }} source={require("@/assets/images/icon.png")} className="rounded-full" />
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {ONBOARDING_SCREENS.map((screen) => (
            <View
              key={screen.id}
              className="flex-1 px-7"
              style={{ width }}
            >
              <View className="flex-1 justify-center items-center">
                <Text className="text-white/60 text-[11px] font-sans-semibold tracking-[2px] mb-3">
                  {screen.tagline}
                </Text>

                <Text
                  className="text-white text-[26px] font-sans-bold text-center mb-4 px-2"
                  style={{ lineHeight: 34 }}
                >
                  {screen.headline}
                </Text>

                <Text
                  className="text-white/75 text-base text-center max-w-[320px] font-sans"
                  style={{ lineHeight: 24 }}
                >
                  {screen.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View
          className="px-6 pt-6"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <View className="flex-row justify-center items-center gap-2 mb-7">
            {ONBOARDING_SCREENS.map((_, index) => (
              <View
                key={index}
                className="h-1.5 rounded-full"
                style={{
                  width: index === activeIndex ? 24 : 6,
                  backgroundColor:
                    index === activeIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </View>

          <Button onPress={goToLogin}>
            Login
          </Button>

          <Button variant="outline" onPress={goToRegister}>
            Sign Up
          </Button>
        </View>
      </GradientBackground>
    </View>
  );
}

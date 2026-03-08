import { Pressable, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils/cn.utils";

interface PressableTextProps {
  text: string;
  highlight: string;
  onPress: () => void;
  className?: string;
}

export function PressableText({
  text,
  highlight,
  onPress,
  className,
}: PressableTextProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const parts = text.split(highlight);

  return (
    <Pressable
      onPress={handlePress}
      className={cn("active:opacity-80", className)}
    >
      <Text className="text-white/90 text-[15px] text-center font-sans">
        {parts[0]}
        <Text className="font-sans-semibold">{highlight}</Text>
        {parts[1]}
      </Text>
    </Pressable>
  );
}

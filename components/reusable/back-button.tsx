import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./icon-symbol";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme-colors";

interface BackButtonProps {
  className?: string;
  color?: string;
}

export function BackButton({ className, color }: BackButtonProps) {
  const router = useRouter();
  const { colorScheme = 'light' } = useColorScheme();
  return (
    <Pressable
      onPress={() => router.back()}
      className={className}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <IconSymbol name="chevron.left" size={24} color={color || Colors[colorScheme].icon} />
    </Pressable>
  );
}

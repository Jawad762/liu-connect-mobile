import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
      <MaterialCommunityIcons name="arrow-left" size={24} color={color || Colors[colorScheme].icon} />
    </Pressable>
  );
}

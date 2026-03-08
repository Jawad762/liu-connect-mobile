import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./icon-symbol";

interface BackButtonProps {
  className?: string;
  color?: string;
}

export function BackButton({ className, color = "#ffffff" }: BackButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      className={className}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <IconSymbol name="chevron.left" size={24} color={color} />
    </Pressable>
  );
}

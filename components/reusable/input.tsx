import {
  TextInput,
  View,
  Text,
  type TextInputProps,
} from "react-native";
import { cn } from "@/utils/cn.utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  style,
  ...props
}: InputProps) {
  return (
    <View className={cn("mb-5 w-full", containerClassName)}>
      {label && (
        <Text className="text-white/90 text-sm mb-2 font-sans-medium">
          {label}
        </Text>
      )}
      <View
        className={cn(
          "h-14 rounded-[28px] border overflow-hidden",
          "bg-white/10 border-white/20",
          error && "border-red-500/80"
        )}
      >
        <TextInput
          placeholderTextColor="rgba(255,255,255,0.5)"
          className={cn("flex-1 h-full px-6 text-white text-base font-sans", className)}
          style={[{ backgroundColor: "transparent", width: "100%" }, style]}
          {...props}
        />
      </View>
      {error && (
        <Text className="text-red-400/95 text-[13px] mt-1.5 font-sans">
          {error}
        </Text>
      )}
    </View>
  );
}

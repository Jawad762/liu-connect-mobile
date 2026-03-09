import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils/cn.utils";
import { ThemedText } from "./themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "nativewind";

const GRADIENT_BTN = ["#60a5fa", "#818cf8", "#a78bfa"] as const;

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: string;
  variant?: "primary" | "outline";
  className?: string;
  loading?: boolean;
  textClassName?: string;
  viewHeight?: number | "auto";
}

export function Button({
  children,
  variant = "primary",
  disabled = false,
  className,
  loading = false,
  textClassName,
  viewHeight,
  ...props
}: ButtonProps) {
  const { colorScheme: colorScheme = "light" } = useColorScheme();

  if (variant === "primary") {
    return (
      <Pressable
        disabled={disabled}
        className={cn("mb-3.5", disabled && "opacity-60", className)}
        {...props}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={GRADIENT_BTN}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: viewHeight || 56,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
              ...(Platform.OS === "ios" && {
                shadowColor: "#60a5fa",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
              }),
              ...(Platform.OS === "android" && { elevation: 6 }),
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors[colorScheme].foreground} />
            ) : (
            <ThemedText className={cn("text-[17px] font-sans-semibold", textClassName)}>
              {children}
            </ThemedText>
            )}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      className={cn("mb-3.5", disabled && "opacity-60", className)}
      {...props}
    >
      {({ pressed }) => (
        <View
          style={{
            height: viewHeight || 56,
            opacity: pressed ? 0.85 : 1,
          }}
          className={cn("rounded-[28px] items-center justify-center border border-border dark:border-borderDark")}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors[colorScheme].foreground} />
          ) : (
            <ThemedText className={cn("text-[17px] font-sans-semibold", textClassName)}>
              {children}
            </ThemedText>
          )}
        </View>
      )}
    </Pressable>
  );
}

import { ActivityIndicator, Pressable, Text, View, type PressableProps } from "react-native";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils/cn.utils";

const GRADIENT_BTN = ["#60a5fa", "#818cf8", "#a78bfa"] as const;

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: string;
  variant?: "primary" | "outline";
  className?: string;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  disabled = false,
  className,
  loading = false,
  ...props
}: ButtonProps) {
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
              height: 56,
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
              <ActivityIndicator size="small" color="white" />
            ) : (
            <Text className="text-white text-[17px] font-sans-semibold">
              {children}
            </Text>
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
            height: 56,
            opacity: pressed ? 0.85 : 1,
          }}
          className="rounded-[28px] items-center justify-center bg-white/10 border border-white/35"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-[17px] font-sans-semibold">
              {children}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

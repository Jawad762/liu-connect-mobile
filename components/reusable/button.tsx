import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from "react-native";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils/cn.utils";
import { ThemedText } from "./themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "nativewind";

const DEFAULT_GRADIENT = ["#60a5fa", "#818cf8", "#a78bfa"] as const;

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "lg" | "md" | "sm";

const BUTTON_SIZE_CONFIG: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; textClass: string }
> = {
  lg: { height: 50, paddingHorizontal: 20, textClass: "text-[17px]" }, 
  md: { height: 42, paddingHorizontal: 16, textClass: "text-[16px]" },
  sm: { height: 35, paddingHorizontal: 12, textClass: "text-[14px]" },
};

interface CommonButtonProps extends Omit<PressableProps, "children"> {
  children: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export interface ButtonProps extends CommonButtonProps {
  variant?: ButtonVariant;
}

export interface GradientButtonProps extends CommonButtonProps {
  colors?: Readonly<[string, string, ...string[]]>;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  contentClassName,
  textClassName,
  leftIcon,
  rightIcon,
  fullWidth,
  ...rest
}: ButtonProps) {
  const { colorScheme: colorScheme = "light" } = useColorScheme();

  const { height, paddingHorizontal, textClass } = BUTTON_SIZE_CONFIG[size];

  const baseClasses =
    "rounded-full flex-row items-center justify-center mb-3.5";

  const variantClasses =
    variant === "primary"
      ? "bg-accent dark:bg-accentDark"
      : variant === "outline"
      ? "border border-border dark:border-borderDark bg-transparent"
      : "bg-transparent";

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses,
        fullWidth && "w-full",
        (disabled || loading) && "opacity-60",
        className
      )}
    >
      {({ pressed }) => (
        <View
          className={cn("flex-row items-center justify-center", contentClassName)}
          style={{
            opacity: pressed ? 0.85 : 1,
            height,
            paddingHorizontal,
          }}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={Colors[colorScheme].foreground}
            />
          ) : (
            <>
              {leftIcon && <View className="mr-2">{leftIcon}</View>}
              <ThemedText
                className={cn(
                  "font-sans-semibold",
                  textClass,
                  textClassName
                )}
              >
                {children}
              </ThemedText>
              {rightIcon && <View className="ml-2">{rightIcon}</View>}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function GradientButton({
  children,
  size = "md",
  loading = false,
  disabled,
  className,
  contentClassName,
  textClassName,
  leftIcon,
  rightIcon,
  fullWidth,
  colors = DEFAULT_GRADIENT,
  ...rest
}: GradientButtonProps) {
  const { colorScheme: colorScheme = "light" } = useColorScheme();

  const { height, paddingHorizontal, textClass } = BUTTON_SIZE_CONFIG[size];
  const borderRadius = height / 2;

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "mb-3.5",
        fullWidth && "w-full",
        (disabled || loading) && "opacity-60",
        className
      )}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height,
            borderRadius,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.9 : 1,
            ...(Platform.OS === "ios" && {
              shadowColor: "#60a5fa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
            }),
            ...(Platform.OS === "android" && { elevation: 6 }),
          }}
        >
          <View
            className={cn(
              "flex-row items-center justify-center",
              contentClassName
            )}
            style={{ paddingHorizontal }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Colors[colorScheme].foreground}
              />
            ) : (
              <>
                {leftIcon && <View className="mr-2">{leftIcon}</View>}
                <ThemedText
                  className={cn(
                    "font-sans-semibold",
                    textClass,
                    textClassName
                  )}
                >
                  {children}
                </ThemedText>
                {rightIcon && <View className="ml-2">{rightIcon}</View>}
              </>
            )}
          </View>
        </LinearGradient>
      )}
    </Pressable>
  );
}

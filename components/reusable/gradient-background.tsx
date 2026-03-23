import { LinearGradient } from "expo-linear-gradient";

const GRADIENT_COLORS = ["#000000", "#000000", "#0f172a"] as const;

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <LinearGradient colors={GRADIENT_COLORS} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}

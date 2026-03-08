import { LinearGradient } from "expo-linear-gradient";

const GRADIENT_COLORS = ["#1e3a5f", "#0f172a", "#000000"] as const;

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

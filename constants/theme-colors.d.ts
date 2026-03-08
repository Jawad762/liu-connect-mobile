export interface ColorScheme {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string;
  accentHover: string;
  tabIconDefault: string;
  tabIconSelected: string;
  icon: string;
}

export const Colors: { light: ColorScheme; dark: ColorScheme };
export function tailwindColors(): Record<string, string>;

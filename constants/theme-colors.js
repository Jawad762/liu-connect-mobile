const palette = {
  light: {
    background: '#ffffff',
    surface: '#f7f9f9',
    foreground: '#0f1419',
    muted: '#536471',
    border: '#d8d8d8',
    accent: '#1d9bf0',
    accentHover: '#1a8cd8',
    tabIconDefault: '#536471',
    tabIconSelected: '#1d9bf0',
    icon: '#000',
  },
  dark: {
    background: '#000000',
    surface: '#16181c',
    foreground: '#e7e9ea',
    muted: '#71767b',
    border: '#272729',
    accent: '#1d9bf0',
    accentHover: '#1a8cd8',
    tabIconDefault: '#fff',
    tabIconSelected: '#1d9bf0',
    icon: '#fff',
  },
};

exports.Colors = palette;

exports.tailwindColors = () => {
  const light = palette.light;
  const dark = palette.dark;
  return {
    background: light.background,
    backgroundDark: dark.background,
    surface: light.surface,
    surfaceDark: dark.surface,
    foreground: light.foreground,
    foregroundDark: dark.foreground,
    muted: light.muted,
    mutedDark: dark.muted,
    border: light.border,
    borderDark: dark.border,
    accent: light.accent,
    accentDark: dark.accent,
    accentHover: light.accentHover,
    accentHoverDark: dark.accentHover,
    tabIconDefault: light.tabIconDefault,
    tabIconDefaultDark: dark.tabIconDefault,
    tabIconSelected: light.tabIconSelected,
    tabIconSelectedDark: dark.tabIconSelected,
    icon: light.icon,
    iconDark: dark.icon,
  };
};

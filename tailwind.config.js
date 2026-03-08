const { tailwindColors } = require('./constants/theme-colors.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...tailwindColors(),
        gradient: {
          from: '#1e3a5f',
          via: '#0f172a',
          to: '#000000',
        },
        gradientBtn: {
          from: '#60a5fa',
          via: '#818cf8',
          to: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['DMSans_400Regular'],
        'sans-medium': ['DMSans_500Medium'],
        'sans-semibold': ['DMSans_600SemiBold'],
        'sans-bold': ['DMSans_700Bold'],
      },
    },
  },
  plugins: [],
};

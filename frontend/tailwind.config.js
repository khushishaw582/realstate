/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
        colors: {
        background: "#FAFAF9",
        surface: "#FFFFFF",
        border: "#E5E5E4",
        text: {
          primary: "#1C1C1B",
          secondary: "#6B6B69",
        },
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        brand: {
          DEFAULT: "#0A1628",
          light: "#0F1F3D",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D584",
        },
        hot: "#DC2626",
        warm: "#D97706",
        cold: "#2563EB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
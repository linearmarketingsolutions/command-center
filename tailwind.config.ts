import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // JARVIS Color Palette - Dark Mode Only
        jarvis: {
          // Primary - Cyan/Teal accent (JARVIS core)
          primary: {
            DEFAULT: "#00d4ff",
            dark: "#00a8cc",
            light: "#66e5ff",
            dim: "rgba(0, 212, 255, 0.1)",
          },
          // Secondary - Deep blue accent
          secondary: {
            DEFAULT: "#1a3a5c",
            dark: "#0f2538",
            light: "#2d5a8a",
          },
          // Background layers
          bg: {
            base: "#0a0f14",
            elevated: "#0d1419",
            card: "#111820",
            hover: "#16202a",
          },
          // Text colors
          text: {
            primary: "#e8f4f8",
            secondary: "#8ba3b0",
            muted: "#5a6f7d",
            dim: "#3a4f5c",
          },
          // Status colors
          status: {
            online: "#00ff88",
            warning: "#ffb347",
            error: "#ff4757",
            info: "#00d4ff",
          },
          // Accent glow
          glow: {
            primary: "rgba(0, 212, 255, 0.4)",
            secondary: "rgba(0, 168, 204, 0.2)",
            success: "rgba(0, 255, 136, 0.3)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-jarvis": "linear-gradient(135deg, #0a0f14 0%, #0d1419 50%, #111820 100%)",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(0, 212, 255, 0.4)",
        "glow-primary-lg": "0 0 40px rgba(0, 212, 255, 0.5)",
        "glow-success": "0 0 20px rgba(0, 255, 136, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
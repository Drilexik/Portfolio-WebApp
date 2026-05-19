import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#07070a",
          subtle: "#0f0f14",
          card: "#111118",
        },
        border: {
          DEFAULT: "#1e1e2a",
          mid: "#2d2d40",
          bright: "#4a4a6a",
        },
        ink: {
          DEFAULT: "#f0f0ff",
          muted: "#9090b0",
          dim: "#44445a",
        },
        purple: {
          DEFAULT: "#7c3aed",
          bright: "#9d5cff",
          dim: "#2d1060",
          glow: "#7c3aed22",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) both",
        "fade-in": "fadeIn 0.5s ease both",
        blink: "blink 1.1s step-end infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "border-pulse": "borderPulse 2s ease-in-out infinite",
        "slide-in": "slideIn 0.4s cubic-bezier(0.4,0,0.2,1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        borderPulse: {
          "0%,100%": { borderColor: "#1e1e2a" },
          "50%":     { borderColor: "#7c3aed" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

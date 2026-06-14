import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 당근 오렌지 계열 (brand)
        brand: {
          50: "#FFF3EC",
          100: "#FFE3D2",
          200: "#FFC4A3",
          300: "#FFA06D",
          400: "#FF8443",
          500: "#FF6B1A", // 메인 오렌지
          600: "#F2540A",
          700: "#C73F06",
          800: "#9C330B",
          900: "#7E2C0E",
        },
        // 크립토 보라/네온 액센트
        violetx: {
          400: "#9B8CFF",
          500: "#7C5CFF",
          600: "#6A3FF0",
          700: "#5A2FD0",
        },
        // 절약/긍정 강조 (민트)
        mint: {
          400: "#34E0B0",
          500: "#10C99A",
          600: "#0BA681",
          700: "#0A8468",
        },
        ink: {
          DEFAULT: "#0B0B12",
          soft: "#1A1A24",
          muted: "#3A3A48",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)",
        card: "0 1px 3px rgba(16,24,40,0.06), 0 12px 32px rgba(16,24,40,0.08)",
        glow: "0 12px 40px rgba(124,92,255,0.18), 0 4px 16px rgba(255,107,26,0.12)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FF6B1A 0%, #FF8443 40%, #7C5CFF 100%)",
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(124,92,255,0.12) 1px, transparent 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

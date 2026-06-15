import type { Config } from "tailwindcss";

const config: Config = {
  // 다크모드: <html data-theme="dark"> 또는 .dark 로 토글
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // brand = 딥 포레스트 그린 램프 (차분·프리미엄)
        brand: {
          50: "#eef5f0",
          100: "#dbeae1",
          200: "#b7d6c4",
          300: "#8bbea3",
          400: "#57a07e",
          500: "#2f8159",
          600: "#1b6b47", // PRIMARY
          700: "#14563a",
          800: "#114730",
          900: "#0c3322",
          950: "#071f15",
        },
        // 코인 금액 등 강조 (그린 계열로 통일)
        violetx: {
          400: "#57a07e",
          500: "#2f8159",
          600: "#1b6b47",
          700: "#14563a",
        },
        // 성공/절약 강조 (그린)
        mint: {
          400: "#57a07e",
          500: "#2f8159",
          600: "#1b6b47",
          700: "#14563a",
        },
        // 따뜻한 아이보리 중립
        ivory: {
          0: "#fcfbf6",
          50: "#f8f6ef",
          100: "#f1eee4",
          200: "#e7e3d6",
          300: "#d8d3c4",
        },
        // 다크 표면 (그린 틴트 블랙)
        night: {
          0: "#060d09",
          50: "#0b1611",
          100: "#10201a",
          200: "#1a2c24",
          300: "#26382f",
        },
        // 그린빛 잉크 텍스트
        ink: {
          DEFAULT: "#14201a",
          soft: "#34423a",
          muted: "#66746b",
          faint: "#8a968d",
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans KR"',
          '"IBM Plex Sans"',
          "system-ui",
          "-apple-system",
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          "sans-serif",
        ],
        mono: [
          '"IBM Plex Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
        card: "26px",
        sheet: "32px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(16,24,40,0.06), 0 10px 24px rgba(16,24,40,0.07)",
        card: "0 8px 24px rgba(16,24,40,0.08), 0 24px 48px rgba(16,24,40,0.10)",
        glow: "0 8px 28px rgba(27,107,71,0.22)",
        glass:
          "0 8px 32px rgba(11,40,27,0.14), inset 0 1px 0 rgba(255,255,255,0.55)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(140deg, #2f8159 0%, #1b6b47 55%, #14563a 100%)",
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(27,107,71,0.10) 1px, transparent 0)",
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

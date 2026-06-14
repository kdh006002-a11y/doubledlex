import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coupang-like red accent
        brand: {
          DEFAULT: "#ff5a5f",
          dark: "#e0484d",
        },
        btc: "#f7931a",
      },
    },
  },
  plugins: [],
};

export default config;

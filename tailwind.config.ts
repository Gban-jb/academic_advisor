import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // AAMU maroon
        maroon: {
          50:  "#fcf3f5",
          100: "#fbe8ec",
          200: "#f6d0d9",
          300: "#eea9bb",
          400: "#e27896",
          500: "#d24e75",
          600: "#bd315d",
          700: "#9e234b",
          800: "#7c1530",
          900: "#6d1530",
          950: "#3d0817",
        },
        // AAMU gold
        gold: {
          50:  "#fdfaec",
          100: "#faf1c8",
          200: "#f5e08d",
          300: "#efc94f",
          400: "#ebb52a",
          500: "#d4971a",
          600: "#b67314",
          700: "#915214",
          800: "#784017",
          900: "#663618",
          950: "#3a1c09",
        },
      },
      boxShadow: {
        soft: "0 1px 3px rgba(60,20,30,0.04), 0 8px 24px -8px rgba(60,20,30,0.08)",
        lift: "0 4px 12px rgba(60,20,30,0.06), 0 20px 40px -12px rgba(60,20,30,0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;

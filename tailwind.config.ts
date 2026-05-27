import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "secondary-fixed-dim": "#3cd7ff",
        "surface-tint": "#c2c6db",
        primary: "#c2c6db",
        background: "#101415",
        "surface-variant": "#323537",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-surface": "#e0e3e5",
        "surface-container-highest": "#323537",
        "on-error-container": "#ffdad6",
        "surface-container-high": "#272a2c",
        "tertiary-container": "#080f21",
        surface: "#101415",
        "primary-container": "#0a0f1e",
        "on-background": "#e0e3e5",
        outline: "#909097",
        "secondary-container": "#00d2fd",
        "surface-bright": "#363a3b",
        "on-secondary": "#003642",
        "surface-dim": "#101415",
        "on-primary": "#2b3040",
        "surface-container": "#1d2022",
        "secondary-fixed": "#b4ebff",
        "surface-container-lowest": "#0b0f10",
        "tertiary-fixed-dim": "#bfc6de",
        tertiary: "#bfc6de",
        "inverse-primary": "#595e70",
        "on-primary-container": "#777b8e",
        secondary: "#a2e7ff",
        "surface-container-low": "#191c1e",
        "primary-fixed-dim": "#c2c6db",
        "on-tertiary": "#293043",
        "on-surface-variant": "#c7c6cd",
        error: "#ffb4ab",
        "inverse-on-surface": "#2d3133",
        "primary-fixed": "#dee1f7",
        "on-primary-fixed": "#161b2b",
        "on-secondary-container": "#005669",
        "on-secondary-fixed": "#001f27",
        "outline-variant": "#46464c",
        "on-tertiary-container": "#757c92",
        "inverse-surface": "#e0e3e5",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        gutter: "16px",
        "section-gap": "32px",
        "container-margin": "20px",
        unit: "4px",
      },
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "display-lg": ["42px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg-mobile": ["26px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "44px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
      },
      backgroundImage: {
        "cyber-grid":
          "radial-gradient(rgba(0, 210, 253, 0.05) 1px, transparent 0)",
      },
      backgroundSize: {
        "cyber-grid": "24px 24px",
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

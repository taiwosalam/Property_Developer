import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        background: "#FBFBFB",

        brand: {
          1: "#EFF6FF",
          9: "#0033C4",

          primary: "#315EE7",
          secondary: "#6083ED",
        },

        text: {
          secondary: "#3F4247",

          label: "#5A5D61",
          black: "#232324",
          disabled: "#A4A7B0",
        },

        neutral: {
          2: "#FAFAFA",
        },

        status: {
          success: {
            primary: "#01BA4C",
          },
        },

        supporting: {
          1: "#38BDF8",
        },

        orange: {
          normal: "#E98305",
        },

        cloud: {
          dark: "#E8EDF1",
        },
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }: any) => {
      addUtilities({
        ".no-scrollbar": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* IE and Edge */,
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari, and Opera */,
        },
      });
    },
  ],
} satisfies Config;

export default config;

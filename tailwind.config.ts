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
      screens: {
        'xs': '480px',
      },
      colors: {
        background: {
          1: "#FBFBFB",
          2: "#EAEFFD",
        },
        themeColor: {
          DEFAULT: "var(--primary-color)",
          10: "rgba(var(--primary-color-rgb),0.1)",
          20: "rgba(var(--primary-color-rgb),0.2)",
          30: "rgba(var(--primary-color-rgb),0.3)",
          40: "rgba(var(--primary-color-rgb),0.4)",
          50: "rgba(var(--primary-color-rgb),0.5)",
          60: "rgba(var(--primary-color-rgb),0.6)",
          70: "rgba(var(--primary-color-rgb),0.7)",
          80: "rgba(var(--primary-color-rgb),0.8)",
          90: "rgba(var(--primary-color-rgb),0.9)",
        },
        brand: {
          1: "var(--brand-1)",
          2: "var(--brand-2)",
          3: "var(--brand-3)",
          5: "var(--brand-5)",
          7: "var(--brand-7)",
          9: "var(--brand-9)",
          10: "var(--brand-10)",
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          tertiary: "var(--brand-tertiary)",
          disabled: "#F7F9FE",
        },

        text: {
          primary: "#050901",

          secondary: "#3F4247",
          tertiary: "#696B70",
          quaternary: "#2F364B",
          label: "#5A5D61",
          black: "#232324",
          disabled: "#A4A7B0",
          invert: "#F4F4F9",
          white: {
            secondary: "#FFFFFFA6",
          },
        },

        darkText: {
          1: "#C1C2C3",
          2: "#A4A7B0 ",
          primary: '#020617',
        },


        neutral: {
          2: "#FAFAFA",
          3: "#F5F5F5",
          4: "#C1C2C3",
          6: "#CBD5E0",
          8: "#718096",
          800: "#262626",
        },

        status: {
          success: {
            primary: "#01BA4C",
            1: "#E6FAEE",
            2: "#01BA4C",
            3: "#005623",
          },
          error: {
            primary: "#E9212E",
            1: "#FDE9EA",
            2: "#E9212E",
          },
          caution: {
            1: "#FFF8EE",
            2: "#FFBB53",
            3: "#6B4F23",
          },
        },
        support: {
          1: "#38BDF8",
          2: "#2DD4BF",
          3: "#8C62FF",
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

        borders: {
          dark: "#C0C2C8",
          normal: "#787A7E",
        },

        primary: {
          navy: "#092C4C",
        },

        general: {
          low: "#303030",
        },

        highlight: "#E15B0F",
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

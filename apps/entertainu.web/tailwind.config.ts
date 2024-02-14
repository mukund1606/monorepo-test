import { type Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";
import vidstack from "@vidstack/react/tailwind.cjs";
import scrollbar from "tailwind-scrollbar";

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        abeezee: ["ABeeZee", "sans-serif"],
        sans: ["ABeeZee", "sans-serif"],
      },
      colors: {
        "media-brand": "rgb(var(--media-brand) / <alpha-value>)",
        "media-focus": "rgb(var(--media-focus) / <alpha-value>)",
        border: "hsl(var(--nextui-default))",
        input: "hsl(var(--nextui-default))",
        ring: "hsl(var(--nextui-focus))",
        destructive: {
          DEFAULT: "hsl(var(--nextui-danger))",
          foreground: "hsl(var(--nextui-danger-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--nextui-secondary))",
          foreground: "hsl(var(--nextui-secondary-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--nextui-content1-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--nextui-content1-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--nextui-radius-large)",
        md: "var(--nextui-radius-medium)",
        sm: "var(--nextui-radius-small)",
      },
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
  plugins: [
    require("tailwindcss-animate"),
    scrollbar({ nocompatible: true }),
    nextui({
      themes: {
        light: {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "#D0B378",
              foreground: "#0D0A05",
            },
            secondary: {
              DEFAULT: "#729EFC",
              foreground: "#0D0A05",
            },
            danger: {
              DEFAULT: "#ef4444",
              foreground: "#ffffff",
            },
            foreground: "#0D0A05",
            background: "#ffffff",
            focus: "#D0B378",
          },
        },
        dark: {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#B68728",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#7f1d1d",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#3B60AF",
              foreground: "#ffffff",
            },
            foreground: "#ffffff",
            background: "#0D0A05",
            focus: "#D0B378",
          },
        },
      },
    }),
    customVariants,
    vidstack({
      prefix: "media",
    }),
  ],
} as Config;

type VariantFunction = (name: string, styles: string[] | string) => void;

type MatchVariantFunction = (
  name: string,
  matcher: (value: string) => string,
) => void;

function customVariants({
  addVariant,
  matchVariant,
}: {
  addVariant: VariantFunction;
  matchVariant: MatchVariantFunction;
}): void {
  // Strict version of `.group` to help with nesting.
  matchVariant("parent-data", (value: string) => `.parent[data-${value}] > &`);

  addVariant("hocus", ["&:hover", "&:focus-visible"]);
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}

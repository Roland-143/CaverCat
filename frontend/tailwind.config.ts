import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Bebas Neue'", "sans-serif"],
        body: ["'Sora'", "sans-serif"]
      },
      colors: {
        cave: {
          abyss: "#07080A",
          basalt: "#111519",
          slate: "#1B232B",
          graphite: "#253241",
          mist: "#CAD3DB",
          glow: "#E8CF8B",
          moss: "#4D6A4A",
          clay: "#A36D3A",
          ember: "#D96A3D"
        }
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.45)",
        inset: "inset 0 0 0 1px rgba(232, 207, 139, 0.2)"
      },
      backgroundImage: {
        strata:
          "radial-gradient(1200px 700px at 10% -10%, rgba(163, 109, 58, 0.28), transparent 55%), radial-gradient(900px 600px at 90% 10%, rgba(77, 106, 74, 0.22), transparent 60%), linear-gradient(180deg, #07080A 0%, #111519 100%)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" }
        }
      },
      animation: {
        rise: "rise 0.6s ease-out both",
        shimmer: "shimmer 2.4s linear infinite"
      }
    }
  },
  plugins: []
} satisfies Config;

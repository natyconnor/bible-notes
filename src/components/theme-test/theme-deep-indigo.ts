import type { AppTheme } from "./theme-types"

export const deepIndigoTheme: AppTheme = {
  name: "Deep Indigo",
  description:
    "Scholarly, academic, and clean. A deep blue-indigo primary on a subtly cool-tinted white background—like a high-quality academic commentary or modern Bible study app. Refined, focused, and serious without being cold.",
  vars: {
    "--background": "oklch(0.99 0.005 260)",
    "--foreground": "oklch(0.18 0.02 260)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.18 0.02 260)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.18 0.02 260)",
    "--primary": "oklch(0.42 0.155 258)",
    "--primary-foreground": "oklch(0.98 0.01 260)",
    "--secondary": "oklch(0.94 0.02 260)",
    "--secondary-foreground": "oklch(0.28 0.03 260)",
    "--muted": "oklch(0.95 0.015 260)",
    "--muted-foreground": "oklch(0.48 0.04 260)",
    "--accent": "oklch(0.92 0.03 258)",
    "--accent-foreground": "oklch(0.28 0.03 260)",
    "--destructive": "oklch(0.55 0.2 25)",
    "--border": "oklch(0.9 0.02 260)",
    "--input": "oklch(0.9 0.02 260)",
    "--ring": "oklch(0.42 0.155 258)",
    "--radius": "0.375rem",
  },
}

import type { AppTheme } from "./theme-types"

export const forestSageTheme: AppTheme = {
  name: "Forest Sage",
  description:
    "Earthy, organic, and natural. A muted olive-green/sage primary on a clean white background with the faintest warm-neutral tint—like a nature journal or field guide. Calm, grounded, and easy on the eyes for long reading sessions.",
  vars: {
    "--background": "oklch(0.985 0.006 110)",
    "--foreground": "oklch(0.18 0.02 110)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.18 0.02 110)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.18 0.02 110)",
    "--primary": "oklch(0.48 0.09 145)",
    "--primary-foreground": "oklch(0.98 0.01 100)",
    "--secondary": "oklch(0.94 0.025 130)",
    "--secondary-foreground": "oklch(0.32 0.05 145)",
    "--muted": "oklch(0.93 0.02 120)",
    "--muted-foreground": "oklch(0.50 0.04 130)",
    "--accent": "oklch(0.92 0.035 130)",
    "--accent-foreground": "oklch(0.25 0.04 130)",
    "--destructive": "oklch(0.55 0.12 25)",
    "--border": "oklch(0.90 0.02 115)",
    "--input": "oklch(0.90 0.02 115)",
    "--ring": "oklch(0.48 0.09 145)",
    "--radius": "0.375rem",
  },
}

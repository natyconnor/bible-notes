import type { AppTheme } from "./theme-types";

export const warmManuscriptTheme: AppTheme = {
  name: "Warm Manuscript",
  description:
    "Inspired by illuminated manuscripts and parchment. Warm amber-gold accents, cream backgrounds, and sepia-toned text for a scholarly yet inviting feel.",
  vars: {
    "--background": "oklch(0.97 0.002 80)",
    "--foreground": "oklch(0.2 0.03 70)",
    "--card": "oklch(0.98 0.012 80)",
    "--card-foreground": "oklch(0.2 0.03 70)",
    "--popover": "oklch(0.98 0.012 80)",
    "--popover-foreground": "oklch(0.2 0.03 70)",
    "--primary": "oklch(0.52 0.14 62)",
    "--primary-foreground": "oklch(0.98 0.01 80)",
    "--secondary": "oklch(0.92 0.04 75)",
    "--secondary-foreground": "oklch(0.25 0.04 70)",
    "--muted": "oklch(0.93 0.025 78)",
    "--muted-foreground": "oklch(0.45 0.04 65)",
    "--accent": "oklch(0.88 0.06 72)",
    "--accent-foreground": "oklch(0.25 0.04 70)",
    "--destructive": "oklch(0.55 0.12 25)",
    "--border": "oklch(0.88 0.04 75)",
    "--input": "oklch(0.88 0.04 75)",
    "--ring": "oklch(0.52 0.14 62)",
    "--radius": "0.375rem",
  },
};

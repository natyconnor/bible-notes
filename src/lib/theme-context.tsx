import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { AppTheme } from "@/components/theme-test/theme-types"
import { warmManuscriptTheme } from "@/components/theme-test/theme-warm-manuscript"
import { deepIndigoTheme } from "@/components/theme-test/theme-deep-indigo"
import { forestSageTheme } from "@/components/theme-test/theme-forest-sage"

export const THEMES: AppTheme[] = [
  warmManuscriptTheme,
  deepIndigoTheme,
  forestSageTheme,
]

const STORAGE_KEY = "bible-notes-theme"

interface ThemeContextValue {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveInitialTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const match = THEMES.find((t) => t.name === saved)
      if (match) return match
    }
  } catch {
    // localStorage unavailable
  }
  return warmManuscriptTheme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(resolveInitialTheme)

  // Apply CSS vars to :root whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    for (const [key, value] of Object.entries(theme.vars)) {
      root.style.setProperty(key, value)
    }
  }, [theme])

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next.name)
    } catch {
      // localStorage unavailable
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

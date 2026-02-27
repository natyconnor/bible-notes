import { createContext } from "react"

import type { Tab } from "./tab-types"

export interface TabContextValue {
  tabs: Tab[]
  activeTabId: string | null
  openTab: (passageId: string, label: string) => void
  navigateActiveTab: (passageId: string, label: string) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
}

export const TabContext = createContext<TabContextValue | null>(null)

export const STORAGE_KEY = "bible_tabs"

export function loadTabs(): Tab[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return [{ id: "default", passageId: "John-1", label: "John 1" }]
}

export function saveTabs(tabs: Tab[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch {
    // ignore
  }
}

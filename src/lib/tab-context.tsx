import { useState, useCallback, useEffect, startTransition, type ReactNode } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"

import type { Tab } from "./tab-types"
import {
  TabContext,
  type PassageNavigationSearch,
  loadTabs,
  saveTabs,
} from "./tab-context-internal"

function getPassageIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/passage\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function updateTabHistory(history: string[], tabId: string): string[] {
  if (history[history.length - 1] === tabId) return history
  return [...history.filter((id) => id !== tabId), tabId]
}

function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>(loadTabs)
  const location = useLocation()
  const initialPassageId = getPassageIdFromPathname(location.pathname)
  const initialActiveTabId =
    (initialPassageId
      ? tabs.find((tab) => tab.passageId === initialPassageId)?.id
      : null) ??
    tabs[0]?.id ??
    null
  const [activeTabId, setActiveTabId] = useState<string | null>(initialActiveTabId)
  const [searchModeActive, setSearchModeActiveState] = useState(false)
  // Most recently used tab ids, newest at the end
  const [tabHistory, setTabHistory] = useState<string[]>(() =>
    initialActiveTabId ? [initialActiveTabId] : []
  )
  const navigate = useNavigate()

  useEffect(() => {
    const currentPassageId = getPassageIdFromPathname(location.pathname)
    if (!currentPassageId) return

    const matchingTab = tabs.find((tab) => tab.passageId === currentPassageId)
    if (!matchingTab) return

    setSearchModeActiveState(false)
    setActiveTabId((current) => (current === matchingTab.id ? current : matchingTab.id))
    setTabHistory((history) => updateTabHistory(history, matchingTab.id))
  }, [location.pathname, tabs])

  const setSearchModeActive = useCallback((active: boolean) => {
    setSearchModeActiveState(active)
    if (active) {
      setActiveTabId(null)
    }
  }, [])

  const openTab = useCallback(
    (passageId: string, label: string, search: PassageNavigationSearch = {}) => {
      setSearchModeActiveState(false)
      const existing = tabs.find((t) => t.passageId === passageId)
      if (existing) {
        setActiveTabId(existing.id)
        setTabHistory((history) => updateTabHistory(history, existing.id))
        startTransition(() => {
          navigate({ to: "/passage/$passageId", params: { passageId }, search })
        })
        return
      }
      const newTab: Tab = { id: crypto.randomUUID(), passageId, label }
      const newTabs = [...tabs, newTab]
      saveTabs(newTabs)
      setTabs(newTabs)
      setActiveTabId(newTab.id)
      setTabHistory((history) => updateTabHistory(history, newTab.id))
      startTransition(() => {
        navigate({ to: "/passage/$passageId", params: { passageId }, search })
      })
    },
    [tabs, navigate]
  )

  const navigateActiveTab = useCallback(
    (passageId: string, label: string, search: PassageNavigationSearch = {}) => {
      setSearchModeActiveState(false)
      if (!activeTabId) {
        openTab(passageId, label, search)
        return
      }
      const updatedTabs = tabs.map((t) =>
        t.id === activeTabId ? { ...t, passageId, label } : t
      )
      saveTabs(updatedTabs)
      setTabs(updatedTabs)
      startTransition(() => {
        navigate({ to: "/passage/$passageId", params: { passageId }, search })
      })
    },
    [activeTabId, tabs, navigate, openTab]
  )

  const closeTab = useCallback(
    (tabId: string) => {
      const idx = tabs.findIndex((t) => t.id === tabId)
      if (idx === -1) return
      const newTabs = tabs.filter((t) => t.id !== tabId)

      if (newTabs.length === 0) {
        // Always keep at least one tab
        const fallback: Tab = {
          id: crypto.randomUUID(),
          passageId: "John-1",
          label: "John 1",
        }
        saveTabs([fallback])
        setTabs([fallback])
        setSearchModeActiveState(false)
        setActiveTabId(fallback.id)
        setTabHistory([fallback.id])
        navigate({
          to: "/passage/$passageId",
          params: { passageId: "John-1" },
          search: {},
        })
        return
      }

      saveTabs(newTabs)
      setTabs(newTabs)
      setTabHistory((h) => h.filter((id) => id !== tabId))

      if (activeTabId === tabId) {
        // Find the most recently used tab that still exists
        const remainingIds = new Set(newTabs.map((t) => t.id))
        const lastUsed = [...tabHistory]
          .reverse()
          .find((id) => id !== tabId && remainingIds.has(id))
        const nextTab = lastUsed
          ? newTabs.find((t) => t.id === lastUsed)!
          : newTabs[Math.min(idx, newTabs.length - 1)]
        setActiveTabId(nextTab.id)
        navigate({
          to: "/passage/$passageId",
          params: { passageId: nextTab.passageId },
          search: {},
        })
      }
    },
    [tabs, activeTabId, tabHistory, navigate]
  )

  const handleSetActiveTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      if (!tab) return
      setSearchModeActiveState(false)
      setActiveTabId(tabId)
      setTabHistory((history) => updateTabHistory(history, tabId))
      startTransition(() => {
        navigate({
          to: "/passage/$passageId",
          params: { passageId: tab.passageId },
          search: {},
        })
      })
    },
    [tabs, navigate]
  )

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        searchModeActive,
        openTab,
        navigateActiveTab,
        closeTab,
        setActiveTab: handleSetActiveTab,
        setSearchModeActive,
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

export { TabProvider }

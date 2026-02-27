import { useState, useCallback, type ReactNode } from "react"
import { useNavigate } from "@tanstack/react-router"

import type { Tab } from "./tab-types"
import {
  TabContext,
  loadTabs,
  saveTabs,
} from "./tab-context-internal"

function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>(loadTabs)
  const [activeTabId, setActiveTabId] = useState<string | null>(
    () => loadTabs()[0]?.id ?? null
  )
  // Most recently used tab ids, newest at the end
  const [tabHistory, setTabHistory] = useState<string[]>(() => {
    const initial = loadTabs()[0]?.id
    return initial ? [initial] : []
  })
  const navigate = useNavigate()

  const openTab = useCallback(
    (passageId: string, label: string) => {
      const existing = tabs.find((t) => t.passageId === passageId)
      if (existing) {
        setActiveTabId(existing.id)
        setTabHistory((h) => [...h.filter((id) => id !== existing.id), existing.id])
        navigate({ to: "/passage/$passageId", params: { passageId } })
        return
      }
      const newTab: Tab = { id: crypto.randomUUID(), passageId, label }
      const newTabs = [...tabs, newTab]
      saveTabs(newTabs)
      setTabs(newTabs)
      setActiveTabId(newTab.id)
      setTabHistory((h) => [...h, newTab.id])
      navigate({ to: "/passage/$passageId", params: { passageId } })
    },
    [tabs, navigate]
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
        setActiveTabId(fallback.id)
        setTabHistory([fallback.id])
        navigate({ to: "/passage/$passageId", params: { passageId: "John-1" } })
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
        })
      }
    },
    [tabs, activeTabId, tabHistory, navigate]
  )

  const handleSetActiveTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      if (!tab) return
      setActiveTabId(tabId)
      setTabHistory((h) => [...h.filter((id) => id !== tabId), tabId])
      navigate({ to: "/passage/$passageId", params: { passageId: tab.passageId } })
    },
    [tabs, navigate]
  )

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        setActiveTab: handleSetActiveTab,
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

export { TabProvider }

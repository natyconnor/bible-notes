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
  const navigate = useNavigate()

  const openTab = useCallback(
    (passageId: string, label: string) => {
      setTabs((prev) => {
        const existing = prev.find((t) => t.passageId === passageId)
        if (existing) {
          setActiveTabId(existing.id)
          navigate({ to: "/passage/$passageId", params: { passageId } })
          return prev
        }
        const newTab: Tab = { id: crypto.randomUUID(), passageId, label }
        const newTabs = [...prev, newTab]
        saveTabs(newTabs)
        setActiveTabId(newTab.id)
        navigate({ to: "/passage/$passageId", params: { passageId } })
        return newTabs
      })
    },
    [navigate]
  )

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === tabId)
        if (idx === -1) return prev
        const newTabs = prev.filter((t) => t.id !== tabId)
        if (newTabs.length === 0) {
          // Always keep at least one tab
          const fallback: Tab = {
            id: crypto.randomUUID(),
            passageId: "John-1",
            label: "John 1",
          }
          saveTabs([fallback])
          setActiveTabId(fallback.id)
          navigate({
            to: "/passage/$passageId",
            params: { passageId: "John-1" },
          })
          return [fallback]
        }
        saveTabs(newTabs)
        if (activeTabId === tabId) {
          const nextIdx = Math.min(idx, newTabs.length - 1)
          setActiveTabId(newTabs[nextIdx].id)
          navigate({
            to: "/passage/$passageId",
            params: { passageId: newTabs[nextIdx].passageId },
          })
        }
        return newTabs
      })
    },
    [activeTabId, navigate]
  )

  const handleSetActiveTab = useCallback(
    (tabId: string) => {
      setActiveTabId(tabId)
      setTabs((prev) => {
        const tab = prev.find((t) => t.id === tabId)
        if (tab) {
          navigate({
            to: "/passage/$passageId",
            params: { passageId: tab.passageId },
          })
        }
        return prev
      })
    },
    [navigate]
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

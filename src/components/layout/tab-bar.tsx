import { useTabs } from "@/lib/use-tabs"
import { TabItem } from "./tab-item"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SearchDialog } from "@/components/notes/search-dialog"

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab } = useTabs()

  return (
    <div className="flex items-center border-b bg-muted/30 h-10 shrink-0">
      <ScrollArea className="flex-1">
        <div className="flex items-center h-10">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onActivate={() => setActiveTab(tab.id)}
              onClose={() => closeTab(tab.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center gap-1 mx-1 shrink-0">
        <SearchDialog />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => openTab("Genesis-1", "Genesis 1")}
          title="New tab"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

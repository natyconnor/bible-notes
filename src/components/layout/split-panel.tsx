import type { ReactNode } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"

interface SplitPanelProps {
  left: ReactNode
  right: ReactNode
}

export function SplitPanel({ left, right }: SplitPanelProps) {
  return (
    <Group orientation="horizontal" className="h-full">
      <Panel defaultSize={55} minSize={30}>
        {left}
      </Panel>
      <Separator className="w-1.5 bg-border hover:bg-primary/20 transition-colors cursor-col-resize" />
      <Panel defaultSize={45} minSize={25}>
        {right}
      </Panel>
    </Group>
  )
}

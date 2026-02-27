import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TabProvider } from "@/lib/tab-context"
import { ThemeProvider } from "@/lib/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "@/components/layout/app-shell"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <TabProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </TabProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

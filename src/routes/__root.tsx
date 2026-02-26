import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TabProvider } from "@/lib/tab-context"
import { AppShell } from "@/components/layout/app-shell"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <TabProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </TabProvider>
  )
}

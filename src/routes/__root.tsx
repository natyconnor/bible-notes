import { createRootRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import { TabProvider } from "@/lib/tab-context"
import { ThemeProvider } from "@/lib/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "@/components/layout/app-shell"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { readActiveOnboardingTour } from "@/components/onboarding/onboarding-session"
import { api } from "../../convex/_generated/api"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const location = useLocation()
  const isLoginRoute = location.pathname === "/login"
  const isSettingsRoute = location.pathname.startsWith("/settings")
  const onboardingStatus = useQuery(
    api.userSettings.getOnboardingStatus,
    isAuthenticated ? {} : "skip"
  )
  const activeOnboardingTour = readActiveOnboardingTour()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />
  }

  if (isAuthenticated && !isLoginRoute && onboardingStatus === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (
    isAuthenticated &&
    !isLoginRoute &&
    !isSettingsRoute &&
    onboardingStatus?.needsStarterTagsSetup &&
    onboardingStatus.mainOnboardingCompletedAt !== undefined &&
    activeOnboardingTour !== "main"
  ) {
    return <Navigate to="/settings" replace />
  }

  const resolvedOnboardingStatus = onboardingStatus ?? {
    needsStarterTagsSetup: false,
    categoryColors: {},
  }

  return (
    <ThemeProvider>
      <TabProvider>
        {isLoginRoute ? (
          <Outlet />
        ) : (
          <TooltipProvider>
            <OnboardingProvider onboardingStatus={resolvedOnboardingStatus}>
              <AppShell>
                <Outlet />
              </AppShell>
            </OnboardingProvider>
          </TooltipProvider>
        )}
      </TabProvider>
    </ThemeProvider>
  )
}

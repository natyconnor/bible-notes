import {
  createRootRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { TabProvider } from "@/lib/tab-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { TutorialProvider } from "@/components/tutorial/tutorial-provider";
import { readActiveTutorialTour } from "@/components/tutorial/tutorial-session";
import { LoginPage } from "@/components/login-page";
import { api } from "../../convex/_generated/api";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith("/settings");
  const tutorialStatus = useQuery(
    api.userSettings.getTutorialStatus,
    isAuthenticated ? {} : "skip",
  );
  const activeTutorialTour = readActiveTutorialTour();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (tutorialStatus === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (
    !isSettingsRoute &&
    tutorialStatus?.needsStarterTagsSetup &&
    tutorialStatus.mainTutorialCompletedAt !== undefined &&
    activeTutorialTour !== "main"
  ) {
    return <Navigate to="/settings" replace />;
  }

  const resolvedTutorialStatus = tutorialStatus ?? {
    needsStarterTagsSetup: false,
    categoryColors: {},
  };

  return (
    <ThemeProvider>
      <TabProvider>
        <TooltipProvider>
          <TutorialProvider tutorialStatus={resolvedTutorialStatus}>
            <AppShell>
              <Outlet />
            </AppShell>
          </TutorialProvider>
        </TooltipProvider>
      </TabProvider>
    </ThemeProvider>
  );
}

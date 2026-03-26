import { useCanGoBack, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPageLayout({ children }: { children: ReactNode }) {
  const canGoBack = useCanGoBack();
  const navigate = useNavigate();

  const handleBack = () => {
    if (canGoBack) {
      window.history.back();
      return;
    }
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 pb-16">
        <p className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer bg-transparent p-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Back
          </button>
        </p>
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { NoteUiVariantProvider } from "@/components/notes/note-ui-variant-provider";
import { useNoteUiVariant } from "@/components/notes/use-note-ui-variant";
import { cn } from "@/lib/utils";
import { TabBar } from "./tab-bar";

function AppShellSurface({ children }: { children: ReactNode }) {
  const { variant } = useNoteUiVariant();
  const isManuscript = variant === "manuscript";
  return (
    <div
      className={cn(
        "flex flex-col h-screen w-screen overflow-hidden",
        isManuscript ? "app-paper" : "bg-background",
      )}
    >
      <TabBar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <NoteUiVariantProvider>
      <AppShellSurface>{children}</AppShellSurface>
    </NoteUiVariantProvider>
  );
}

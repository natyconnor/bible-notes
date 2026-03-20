import { Badge } from "@/components/ui/badge";
import { useNoteUiVariant } from "@/components/notes/use-note-ui-variant";
import { cn } from "@/lib/utils";
import { StackedCardBackground } from "./view/note-card-primitives";

interface NoteBubbleStackProps {
  count: number;
  firstNotePreview: string;
  verseLabel: string;
  onClick: () => void;
}

export function NoteBubbleStack({
  count,
  firstNotePreview,
  verseLabel,
  onClick,
}: NoteBubbleStackProps) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isMargin = noteUiVariant === "margin";
  const isManuscript = noteUiVariant === "manuscript";

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {!isManuscript && <StackedCardBackground count={count} />}
      <div
        className={cn(
          "relative p-3 transition-colors overflow-visible",
          isManuscript
            ? cn("rounded-md border-0", "ms-note-hit")
            : cn(
                "border rounded-lg bg-card transition-all hover:shadow-sm",
                isMargin && "note-grain",
              ),
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {verseLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {count} notes
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {firstNotePreview}
        </p>
      </div>
    </div>
  );
}

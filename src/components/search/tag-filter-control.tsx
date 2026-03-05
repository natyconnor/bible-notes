import { useMemo, useState, type CSSProperties } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { X } from "lucide-react"

const TAG_AUTOCOMPLETE_THRESHOLD = 10
const MAX_AUTOCOMPLETE_ITEMS = 20

interface TagFilterControlProps {
  availableTags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onClear: () => void
  resolveTagStyle?: (tag: string) => CSSProperties | undefined
}

export function TagFilterControl({
  availableTags,
  selectedTags,
  onToggleTag,
  onClear,
  resolveTagStyle,
}: TagFilterControlProps) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const useAutocomplete = availableTags.length > TAG_AUTOCOMPLETE_THRESHOLD

  const suggestions = useMemo(() => {
    if (!useAutocomplete) return []
    const normalizedInput = input.trim().toLowerCase()
    return availableTags
      .filter((tag) => !selectedTags.includes(tag))
      .filter((tag) =>
        normalizedInput.length === 0 ? true : tag.toLowerCase().includes(normalizedInput)
      )
      .slice(0, MAX_AUTOCOMPLETE_ITEMS)
  }, [availableTags, input, selectedTags, useAutocomplete])

  const hasSelectedTags = selectedTags.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Tags
        </p>
        <Button
          size="xs"
          variant="ghost"
          onClick={onClear}
          disabled={!hasSelectedTags}
        >
          Clear
        </Button>
      </div>

      {hasSelectedTags && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge
              key={`selected-${tag}`}
              variant="outline"
              className="gap-1"
              style={resolveTagStyle?.(tag)}
            >
              {tag}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Remove tag</TooltipContent>
              </Tooltip>
            </Badge>
          ))}
        </div>
      )}

      {!useAutocomplete ? (
        availableTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No tags yet. Add tags to notes to enable filtering.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer"
                style={resolveTagStyle?.(tag)}
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Filter tags..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 120)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && suggestions.length > 0) {
                event.preventDefault()
                onToggleTag(suggestions[0])
                setInput("")
              }
              if (event.key === "Escape") {
                setInput("")
              }
            }}
            className="h-8 text-sm"
          />
          {isFocused && suggestions.length > 0 && (
            <div className="rounded-md border bg-popover p-1">
              {suggestions.map((tag) => (
                <button
                  key={`suggestion-${tag}`}
                  type="button"
                  className="w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-accent"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    onToggleTag(tag)
                    setInput("")
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {availableTags.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No tags yet. Add tags to notes to enable filtering.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

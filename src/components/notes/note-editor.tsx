import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { VerseRef } from "@/lib/verse-ref-utils"
import { formatVerseRef } from "@/lib/verse-ref-utils"

interface NoteEditorProps {
  verseRef: VerseRef
  initialContent?: string
  initialTags?: string[]
  onSave: (content: string, tags: string[]) => void
  onCancel: () => void
}

export function NoteEditor({
  verseRef,
  initialContent = "",
  initialTags = [],
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
    setTagInput("")
  }, [tagInput, tags])

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (content.trim()) {
          onSave(content.trim(), tags)
        }
      }
      if (e.key === "Escape") {
        e.preventDefault()
        onCancel()
      }
    },
    [content, tags, onSave, onCancel]
  )

  return (
    <div className="border rounded-lg p-3 bg-card shadow-sm space-y-3" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {formatVerseRef(verseRef)}
        </Badge>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-y text-sm"
      />

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add tag (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              addTag()
            }
          }}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => content.trim() && onSave(content.trim(), tags)}
          disabled={!content.trim()}
        >
          Save
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"}+Enter to save
        &middot; Esc to cancel
      </p>
    </div>
  )
}

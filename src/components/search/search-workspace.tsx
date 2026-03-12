import { useCallback, useMemo, useRef, type CSSProperties } from "react"
import { useQuery } from "convex-helpers/react/cache"
import { api } from "../../../convex/_generated/api"
import { useTabs } from "@/lib/use-tabs"
import { useEsvReference } from "@/hooks/use-esv-reference"
import {
  formatVerseRef,
  toPassageId,
  type VerseRef,
} from "@/lib/verse-ref-utils"
import { useStarterTagBadgeStyle } from "@/lib/tag-color-styles"
import { TagFilterControl } from "@/components/search/tag-filter-control"
import { HighlightedText } from "@/components/search/highlighted-text"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { type TagMatchMode } from "@/lib/tag-utils"
import { useSearchWorkspaceRouting } from "./hooks/use-search-workspace-routing"
import { useSearchWorkspacePersistence } from "./hooks/use-search-workspace-persistence"

export interface SearchWorkspaceRouteState {
  q?: string
  tags?: string
  mode?: TagMatchMode
  noteId?: string
}

interface SearchWorkspaceProps {
  search: SearchWorkspaceRouteState
}

interface SearchVerseRef {
  book: string
  chapter: number
  startVerse: number
  endVerse: number
}

interface SearchResultNote {
  noteId: string
  content: string
  tags: string[]
}

interface SearchResultGroup {
  key: string
  ref: SearchVerseRef | null
  notes: SearchResultNote[]
}

function toRefKey(ref: SearchVerseRef | null): string {
  if (!ref) return "__unlinked__"
  return `${ref.book}|${ref.chapter}|${ref.startVerse}|${ref.endVerse}`
}

function toVerseRefLabel(ref: SearchVerseRef): string {
  const normalizedRef: VerseRef = {
    book: ref.book,
    chapter: ref.chapter,
    startVerse: ref.startVerse,
    endVerse: ref.endVerse,
  }
  return formatVerseRef(normalizedRef)
}

interface ScriptureContextPaneProps {
  group: SearchResultGroup
  selectedNoteId: string | undefined
  normalizedQuery: string
  onSelectNote: (noteId: string) => void
  onJumpToRef: (ref: SearchVerseRef) => void
  resolveTagStyle: (tag: string) => CSSProperties | undefined
}

function SearchResultGroupRow({
  group,
  selectedNoteId,
  normalizedQuery,
  onSelectNote,
  onJumpToRef,
  resolveTagStyle,
}: ScriptureContextPaneProps) {
  const ref = group.ref
  const { data, loading, error, query } = useEsvReference(ref)

  return (
    <div className="grid gap-3 rounded-md border bg-card p-3 lg:grid-cols-[minmax(340px,1fr)_minmax(360px,1.1fr)]">
      <div className="space-y-2 rounded-sm border bg-background p-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">
            {ref ? toVerseRefLabel(ref) : "Unlinked notes"}
          </h3>
          {ref && (
            <div className="flex gap-1">
              <Button size="xs" onClick={() => onJumpToRef(ref)}>
                Go to verse
              </Button>
            </div>
          )}
        </div>

        {query && (
          <p className="text-xs text-muted-foreground">
            Showing exact verse range: {query}
          </p>
        )}

        {!ref ? (
          <p className="text-sm text-muted-foreground">
            These notes are not linked to verse references yet.
          </p>
        ) : loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading scripture context...
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : !data || data.verses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scripture context available.
          </p>
        ) : (
          <div className="space-y-0.5">
            {data.verses.map((verse) => (
              <button
                key={verse.number}
                type="button"
                className={cn(
                  "grid w-full grid-cols-[2rem_1fr] gap-2 rounded-sm px-2 py-1.5 text-left transition-colors",
                  "bg-sky-100/70 ring-1 ring-sky-400/30 hover:bg-sky-100 dark:bg-sky-900/20 dark:ring-sky-500/40 dark:hover:bg-sky-900/30",
                )}
                onClick={() => onJumpToRef(ref)}
              >
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {verse.number}
                </span>
                <p className="font-serif text-base leading-relaxed">
                  {verse.text}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {group.notes.map((note) => {
          const isSelected = selectedNoteId === note.noteId
          return (
            <button
              key={note.noteId}
              type="button"
              className={cn(
                "w-full rounded-md border px-3 py-2 text-left transition-colors",
                isSelected
                  ? "border-primary/40 bg-primary/5"
                  : "border-transparent hover:bg-muted",
              )}
              onClick={() => onSelectNote(note.noteId)}
            >
              <p className="text-sm leading-relaxed">
                <HighlightedText text={note.content} query={normalizedQuery} />
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {note.tags.map((tag) => (
                  <Badge
                    key={`${note.noteId}-${tag}`}
                    variant="outline"
                    className="text-[10px]"
                    style={resolveTagStyle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SearchWorkspace({ search }: SearchWorkspaceProps) {
  const { openTab } = useTabs()
  const resolveTagStyle = useStarterTagBadgeStyle()
  const resultsViewportRef = useRef<HTMLDivElement | null>(null)
  const {
    query,
    matchMode,
    selectedTags,
    selectedNoteId,
    normalizedQuery,
    hasTextQuery,
    shouldSearch,
    updateQuery,
    updateMatchMode,
    toggleTag,
    clearTags,
    selectNote,
  } = useSearchWorkspaceRouting(search)

  const catalog = useQuery(api.tags.listCatalog)
  const searchResults = useQuery(
    api.notes.searchWorkspace,
    shouldSearch
      ? {
          ...(hasTextQuery ? { query: normalizedQuery } : {}),
          tags: selectedTags,
          matchMode,
          limit: 100,
        }
      : "skip",
  )

  const availableTags = useMemo(
    () => (catalog ?? []).map((entry) => entry.tag),
    [catalog],
  )

  const groupedResults = useMemo<SearchResultGroup[]>(() => {
    if (!searchResults || searchResults.length === 0) return []

    const groups = new Map<string, SearchResultGroup>()

    for (const result of searchResults) {
      const ref = result.primaryRef ?? result.verseRefs[0] ?? null
      const key = toRefKey(ref)
      const note: SearchResultNote = {
        noteId: String(result.noteId),
        content: result.content,
        tags: result.tags,
      }
      const existing = groups.get(key)
      if (existing) {
        existing.notes.push(note)
      } else {
        groups.set(key, { key, ref, notes: [note] })
      }
    }

    return Array.from(groups.values()).sort((a, b) => {
      if (!a.ref && !b.ref) return 0
      if (!a.ref) return 1
      if (!b.ref) return -1
      return toRefKey(a.ref).localeCompare(toRefKey(b.ref))
    })
  }, [searchResults])

  const jumpToReference = useCallback(
    (ref: SearchVerseRef) => {
      const passageId = toPassageId(ref.book, ref.chapter)
      const label = `${ref.book} ${ref.chapter}`
      const focusSearch = {
        source: "search" as const,
        mode: "read" as const,
        startVerse: ref.startVerse,
        endVerse: ref.endVerse,
      }
      openTab(passageId, label, focusSearch)
    },
    [openTab],
  )

  const panelScrollClass = "h-[32vh] md:h-[34vh] lg:h-[calc(100vh-2.6rem)]"

  useSearchWorkspacePersistence({
    search,
    shouldSearch,
    searchResultsReady: searchResults !== undefined,
    viewportRef: resultsViewportRef,
  })

  return (
    <div className="h-full overflow-hidden">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
        <section className="order-1 border-b lg:border-r lg:border-b-0">
          <div className="grid border-b lg:grid-cols-[minmax(340px,1fr)_minmax(360px,1.1fr)]">
            <div className="border-r px-4 py-3">
              <h2 className="text-sm font-semibold">Scripture</h2>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Matching Notes</h2>
                <span className="text-xs text-muted-foreground">
                  {searchResults?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
          <div>
            <ScrollArea
              className={panelScrollClass}
              viewportRef={resultsViewportRef}
            >
              {!shouldSearch ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  Enter at least 2 characters or choose one or more tags.
                </div>
              ) : groupedResults.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  {searchResults === undefined
                    ? "Searching..."
                    : "No notes matched your search and filters."}
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  {groupedResults.map((group) => (
                    <SearchResultGroupRow
                      key={group.key}
                      group={group}
                      selectedNoteId={selectedNoteId}
                      normalizedQuery={normalizedQuery}
                      onSelectNote={selectNote}
                      onJumpToRef={jumpToReference}
                      resolveTagStyle={resolveTagStyle}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </section>

        <aside className="order-2 p-4 lg:border-b-0">
          <div className="space-y-3">
            <div className="space-y-1">
              <h1 className="text-base font-semibold">Search Tools</h1>
              <p className="text-xs text-muted-foreground">
                Search notes, filter tags, and choose a match mode.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Query
              </p>
              <Input
                placeholder="Type 2+ characters..."
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Match Mode
              </p>
              <div className="flex gap-1">
                <Button
                  size="xs"
                  variant={matchMode === "any" ? "secondary" : "outline"}
                  onClick={() => updateMatchMode("any")}
                >
                  Any
                </Button>
                <Button
                  size="xs"
                  variant={matchMode === "all" ? "secondary" : "outline"}
                  onClick={() => updateMatchMode("all")}
                >
                  All
                </Button>
              </div>
            </div>

            <TagFilterControl
              availableTags={availableTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onClear={clearTags}
              resolveTagStyle={resolveTagStyle}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

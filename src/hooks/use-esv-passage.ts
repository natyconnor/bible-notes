import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState, useEffect, useRef } from "react"
import {
  type EsvChapterData,
  getCachedPassage,
  setCachedPassage,
  parseEsvResponse,
} from "@/lib/esv-api"
import { toEsvQuery } from "@/lib/verse-ref-utils"

export function useEsvPassage(book: string, chapter: number) {
  const fetchPassage = useAction(api.esv.getPassageText)
  const query = toEsvQuery(book, chapter)
  const cached = getCachedPassage(query)

  const [asyncData, setAsyncData] = useState<EsvChapterData | null>(null)
  const [asyncLoading, setAsyncLoading] = useState(() => !cached)
  const [asyncError, setAsyncError] = useState<string | null>(null)
  const requestRef = useRef(0)

  useEffect(() => {
    if (cached) return

    const requestId = ++requestRef.current
    queueMicrotask(() => {
      setAsyncLoading(true)
      setAsyncError(null)
      setAsyncData(null)
    })

    fetchPassage({ query })
      .then((raw) => {
        if (requestId !== requestRef.current) return
        const parsed = parseEsvResponse(raw as Record<string, unknown>)
        setCachedPassage(query, parsed)
        setAsyncData(parsed)
      })
      .catch((err) => {
        if (requestId !== requestRef.current) return
        setAsyncError(err instanceof Error ? err.message : "Failed to load passage")
      })
      .finally(() => {
        if (requestId !== requestRef.current) return
        setAsyncLoading(false)
      })
  }, [query, cached, fetchPassage])

  return {
    data: cached ?? asyncData,
    loading: cached ? false : asyncLoading,
    error: cached ? null : asyncError,
  }
}

import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState, useEffect, useRef } from "react"
import {
  type EsvChapterData,
  getCachedPassage,
  setCachedPassage,
  parseEsvResponse,
} from "@/lib/esv-api"

interface ReferenceQuery {
  book: string
  chapter: number
  startVerse: number
  endVerse: number
}

function toReferenceQuery(ref: ReferenceQuery): string {
  if (ref.startVerse === ref.endVerse) {
    return `${ref.book} ${ref.chapter}:${ref.startVerse}`
  }
  return `${ref.book} ${ref.chapter}:${ref.startVerse}-${ref.endVerse}`
}

export function useEsvReference(ref: ReferenceQuery | null) {
  const fetchPassage = useAction(api.esv.getPassageText)
  const query = ref ? toReferenceQuery(ref) : null
  const cached = query ? getCachedPassage(query) : null

  const [asyncData, setAsyncData] = useState<EsvChapterData | null>(null)
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [asyncError, setAsyncError] = useState<string | null>(null)
  const requestRef = useRef(0)

  useEffect(() => {
    if (!query) {
      requestRef.current += 1
      return
    }
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
      .catch((error) => {
        if (requestId !== requestRef.current) return
        setAsyncError(error instanceof Error ? error.message : "Failed to load verse reference")
      })
      .finally(() => {
        if (requestId !== requestRef.current) return
        setAsyncLoading(false)
      })
  }, [cached, fetchPassage, query])

  return {
    data: cached ?? asyncData,
    loading: query ? (cached ? false : asyncLoading) : false,
    error: query ? (cached ? null : asyncError) : null,
    query,
  }
}

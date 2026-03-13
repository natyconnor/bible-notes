import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { useMutation } from "convex/react"
import { useLocation, useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { api } from "../../../convex/_generated/api"
import {
  OnboardingContext,
  type OnboardingContextValue,
  type OnboardingStep as TourStep,
} from "./onboarding-context"
import {
  readActiveOnboardingTour,
  writeActiveOnboardingTour,
  type OnboardingTourName,
} from "./onboarding-session"

interface OnboardingStatus {
  needsStarterTagsSetup: boolean
  starterTagsSetupCompletedAt?: number
  mainOnboardingCompletedAt?: number
  advancedSearchOnboardingCompletedAt?: number
  categoryColors: Record<string, string>
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform)
const modKey = isMac ? "⌘" : "Ctrl+"

const MAIN_TOUR_STEPS: TourStep[] = [
  {
    id: "add-note",
    title: "Add notes",
    description:
      "Use the add button beside a verse to start a note for that verse. You can have multiple notes per verse, or even select multiple verses",
    targetIds: ["passage-add-note"],
  },
  {
    id: "note-body",
    title: "Write a note",
    description:
      "Capture observations, questions, and study ideas in the editor.",
    targetIds: ["note-editor-body"],
  },
  {
    id: "note-tags",
    title: "Tag your notes",
    description:
      "Tags help organize themes and make notes easier to search later.",
    targetIds: ["note-editor-tags"],
  },
  {
    id: "inline-links",
    title: "Create verse links",
    description:
      "Use @ to type a verse reference like John 3:16 to insert a clickable verse link.",
    targetIds: ["note-editor-link-demo"],
  },
  {
    id: "reading-mode",
    title: "Switch to reading mode",
    description:
      "When you want to focus on reading your notes, switch to reading mode.",
    targetIds: ["passage-view-mode-toggle"],
  },
  {
    id: "search-button",
    title: "Search your notes",
    description: `Open search whenever you want to find notes by text or tags. Use ${modKey}K for a quick search.`,
    targetIds: ["app-search-button"],
  },
  {
    id: "passage-selector",
    title: "Jump to another passage",
    description: `Use the passage selector to move quickly to any passage. Or use ${modKey}G`,
    targetIds: ["app-book-selector"],
  },
  {
    id: "settings-button",
    title: "Open settings",
    description:
      "Settings is where you can import notes, and manage your tag catalog. Let's head there now.",
    targetIds: ["app-settings-button"],
  },
  {
    id: "starter-tags",
    title: "Starter tags",
    description:
      "If you want a head start, you can add a starter set of tags here.",
    targetIds: [
      "settings-starter-tags-section",
      "settings-add-all-starter-tags",
      "settings-starter-tag-categories",
    ],
  },
]

const SEARCH_TOUR_STEPS: TourStep[] = [
  {
    id: "query",
    title: "Text search",
    description: "Search by note text to find matching ideas or phrases.",
    targetIds: ["search-query-input"],
  },
  {
    id: "tags",
    title: "Tag filters",
    description:
      "You can narrow results with one or more tags from your catalog.",
    targetIds: ["search-tag-filter"],
  },
  {
    id: "match-mode",
    title: "Any or all tags",
    description:
      "Use Any to match any selected tag or All to require every selected tag.",
    targetIds: ["search-match-mode"],
  },
  {
    id: "results-and-context",
    title: "Read results in context",
    description:
      "Open the verse in context and read the matching notes alongside the chapter.",
    targetIds: [
      "search-demo-result",
      "search-demo-scripture-context",
      "search-demo-go-to-verse",
    ],
  },
]

const TOUR_STEPS: Record<OnboardingTourName, TourStep[]> = {
  main: MAIN_TOUR_STEPS,
  search: SEARCH_TOUR_STEPS,
}

const DEFAULT_CARD_WIDTH = 320
const CARD_MARGIN = 16
const SPOTLIGHT_PADDING = 10

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getStepList(tour: OnboardingTourName | null): TourStep[] {
  return tour ? TOUR_STEPS[tour] : []
}

function buildTargetSelector(targetIds: string[]): string {
  return targetIds.map((targetId) => `[data-tour-id="${targetId}"]`).join(", ")
}

function getTargetElements(targetIds: string[]): HTMLElement[] {
  if (typeof document === "undefined") return []
  return Array.from(
    document.querySelectorAll<HTMLElement>(buildTargetSelector(targetIds)),
  )
}

function getUnionRect(elements: HTMLElement[]): DOMRect | null {
  if (elements.length === 0) return null

  let left = Number.POSITIVE_INFINITY
  let top = Number.POSITIVE_INFINITY
  let right = Number.NEGATIVE_INFINITY
  let bottom = Number.NEGATIVE_INFINITY

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) continue
    left = Math.min(left, rect.left)
    top = Math.min(top, rect.top)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  }

  if (!Number.isFinite(left) || !Number.isFinite(top)) return null

  return {
    x: left,
    y: top,
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
    toJSON: () => ({}),
  } satisfies DOMRect
}

function getCardPosition(rect: DOMRect | null): CSSProperties {
  if (typeof window === "undefined") {
    return { left: CARD_MARGIN, right: CARD_MARGIN, bottom: CARD_MARGIN }
  }

  if (!rect) {
    return {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: DEFAULT_CARD_WIDTH,
      maxWidth: `calc(100vw - ${CARD_MARGIN * 2}px)`,
    }
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const width = Math.min(DEFAULT_CARD_WIDTH, viewportWidth - CARD_MARGIN * 2)
  const left = clamp(
    rect.left,
    CARD_MARGIN,
    viewportWidth - width - CARD_MARGIN,
  )
  const belowTop = rect.bottom + CARD_MARGIN
  const aboveTop = rect.top - 180 - CARD_MARGIN
  const top =
    belowTop + 180 <= viewportHeight - CARD_MARGIN
      ? belowTop
      : Math.max(CARD_MARGIN, aboveTop)

  return {
    width,
    left,
    top,
  }
}

export function OnboardingProvider({
  children,
  onboardingStatus,
}: {
  children: ReactNode
  onboardingStatus: OnboardingStatus
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const completeMainOnboarding = useMutation(
    api.userSettings.completeMainOnboarding,
  )
  const completeAdvancedSearchOnboarding = useMutation(
    api.userSettings.completeAdvancedSearchOnboarding,
  )
  const [activeTour, setActiveTour] = useState<OnboardingTourName | null>(() =>
    readActiveOnboardingTour(),
  )
  const [pendingTour, setPendingTour] = useState<OnboardingTourName | null>(
    null,
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [locallyCompletedTours, setLocallyCompletedTours] = useState<
    Partial<Record<OnboardingTourName, true>>
  >({})
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const finishingTourRef = useRef<OnboardingTourName | null>(null)

  const isMainComplete =
    locallyCompletedTours.main === true ||
    onboardingStatus.mainOnboardingCompletedAt !== undefined
  const isSearchComplete =
    locallyCompletedTours.search === true ||
    onboardingStatus.advancedSearchOnboardingCompletedAt !== undefined
  const activeSteps = getStepList(activeTour)
  const activeStep = activeSteps[stepIndex] ?? null
  const isPassageRoute = location.pathname.startsWith("/passage/")
  const isSearchRoute = location.pathname === "/search"

  useEffect(() => {
    writeActiveOnboardingTour(activeTour)
  }, [activeTour])

  useEffect(() => {
    if (!activeStep) {
      setTargetRect(null)
      return
    }

    let frameId = 0
    let hasScrolled = false
    const updateRect = () => {
      const elements = getTargetElements(activeStep.targetIds)
      const rect = getUnionRect(elements)
      setTargetRect(rect)

      // Scroll the first target into view once it appears (e.g. after page navigation)
      if (!hasScrolled && rect) {
        hasScrolled = true
        const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight
        if (!inViewport) {
          elements[0].scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }

      frameId = window.requestAnimationFrame(updateRect)
    }

    updateRect()
    return () => window.cancelAnimationFrame(frameId)
  }, [activeStep, location.pathname])

  useEffect(() => {
    if (activeTour || pendingTour) return

    if (!isMainComplete) {
      writeActiveOnboardingTour("main")
      if (isPassageRoute) {
        setActiveTour("main")
        setStepIndex(0)
      } else {
        setPendingTour("main")
        void navigate({
          to: "/passage/$passageId",
          params: { passageId: "John-1" },
          search: {},
          replace: true,
        })
      }
      return
    }

    if (!isSearchComplete && isSearchRoute) {
      writeActiveOnboardingTour("search")
      setActiveTour("search")
      setStepIndex(0)
    }
  }, [
    activeTour,
    isMainComplete,
    isPassageRoute,
    isSearchComplete,
    isSearchRoute,
    navigate,
    pendingTour,
  ])

  useEffect(() => {
    if (!pendingTour) return

    if (pendingTour === "main" && isPassageRoute) {
      setActiveTour("main")
      setStepIndex(0)
      setPendingTour(null)
      return
    }

    if (pendingTour === "search" && isSearchRoute) {
      setActiveTour("search")
      setStepIndex(0)
      setPendingTour(null)
    }
  }, [isPassageRoute, isSearchRoute, pendingTour])

  const finalizeTour = useCallback(
    async (tour: OnboardingTourName) => {
      if (finishingTourRef.current === tour) return

      finishingTourRef.current = tour
      setLocallyCompletedTours((current) => ({
        ...current,
        [tour]: true,
      }))
      setActiveTour(null)
      setPendingTour(null)
      setStepIndex(0)
      writeActiveOnboardingTour(null)

      try {
        if (tour === "main") {
          await completeMainOnboarding({})
          if (
            onboardingStatus.needsStarterTagsSetup &&
            location.pathname !== "/settings"
          ) {
            await navigate({ to: "/settings" })
          }
        } else {
          await completeAdvancedSearchOnboarding({})
        }
      } finally {
        finishingTourRef.current = null
      }
    },
    [
      completeAdvancedSearchOnboarding,
      completeMainOnboarding,
      location.pathname,
      navigate,
      onboardingStatus.needsStarterTagsSetup,
    ],
  )

  const startTour = useCallback(
    (tour: OnboardingTourName) => {
      setStepIndex(0)
      setPendingTour(null)
      writeActiveOnboardingTour(tour)

      if (tour === "main") {
        setActiveTour(null)
        if (isPassageRoute) {
          setActiveTour("main")
        } else {
          setPendingTour("main")
          void navigate({
            to: "/passage/$passageId",
            params: { passageId: "John-1" },
            search: {},
          })
        }
        return
      }

      setActiveTour(null)
      if (isSearchRoute) {
        setActiveTour("search")
      } else {
        setPendingTour("search")
        void navigate({ to: "/search", search: {} })
      }
    },
    [isPassageRoute, isSearchRoute, navigate],
  )

  const handleNext = () => {
    if (!activeTour || !activeStep) return

    const nextIndex = stepIndex + 1
    if (nextIndex >= activeSteps.length) {
      void finalizeTour(activeTour)
      return
    }

    const nextStep = activeSteps[nextIndex]
    setStepIndex(nextIndex)

    if (activeTour === "main" && nextStep.id === "starter-tags") {
      void navigate({ to: "/settings" })
    }
  }

  const handleBack = () => {
    if (!activeTour) return

    const nextIndex = Math.max(stepIndex - 1, 0)
    setStepIndex(nextIndex)

    if (activeTour === "main" && nextIndex <= 4 && !isPassageRoute) {
      setPendingTour("main")
      void navigate({
        to: "/passage/$passageId",
        params: { passageId: "John-1" },
        search: {},
      })
    }
  }

  const contextValue = useMemo<OnboardingContextValue>(
    () => ({
      activeTour,
      activeStep,
      stepIndex,
      stepCount: activeSteps.length,
      startTour,
      isTourActive: (tour) => activeTour === tour,
      isStepActive: (tour, stepId) =>
        activeTour === tour && activeStep?.id === stepId,
    }),
    [activeStep, activeSteps.length, activeTour, startTour, stepIndex],
  )

  const spotlightStyle: CSSProperties | undefined = targetRect
    ? {
        left: Math.max(0, targetRect.left - SPOTLIGHT_PADDING),
        top: Math.max(0, targetRect.top - SPOTLIGHT_PADDING),
        width: targetRect.width + SPOTLIGHT_PADDING * 2,
        height: targetRect.height + SPOTLIGHT_PADDING * 2,
        boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.58)",
      }
    : undefined

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      {activeTour && activeStep ? (
        <>
          <div className="pointer-events-auto fixed inset-0 z-140 bg-transparent" />
          {spotlightStyle ? (
            <div
              className="pointer-events-none fixed z-141 rounded-xl border-2 border-sky-400/90 bg-transparent transition-all duration-200"
              style={spotlightStyle}
            />
          ) : (
            <div className="pointer-events-auto fixed inset-0 z-141 bg-slate-950/55" />
          )}
          <section
            className="fixed z-142 rounded-xl border bg-card p-4 shadow-2xl"
            style={getCardPosition(targetRect)}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {activeTour === "main" ? "App Tour" : "Advanced Search"}
                </p>
                <h2 className="text-base font-semibold">{activeStep.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeStep.description}
                </p>
              </div>

              {targetRect === null ? (
                <p className="text-xs text-muted-foreground">
                  Preparing this step...
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {stepIndex + 1} / {activeSteps.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void finalizeTour(activeTour)}
                  >
                    Skip
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    disabled={stepIndex === 0}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    disabled={targetRect === null}
                  >
                    {stepIndex === activeSteps.length - 1 ? "Done" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </OnboardingContext.Provider>
  )
}

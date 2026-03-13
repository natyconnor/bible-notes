const ACTIVE_ONBOARDING_TOUR_KEY = "bible-notes-active-onboarding-tour"

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
}

export type OnboardingTourName = "main" | "search"

export function readActiveOnboardingTour(): OnboardingTourName | null {
  if (!hasWindow()) return null
  try {
    const value = window.sessionStorage.getItem(ACTIVE_ONBOARDING_TOUR_KEY)
    return value === "main" || value === "search" ? value : null
  } catch {
    return null
  }
}

export function writeActiveOnboardingTour(tour: OnboardingTourName | null) {
  if (!hasWindow()) return
  try {
    if (tour) {
      window.sessionStorage.setItem(ACTIVE_ONBOARDING_TOUR_KEY, tour)
    } else {
      window.sessionStorage.removeItem(ACTIVE_ONBOARDING_TOUR_KEY)
    }
  } catch {
    // ignore sessionStorage failures
  }
}

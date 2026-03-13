import { createContext, useContext } from "react"

import type { OnboardingTourName } from "./onboarding-session"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  targetIds: string[]
}

export interface OnboardingContextValue {
  activeTour: OnboardingTourName | null
  activeStep: OnboardingStep | null
  stepIndex: number
  stepCount: number
  startTour: (tour: OnboardingTourName) => void
  isTourActive: (tour: OnboardingTourName) => boolean
  isStepActive: (tour: OnboardingTourName, stepId: string) => boolean
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}

export function useOptionalOnboarding() {
  return useContext(OnboardingContext)
}

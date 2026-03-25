import { createContext, useContext } from "react";

import type { TutorialTourName } from "./tutorial-session";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetIds: string[];
  /** When set, the info card anchors to these elements instead of the spotlight rect. */
  cardAnchorIds?: string[];
  /** If set, this target is scrolled into view (e.g. center) instead of the first spotlight target. */
  scrollIntoViewTargetId?: string;
}

export interface TutorialContextValue {
  activeTour: TutorialTourName | null;
  activeStep: TutorialStep | null;
  stepIndex: number;
  stepCount: number;
  startTour: (tour: TutorialTourName) => void;
  isTourActive: (tour: TutorialTourName) => boolean;
  isStepActive: (tour: TutorialTourName, stepId: string) => boolean;
  isFocusModeTutorialComplete: boolean;
}

export const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within TutorialProvider");
  }
  return context;
}

export function useOptionalTutorial() {
  return useContext(TutorialContext);
}

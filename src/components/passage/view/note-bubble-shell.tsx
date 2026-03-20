"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNoteUiVariant } from "@/components/notes/use-note-ui-variant";
import {
  MANUSCRIPT_NOTE_ENTER_TRANSITION,
  NOTE_ENTER_TRANSITION,
} from "../note-animation-config";

export type BubbleState = "pill" | "collapsed" | "expanded";

interface NoteBubbleShellProps {
  state: BubbleState;
  pill: ReactNode;
  collapsed: ReactNode;
  expanded: ReactNode;
}

export function NoteBubbleShell({
  state,
  pill,
  collapsed,
  expanded,
}: NoteBubbleShellProps) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isManuscript = noteUiVariant === "manuscript";
  const isExpanded = state === "expanded";
  const opacityTransition = isManuscript
    ? MANUSCRIPT_NOTE_ENTER_TRANSITION
    : NOTE_ENTER_TRANSITION;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={state}
        initial={
          isExpanded
            ? isManuscript
              ? { opacity: 0, height: 0, y: 6 }
              : { opacity: 0, height: 0 }
            : { opacity: 0 }
        }
        animate={
          isExpanded
            ? isManuscript
              ? { opacity: 1, height: "auto", y: 0 }
              : { opacity: 1, height: "auto" }
            : { opacity: 1 }
        }
        exit={{ opacity: 0 }}
        transition={
          isExpanded
            ? {
                opacity: opacityTransition,
                y: opacityTransition,
                height: {
                  duration: isManuscript ? 0.24 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                },
              }
            : opacityTransition
        }
        style={isExpanded ? { overflow: "hidden" } : undefined}
      >
        {state === "pill"
          ? pill
          : state === "collapsed"
            ? collapsed
            : expanded}
      </motion.div>
    </AnimatePresence>
  );
}

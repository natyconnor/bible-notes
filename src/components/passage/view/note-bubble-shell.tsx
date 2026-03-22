"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
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
  const isCandlelight = noteUiVariant === "candlelight";
  const isExpanded = state === "expanded";
  const opacityTransition = isManuscript
    ? MANUSCRIPT_NOTE_ENTER_TRANSITION
    : NOTE_ENTER_TRANSITION;

  /**
   * For Candlelight, we skip the height 0→auto animation entirely and use
   * opacity-only. This avoids the need for `overflow:hidden` on the enter
   * wrapper, which would clip the multi-layer box-shadows that define the
   * variant's depth effect. Cards simply fade in at full height; the
   * surrounding layout adjusts smoothly via the `layout` props on parent
   * motion elements.
   *
   * For all other variants, we still need `overflow:hidden` during height
   * animation so content doesn't flash outside the container while it grows.
   * We release it after the enter animation completes so it doesn't permanently
   * clip CSS-only effects like focus rings.
   */
  const [clipOverflowForEnter, setClipOverflowForEnter] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useLayoutEffect(() => {
    if (state !== "expanded" || isCandlelight) {
      return;
    }

    setClipOverflowForEnter(true);

    const fallbackMs = isManuscript ? 400 : 320;
    const fallbackId = window.setTimeout(() => {
      setClipOverflowForEnter(false);
    }, fallbackMs);

    return () => {
      window.clearTimeout(fallbackId);
    };
  }, [state, isManuscript, isCandlelight]);

  const expandInitial = isCandlelight
    ? { opacity: 0 }
    : isManuscript
      ? { opacity: 0, height: 0, y: 6 }
      : { opacity: 0, height: 0 };

  const expandAnimate = isCandlelight
    ? { opacity: 1 }
    : isManuscript
      ? { opacity: 1, height: "auto", y: 0 }
      : { opacity: 1, height: "auto" };

  const expandTransition = isCandlelight
    ? opacityTransition
    : isExpanded
      ? {
          opacity: opacityTransition,
          y: opacityTransition,
          height: {
            duration: isManuscript ? 0.24 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          },
        }
      : opacityTransition;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={state}
        initial={isExpanded ? expandInitial : { opacity: 0 }}
        animate={isExpanded ? expandAnimate : { opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={expandTransition}
        onAnimationComplete={(definition) => {
          // Release overflow clip after the height enter animation completes.
          // Guard on `height:"auto"` so the exiting node's `{ opacity:0 }`
          // completion (which fires while stateRef.current is already "expanded")
          // does not trigger an early unclip mid-animation.
          const def = definition as Record<string, unknown>;
          if (stateRef.current === "expanded" && def.height === "auto") {
            setClipOverflowForEnter(false);
          }
        }}
        style={
          isExpanded && !isCandlelight
            ? { overflow: clipOverflowForEnter ? "hidden" : "visible" }
            : undefined
        }
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

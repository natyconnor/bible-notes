import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NOTE_ENTER_TRANSITION,
  NOTE_CONTENT_VARIANTS,
  NOTE_FADE_VARIANTS,
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
  const variants =
    state === "expanded" ? NOTE_CONTENT_VARIANTS : NOTE_FADE_VARIANTS;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={state}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={NOTE_ENTER_TRANSITION}
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

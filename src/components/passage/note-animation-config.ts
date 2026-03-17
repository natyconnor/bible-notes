import type { Transition, Variants } from "framer-motion";

export const NOTE_LAYOUT_TRANSITION: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

export const NOTE_ENTER_TRANSITION: Transition = {
  duration: 0.15,
  ease: [0.22, 1, 0.36, 1],
};

export const NOTE_CONTENT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -2 },
};

export const NOTE_FADE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const easeOut = [0.22, 1, 0.36, 1];
export const easeCinematic = [0.76, 0, 0.24, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeOut },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
};

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 28, filter: "blur(8px)", scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.65, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(6px)",
    scale: 1.01,
    transition: { duration: 0.35, ease: easeOut },
  },
};

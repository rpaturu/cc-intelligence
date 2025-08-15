export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

export const pageTransition = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.3
};

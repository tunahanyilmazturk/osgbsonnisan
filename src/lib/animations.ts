export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }
};

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 28 } }
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 }
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } }
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } }
};

// Pulse animation for status indicators
export const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Glow effect for important elements
export const glowVariants = {
  glow: {
    boxShadow: [
      "0 0 0 0 rgba(99, 102, 241, 0)",
      "0 0 20px 5px rgba(99, 102, 241, 0.3)",
      "0 0 0 0 rgba(99, 102, 241, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating animation for decorative elements
export const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Slide down animation for dropdowns
export const slideDownVariants = {
  hidden: { opacity: 0, y: -10, scaleY: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scaleY: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
    transition: { duration: 0.2 }
  }
};

// Bounce animation for buttons
export const bounceVariants = {
  bounce: {
    y: [0, -5, 0],
    transition: {
      duration: 0.5,
      repeat: 1,
      ease: "easeOut"
    }
  }
};

// Shimmer effect for loading states
export const shimmerVariants = {
  shimmer: {
    backgroundPosition: ["-200% 0", "200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Rotate animation for icons
export const rotateVariants = {
  rotate: {
    rotate: [0, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Scale pulse for important notifications
export const scalePulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Stagger children with custom delay
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Flip card animation
export const flipVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  show: { 
    rotateY: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

import type { Transition, Variants } from 'motion/react';

/**
 * Standard smooth easing curves for luxury feel (easeOut cubic-bezier)
 */
export const smoothEase = [0.22, 1, 0.36, 1] as const;

export const defaultTransition: Transition = {
    duration: 0.5,
    ease: smoothEase,
};

export const quickTransition: Transition = {
    duration: 0.35,
    ease: smoothEase,
};

export const viewportConfig = {
    once: true,
    margin: '-50px',
} as const;

/**
 * Fade In animation (GPU-accelerated: opacity only)
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: defaultTransition,
    },
};

/**
 * Fade Up animation (GPU-accelerated: opacity & transform y)
 */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: defaultTransition,
    },
};

/**
 * Fade Down animation (GPU-accelerated: opacity & transform y)
 */
export const fadeDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: defaultTransition,
    },
};

/**
 * Fade Left animation (GPU-accelerated: opacity & transform x)
 */
export const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: defaultTransition,
    },
};

/**
 * Fade Right animation (GPU-accelerated: opacity & transform x)
 */
export const fadeRight: Variants = {
    hidden: { opacity: 0, x: 24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: defaultTransition,
    },
};

/**
 * Scale In animation (GPU-accelerated: opacity & transform scale)
 */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: defaultTransition,
    },
};

/**
 * Stagger Container animation
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

/**
 * Custom stagger container helper
 */
export const createStaggerContainer = (stagger = 0.08, delay = 0): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: stagger,
            delayChildren: delay,
        },
    },
});

/**
 * Floating gentle hover for luxury items
 */
export const cardHover = {
    rest: { y: 0 },
    hover: {
        y: -6,
        transition: {
            duration: 0.3,
            ease: smoothEase,
        },
    },
};

/**
 * Word reveal variant for hero headline (< 1s full read)
 */
export const wordReveal: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: smoothEase,
        },
    },
};

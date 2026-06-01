/**
 * Strict Micro-Interaction Rules
 * 
 * Enforcing 150ms exact micro-interactions, 300ms transitions.
 * No elastic overshoots.
 */
export const MOTION_TOKENS = {
  micro: {
    duration: 0.15, // 150ms
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number], // ease-in-out standard
  },
  major: {
    duration: 0.4, // 350ms
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number], 
  },
  luxuryScale: 1.02, // Subtle interaction bumps to represent weight and quality
  perspectiveTilt: 5, // degree cap for 3D card tilt
};

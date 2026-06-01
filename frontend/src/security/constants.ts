/**
 * Security Noise Ceilings
 * 
 * Frozen Mathematical Constraints bounding the maximum degradation UX scaling.
 * Prevents UX collapse ensuring the site remains minimally legible even under Escalation Level 3.
 */

export const SECURITY_LIMITS = Object.freeze({
  MAX_NOISE_OPACITY: 0.15, // 15% opacity noise is incredibly annoying but legible
  MAX_GAUSSIAN_BLUR_RADIUS: 4, // 4px blur obscures details but retains shapes
  MAX_CONTRAST_DECAY: 0.8, // 80% contrast drops pop but maintains edge lines
  MAX_WATERMARK_OPACITY: 0.4, // Max watermark strength

  // Deterrence Transitions
  DEVTOOLS_PENALTY_MS: 3000, 
});

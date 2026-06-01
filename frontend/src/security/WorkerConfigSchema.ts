/**
 * Worker Config Schema Mapper
 * 
 * Divorces the Deterrence Store Enum `EscalationLevel` (0 | 1 | 2 | 3)
 * from the actual Image Pipeline mathematics. The Web Worker only perceives pure numbers.
 */

import type { EscalationLevel } from '../store/useDeterrenceStore';
import { SECURITY_LIMITS } from './constants';

export type WorkerSecurityConfig = {
  noiseLevel: number;
  blurRadius: number;
  contrastShift: number;
  watermarkOpacity: number;
};

export function mapEscalationToWorkerSchema(level: EscalationLevel): WorkerSecurityConfig {
  switch (level) {
    case 0:
      // Normal: Invisible protections, clean HD image, very subtle watermark
      return { noiseLevel: 0.02, blurRadius: 0, contrastShift: 1.0, watermarkOpacity: 0.05 };
    case 1:
      // Mild Deterrence: Detect anomalous mouse clicks or short DevTools session
      return { noiseLevel: 0.05, blurRadius: 1, contrastShift: 0.95, watermarkOpacity: 0.15 };
    case 2:
      // Significant Deterrence: Extended DevTools, copy-paste attempts
      return { noiseLevel: 0.10, blurRadius: 2, contrastShift: 0.85, watermarkOpacity: 0.25 };
    case 3:
      // Severe Deterrence (Capped against UX collapse): Continuous adversarial attempts
      return { 
        noiseLevel: SECURITY_LIMITS.MAX_NOISE_OPACITY, 
        blurRadius: SECURITY_LIMITS.MAX_GAUSSIAN_BLUR_RADIUS, 
        contrastShift: SECURITY_LIMITS.MAX_CONTRAST_DECAY, 
        watermarkOpacity: SECURITY_LIMITS.MAX_WATERMARK_OPACITY 
      };
    default:
      // Failsafe Baseline
      return { noiseLevel: 0, blurRadius: 0, contrastShift: 1.0, watermarkOpacity: 0 };
  }
}

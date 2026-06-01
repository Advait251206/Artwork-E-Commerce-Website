/**
 * Device Capability Scoring Engine
 * 
 * Safely analyzes the user's hardware via `navigator.hardwareConcurrency`, `deviceMemory`, 
 * and `performance` timings (handled via `ssrSafe.ts`) to return a tier score.
 * 
 * Tiers:
 * 0: Potato (Disable 3D, Disable Blur, Static Only)
 * 1: Low-End (Low-Res 3D, No Shadows, Demand Frameloop)
 * 2: Mid-Range (Standard 3D, Subtle Shadows)
 * 3: High-End (Full R3F, Dynamic Shadows, Uncapped Frameloop)
 */

import { getSafeNavigator } from '../utils/ssrSafe';

export type DeviceTier = 0 | 1 | 2 | 3;

export function determineDeviceCapability(): DeviceTier {
  const nav = getSafeNavigator();
  if (!nav) return 1; // Default to safe fallback in SSR

  let score = 0;

  // 1. Cores
  const cores = nav.hardwareConcurrency || 4;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;

  // 2. Memory (Not standard everywhere, but widely available in Chromium)
  const memory = ('deviceMemory' in nav ? (nav as { deviceMemory: number }).deviceMemory : 4);
  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;

  // Final Tier mapping
  if (score >= 4) return 3; // High-End
  if (score >= 2) return 2; // Mid-End
  if (score >= 1) return 1; // Low-End
  return 0; // Potato
}

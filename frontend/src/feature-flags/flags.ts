/**
 * Feature Flag Definitions
 * 
 * Static evaluations mapped against device capabilities and environments.
 */

import { determineDeviceCapability } from './deviceCapability';

const tier = determineDeviceCapability();

export const FLAGS = Object.freeze({
  // Only high-end/mid-end devices get the 3D intensive hero module.
  ENABLE_3D_HERO: tier >= 2,
  
  // Low-end devices might get R3F cards, but strictly with `demand` frameloops. Potatoes get 0.
  ENABLE_3D_CARDS: tier >= 1,
  
  // Immersive mode includes massive Math processing limits mapped to tier.
  ENABLE_IMMERSIVE_DETAIL_MODE: tier >= 2,
  
  // Observability is critical everywhere in Production, but could be disabled in Dev
  ENABLE_OBSERVABILITY_TELEMETRY: import.meta.env.PROD || true,

  // Force Fallbacks (Used fundamentally in Worker Crashes)
  // Devs can manually toggle this to test the fallback UI
  FORCE_SECURITY_FALLBACK: false,
});

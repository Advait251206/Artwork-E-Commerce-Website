/**
 * Feature Flag Accessor Hooks
 */
import { FLAGS } from './flags';

export type FeatureFlagKey = keyof typeof FLAGS;

export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  return FLAGS[flag];
}

export function getFeatureFlag(flag: FeatureFlagKey): boolean {
  return FLAGS[flag];
}

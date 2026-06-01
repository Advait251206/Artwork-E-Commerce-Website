/**
 * SSR Guard Pipeline
 * 
 * Protects the entire application against React Hydration Drift and 
 * `window is not defined` faults by wrapping all browser APIs natively.
 */

export const isBrowser = typeof window !== 'undefined';

export function getSafeWindow(): Window | null {
  return isBrowser ? window : null;
}

export function getSafeNavigator(): Navigator | null {
  return isBrowser ? navigator : null;
}

export function getSafePerformance(): Performance | null {
  return isBrowser ? performance : null;
}

/**
 * Deterministic Pseudo-Random Number Generator (PRNG)
 * Precludes the usage of `Math.random()` during initial mounts to prevent SSR drift.
 * 
 * Very basic LCG (Linear Congruential Generator) for visual noise determinism.
 */
export function createDeterministicSeeder(seed: number) {
  return function random() {
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296; // 2^32
    seed = (a * seed + c) % m;
    return seed / m;
  };
}

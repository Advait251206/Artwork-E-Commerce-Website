/**
 * Enterprise Performance Monitor
 * 
 * Captures FCP, LCP, CLS, and Long Tasks (>50ms).
 * Strictly gated by SSR wrappers and Feature Flags.
 */

import { getSafePerformance } from '../utils/ssrSafe';
import { getFeatureFlag } from '../feature-flags/useFeatureFlag';

export function initPerformanceMonitoring() {
  if (!getFeatureFlag('ENABLE_OBSERVABILITY_TELEMETRY')) return;

  const perf = getSafePerformance();
  if (!perf) return;

  try {
    // 1. Core Web Vitals (Using standard PerformanceObserver patterns if available)
    if (typeof PerformanceObserver !== 'undefined') {
      
      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.startTime > 2500) {
          console.warn(`[PERF: LCP] Violation: ${lastEntry.startTime.toFixed(2)}ms (Limit: 2500ms)`);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // FCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0].startTime;
          if (fcp > 1500) {
            console.warn(`[PERF: FCP] Violation: ${fcp.toFixed(2)}ms (Limit: 1500ms)`);
          }
        }
      }).observe({ type: 'paint', buffered: true });

      // CLS
      interface LayoutShift extends PerformanceEntry {
        hadRecentInput: boolean;
        value: number;
      }

      new PerformanceObserver((entryList) => {
        let clsScore = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as LayoutShift).hadRecentInput) {
            clsScore += (entry as LayoutShift).value;
          }
        }
        if (clsScore > 0.1) {
          console.warn(`[PERF: CLS] Violation: ${clsScore.toFixed(3)} (Limit: 0.1)`);
        }
      }).observe({ type: 'layout-shift', buffered: true });

      // Long Tasks (> 50ms implies frame drops or main-thread locking)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.warn(`[PERF: LONG TASK] UI Thread blocked for ${entry.duration.toFixed(2)}ms`);
        }
      }).observe({ type: 'longtask', buffered: true });
    }
  } catch {
    // Observers might not be supported in old browsers, silently catch
  }
}

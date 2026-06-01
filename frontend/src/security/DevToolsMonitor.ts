/**
 * DevTools Monitor 
 * 
 * A decoupled, pure event detector. It does NOT enforce consequences.
 * It strictly identifies anomalous viewport resizes indicative of DevTools mounting.
 */

import { securityLogger } from '../observability/securityEventsLogger';
import { useDeterrenceStore } from '../store/useDeterrenceStore';
import { SECURITY_LIMITS } from './constants';
import { getSafeWindow } from '../utils/ssrSafe';

let monitorInterval: ReturnType<typeof setInterval> | null = null;
let lastWidth = 0;
let lastHeight = 0;

export function initDevToolsMonitor() {
  const win = getSafeWindow();
  if (!win) return; // SSR safe

  lastWidth = win.innerWidth;
  lastHeight = win.innerHeight;

  monitorInterval = setInterval(() => {
    // Basic heuristic: Massive sudden UI shift without a standard interaction
    // (DevTools pinning to side or bottom)
    const currentWidth = win.innerWidth;
    const currentHeight = win.innerHeight;

    const widthDiff = Math.abs(currentWidth - lastWidth);
    const heightDiff = Math.abs(currentHeight - lastHeight);

    // If window shrinks by more than 250px instantly, highly likely DevTools opened
    if (widthDiff > 250 || heightDiff > 250) {
      securityLogger.log('DEVTOOLS_OPENED', { widthDiff, heightDiff });
      useDeterrenceStore.getState().escalate();
    }

    lastWidth = currentWidth;
    lastHeight = currentHeight;
  }, SECURITY_LIMITS.DEVTOOLS_PENALTY_MS); // Run checks periodically
}

export function teardownDevToolsMonitor() {
  if (monitorInterval) clearInterval(monitorInterval);
}

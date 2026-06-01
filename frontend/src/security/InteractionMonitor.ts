/**
 * Interaction Monitor
 * 
 * Traps adversarial DOM interactions: PrintScreen listener, ContextMenu (Right-Click),
 * and anomalous drag events on Canvas elements.
 */

import { securityLogger } from '../observability/securityEventsLogger';
import { useDeterrenceStore } from '../store/useDeterrenceStore';
import { getSafeWindow } from '../utils/ssrSafe';

export function initInteractionMonitor() {
  const win = getSafeWindow();
  if (!win) return; // SSR safe

  // 1. Right Click Prevention
  win.document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    securityLogger.log('CONTEXT_MENU_PREVENTED', { target: (e.target as HTMLElement)?.tagName });
    useDeterrenceStore.getState().escalate();
  });

  // 2. PrintScreen Key Trapping (Heuristic)
  win.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === '3')) {
      securityLogger.log('SCREENSHOT_ATTEMPT', { key: e.key });
      useDeterrenceStore.getState().escalate();
      // Instantly wipe clipboard if possible via modern API (Browser dependent)
      if (navClipboardExists(win.navigator)) {
        win.navigator.clipboard.writeText('Commercial use of this artwork is strictly prohibited. Session recorded.');
      }
    }
  });
}

function navClipboardExists(nav: Navigator): boolean {
  return typeof nav !== 'undefined' && typeof nav.clipboard !== 'undefined';
}

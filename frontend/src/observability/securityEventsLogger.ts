/**
 * Setup throttled event transmissions to future backend API.
 */
import { getFeatureFlag } from '../feature-flags/useFeatureFlag';

// Internal type mirroring the Escalation level
type SecurityEvent = 
  | 'DEVTOOLS_OPENED'
  | 'CONTEXT_MENU_PREVENTED'
  | 'SCREENSHOT_ATTEMPT'
  | 'ESCALATION_TRANSITION'
  | 'WORKER_FATAL_CRASH';

class SecurityEventsLogger {
  private lastEventTimestamps = new Map<SecurityEvent, number>();
  
  // Base throttle: limit 1 log packet per 2000ms per event type
  private THROTTLE_MS = 2000; 

  public log(event: SecurityEvent) {
    if (!getFeatureFlag('ENABLE_OBSERVABILITY_TELEMETRY')) return;

    const now = Date.now();
    const last = this.lastEventTimestamps.get(event) || 0;

    if (now - last < this.THROTTLE_MS) {
      // Throttled: Ignore to protect backend infrastructure
      return; 
    }

    this.lastEventTimestamps.set(event, now);

    // In production, send this via fetch
    // const logData = {
    //   event,
    //   timestamp: new Date().toISOString(),
    //   ...details,
    // };
    // console.warn(`[SECURITY TELEMETRY PACKET] ->`, logData);
  }
}

export const securityLogger = new SecurityEventsLogger();

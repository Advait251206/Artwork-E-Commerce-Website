/**
 * Memory Leak Watchdog
 * 
 * Tracks active Web Worker instances and Canvas element counts.
 */
import { getFeatureFlag } from '../feature-flags/useFeatureFlag';

class MemoryWatchdog {
  private activeWorkers = new Set<Worker>();
  private activeCanvases = 0;

  constructor() {
    if (getFeatureFlag('ENABLE_OBSERVABILITY_TELEMETRY')) {
      setInterval(() => this.auditMemoryConstraints(), 15000); // Check every 15s
    }
  }

  // --- Worker Tracking ---
  public registerWorker(worker: Worker) {
    this.activeWorkers.add(worker);
  }

  public unregisterWorker(worker: Worker) {
    this.activeWorkers.delete(worker);
  }

  // --- Canvas Tracking ---
  public incrementCanvas() {
    this.activeCanvases++;
  }

  public decrementCanvas() {
    this.activeCanvases = Math.max(0, this.activeCanvases - 1);
  }

  private auditMemoryConstraints() {
    // If we have > 1 Worker somehow still running, we have a catastrophic memory leak
    if (this.activeWorkers.size > 1) {
      console.error(`[WATCHDOG: WORKERS] CRITICAL: ${this.activeWorkers.size} Active Image Pipeline Workers detected. Max allowed is 1.`);
    }

    // Single active Canvas for details, plus maybe UI background. 
    // Anything > 2 means R3F nodes aren't properly unmounting.
    if (this.activeCanvases > 2) {
      console.warn(`[WATCHDOG: R3F] Memory Pressure: ${this.activeCanvases} active WebGL/2D contexts. Threshold is 2.`);
    }
  }
}

export const watchdog = new MemoryWatchdog();

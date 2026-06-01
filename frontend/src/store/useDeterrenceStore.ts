/**
 * Global Deterrence State
 * 
 * Centralized State Machine restricting adversarial actions to valid state transition limits.
 * Implements Decay intelligence to auto-return to Baseline over time.
 */

import { create } from 'zustand';
import { securityLogger } from '../observability/securityEventsLogger';

export type EscalationLevel = 0 | 1 | 2 | 3;

interface DeterrenceStore {
  level: EscalationLevel;
  
  // Transition Reducers
  escalate: () => void;
  reset: () => void;
  
  // Intrinsic state mutation guards
  _decayTimer: ReturnType<typeof setTimeout> | null;
}

const COOLDOWN_MS = 15000; // 15 seconds of inactivity decays 1 level

export const useDeterrenceStore = create<DeterrenceStore>((set, get) => ({
  level: 0,
  _decayTimer: null,

  escalate: () => {
    const currentState = get();
    
    // Clear any existing decay timer (we are under active attack)
    if (currentState._decayTimer) clearTimeout(currentState._decayTimer);

    // Reducer Transition Constraint: Only climb by +1, capped at 3
    let nextLevel: EscalationLevel = 3;
    if (currentState.level === 0) nextLevel = 1;
    else if (currentState.level === 1) nextLevel = 2;
    else if (currentState.level >= 2) nextLevel = 3;

    if (currentState.level !== nextLevel) {
      securityLogger.log('ESCALATION_TRANSITION', { from: currentState.level, to: nextLevel });
    }

    // Start background decay intelligently evaluating every X seconds
    const timer = setTimeout(() => {
      const stateNow = get();
      if (stateNow.level > 0) {
        // Decay by 1 step
        const decayedLevel = (stateNow.level - 1) as EscalationLevel;
        set({ level: decayedLevel });
      }
    }, COOLDOWN_MS);

    set({ level: nextLevel, _decayTimer: timer });
  },

  reset: () => {
    const currentState = get();
    if (currentState._decayTimer) clearTimeout(currentState._decayTimer);
    set({ level: 0, _decayTimer: null });
  }
}));

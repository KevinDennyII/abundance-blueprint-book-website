import { anyData, normalize } from "./math";
import type { PulseState } from "./types";

export const STORAGE_KEY = "lmc-money-pulse-v1";

export function loadPulseState(): {
  state: PulseState;
  hadLocal: boolean;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as PulseState) : null;
    if (anyData(parsed)) {
      return { state: normalize(parsed), hadLocal: true };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { state: normalize(null), hadLocal: false };
}

export function savePulseState(state: PulseState): void {
  try {
    const next = { ...state, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

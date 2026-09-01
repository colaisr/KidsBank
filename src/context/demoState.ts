import { DEMO_BASELINE, DEMO_STATE_VERSION, cloneDemoBaseline, type DemoState } from '../data/demoBaseline';

export const DEMO_STORAGE_KEY = 'kidsbank.demo';

function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as DemoState;
  return (
    candidate.version === DEMO_STATE_VERSION &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    typeof candidate.starsBalance === 'number'
  );
}

export function readDemoState(): DemoState {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      return cloneDemoBaseline();
    }

    const parsed: unknown = JSON.parse(raw);
    if (isDemoState(parsed)) {
      return parsed;
    }
  } catch {
    // ignore corrupt storage
  }

  return cloneDemoBaseline();
}

export function writeDemoState(state: DemoState): void {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable
  }
}

export function clearDemoStateStorage(): void {
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function resetDemoState(): DemoState {
  clearDemoStateStorage();
  return cloneDemoBaseline();
}

export { DEMO_BASELINE };

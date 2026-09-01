import {
  DEMO_BASELINE,
  DEMO_STATE_VERSION,
  cloneDemoBaseline,
  type DemoGoalState,
  type DemoState,
} from '../data/demoBaseline';

export const DEMO_STORAGE_KEY = 'kidsbank.demo';

type LegacyDemoStateV1 = {
  version: 1;
  card: DemoState['card'];
  piggy: DemoState['piggy'];
  starsBalance: number;
  tasks: DemoState['tasks'];
  goals: Array<{
    id: string;
    iconId: DemoGoalState['iconId'];
    currentStars: number;
    targetStars: number;
  }>;
};

function normalizeDemoState(state: DemoState): DemoState {
  const baseline = cloneDemoBaseline();
  return {
    ...state,
    piggy: {
      balance: state.piggy.balance,
      shareSlug: state.piggy.shareSlug ?? baseline.piggy.shareSlug,
    },
  };
}

function migrateV1ToV2(v1: LegacyDemoStateV1): DemoState {
  const baseline = cloneDemoBaseline();
  const migrated: DemoState = {
    version: DEMO_STATE_VERSION,
    parentWallet: baseline.parentWallet,
    card: { ...v1.card },
    piggy: {
      balance: v1.piggy.balance,
      shareSlug: v1.piggy.shareSlug ?? baseline.piggy.shareSlug,
    },
    cardLimit: null,
    starsBalance: v1.starsBalance,
    tasks: v1.tasks.map((task) => ({ ...task })),
    goals: v1.goals.map((goal) => {
      const baseGoal = baseline.goals.find((g) => g.id === goal.id);
      return {
        ...goal,
        amdValue: baseGoal?.amdValue ?? 100000,
        redeemed: false,
      };
    }),
    transactions: [...baseline.transactions],
  };
  return normalizeDemoState(migrated);
}

function isDemoStateV2(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as DemoState;
  return (
    candidate.version === DEMO_STATE_VERSION &&
    typeof candidate.parentWallet === 'number' &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    Array.isArray(candidate.transactions) &&
    typeof candidate.starsBalance === 'number'
  );
}

function isDemoStateV1(value: unknown): value is LegacyDemoStateV1 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV1;
  return (
    candidate.version === 1 &&
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
    if (isDemoStateV2(parsed)) {
      return normalizeDemoState(parsed);
    }
    if (isDemoStateV1(parsed)) {
      return migrateV1ToV2(parsed);
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

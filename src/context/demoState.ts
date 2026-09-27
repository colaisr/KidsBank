import {
  DEMO_BASELINE,
  DEMO_STATE_VERSION,
  cloneDemoBaseline,
  type DemoGoalState,
  type DemoState,
  type DemoTaskState,
  type PetState,
  type TaskStats,
} from '../data/demoBaseline';
import { normalizeActivityIconId } from '../data/activityIcons';
import { TASK_TEMPLATE_DEFAULT_DUE } from '../data/taskTemplates';
import { GOAL_TEMPLATE_DEFAULT_ICONS, CUSTOM_GOAL_DEFAULT_ICON, CUSTOM_GOAL_TEMPLATE_ID } from '../data/goalTemplates';
import {
  clearDesignerHandoffStorage,
  mergeKidsBankIntoHandoffStorage,
} from '../designer-child/kidsbankDemoBridge';

export const DEMO_STORAGE_KEY = 'kidsbank.demo';

type LegacyDemoStateV1 = {
  version: 1;
  card: DemoState['card'];
  piggy: DemoState['piggy'];
  starsBalance: number;
  tasks: Array<{
    id: string;
    rewardStars: number;
    statusId: DemoTaskState['statusId'];
    templateId?: string;
    dueTime?: string;
  }>;
  goals: Array<{
    id: string;
    iconId: DemoGoalState['iconId'];
    currentStars: number;
    targetStars: number;
  }>;
};

type DemoLocationFields = Pick<
  DemoState,
  'children' | 'activeChildId' | 'locationUpdatedAt' | 'fallbackChild' | 'savedPlaces'
>;

type DemoLimitsFields = Pick<DemoState, 'transferRecipients' | 'cashWithdrawal'>;

type LegacyDemoStateV2 = Omit<
  DemoState,
  'version' | 'taskStats' | 'pet' | keyof DemoLocationFields | keyof DemoLimitsFields
> & {
  version: 2;
  taskStats?: TaskStats;
};

function normalizeTask(task: DemoTaskState): DemoTaskState {
  const rawTemplateId = task.templateId ?? task.id;
  const templateId = rawTemplateId === 'addGoal' ? 'dishes' : rawTemplateId;
  const dueTime =
    task.dueTime ??
    TASK_TEMPLATE_DEFAULT_DUE[templateId as keyof typeof TASK_TEMPLATE_DEFAULT_DUE] ??
    '18:00';

  return {
    ...task,
    templateId,
    dueTime,
    completedAt: task.completedAt,
  };
}

function normalizeGoal(goal: DemoGoalState): DemoGoalState {
  const templateId = goal.templateId ?? goal.id;
  const defaultIcon =
    templateId === CUSTOM_GOAL_TEMPLATE_ID
      ? CUSTOM_GOAL_DEFAULT_ICON
      : GOAL_TEMPLATE_DEFAULT_ICONS[templateId as keyof typeof GOAL_TEMPLATE_DEFAULT_ICONS] ??
        CUSTOM_GOAL_DEFAULT_ICON;

  return {
    ...goal,
    templateId,
    iconId: normalizeActivityIconId(goal.iconId, defaultIcon),
    selected: goal.selected ?? goal.currentStars > 0,
  };
}

type LegacyDemoStateV3 = Omit<
  DemoState,
  'version' | 'pet' | keyof DemoLocationFields | keyof DemoLimitsFields
> & {
  version: 3;
  pet?: PetState;
};

function normalizePet(pet: PetState, baseline: PetState): PetState {
  return {
    xp: pet.xp ?? baseline.xp,
    fullness: pet.fullness ?? baseline.fullness,
    joy: pet.joy ?? baseline.joy,
    energy: pet.energy ?? baseline.energy,
    careCount: pet.careCount ?? 0,
    visitCount: pet.visitCount ?? 0,
    taskBuff: pet.taskBuff ?? false,
    lastTickAt: pet.lastTickAt ?? baseline.lastTickAt,
  };
}

type LegacyDemoStateV4 = Omit<
  DemoState,
  'version' | 'goals' | keyof DemoLocationFields | keyof DemoLimitsFields
> & {
  version: 4;
  goals: Array<Omit<DemoGoalState, 'selected'> & { selected?: boolean }>;
} & Partial<DemoLocationFields>;

type LegacyDemoStateV5 = Omit<DemoState, 'version' | keyof DemoLocationFields | keyof DemoLimitsFields> & {
  version: 5;
} & Partial<DemoLocationFields>;

type DemoStateNormalizeInput = {
  version: number;
  parentWallet: number;
  card: DemoState['card'];
  piggy: DemoState['piggy'];
  cardLimit: number | null;
  starsBalance: number;
  taskStats?: TaskStats;
  tasks: DemoTaskState[];
  goals: Array<DemoGoalState | (Omit<DemoGoalState, 'selected'> & { selected?: boolean })>;
  transactions: DemoState['transactions'];
  pet?: PetState;
} & Partial<DemoLocationFields> &
  Partial<DemoLimitsFields>;

function mergeLimitsFields(
  state: DemoStateNormalizeInput,
  baseline: DemoState,
): Pick<DemoState, 'transferRecipients' | 'cashWithdrawal'> {
  const withLimits = state as Partial<DemoState>;
  return {
    transferRecipients: withLimits.transferRecipients?.length
      ? withLimits.transferRecipients.map((recipient) => ({ ...recipient }))
      : baseline.transferRecipients.map((recipient) => ({ ...recipient })),
    cashWithdrawal: {
      ...baseline.cashWithdrawal,
      ...withLimits.cashWithdrawal,
    },
  };
}

function mergeLocationFields(
  state: DemoStateNormalizeInput,
  baseline: DemoState,
): Pick<
  DemoState,
  'children' | 'activeChildId' | 'locationUpdatedAt' | 'fallbackChild' | 'savedPlaces'
> {
  const withLocation = state as Partial<DemoState>;
  return {
    children: withLocation.children?.length
      ? withLocation.children.map((c) => ({ ...c }))
      : baseline.children.map((c) => ({ ...c })),
    activeChildId: withLocation.activeChildId ?? baseline.activeChildId,
    locationUpdatedAt: withLocation.locationUpdatedAt ?? baseline.locationUpdatedAt,
    fallbackChild: withLocation.fallbackChild
      ? { ...withLocation.fallbackChild }
      : { ...baseline.fallbackChild },
    savedPlaces: withLocation.savedPlaces?.length
      ? withLocation.savedPlaces.map((p) => ({
          ...p,
          liveOffsetMeters: { ...p.liveOffsetMeters },
        }))
      : baseline.savedPlaces.map((p) => ({
          ...p,
          liveOffsetMeters: { ...p.liveOffsetMeters },
        })),
  };
}

function mergeTransactionMapFields(
  transactions: DemoState['transactions'],
  baseline: DemoState,
): DemoState['transactions'] {
  const baselineById = new Map(baseline.transactions.map((tx) => [tx.id, tx]));
  return transactions.map((tx) => {
    const seed = baselineById.get(tx.id);
    if (!seed || tx.typeId !== 'spend') {
      return { ...tx };
    }
    return {
      ...tx,
      mapLat: tx.mapLat ?? seed.mapLat,
      mapLng: tx.mapLng ?? seed.mapLng,
      liveOffsetMeters: tx.liveOffsetMeters ?? seed.liveOffsetMeters,
    };
  });
}

function normalizeDemoState(state: DemoStateNormalizeInput): DemoState {
  const baseline = cloneDemoBaseline();
  const petSource = 'pet' in state && state.pet ? state.pet : baseline.pet;
  const location = mergeLocationFields(state, baseline);
  const limits = mergeLimitsFields(state, baseline);
  return {
    ...state,
    version: DEMO_STATE_VERSION,
    piggy: {
      balance: state.piggy.balance,
      shareSlug: state.piggy.shareSlug ?? baseline.piggy.shareSlug,
    },
    taskStats: state.taskStats ?? { ...baseline.taskStats },
    tasks: state.tasks.map((task) => normalizeTask(task)),
    goals: state.goals.map((goal) => normalizeGoal(goal as DemoGoalState)),
    pet: normalizePet(petSource, baseline.pet),
    transactions: mergeTransactionMapFields(state.transactions, baseline),
    ...location,
    ...limits,
  };
}

function migrateV1ToV2(v1: LegacyDemoStateV1): DemoState {
  const baseline = cloneDemoBaseline();
  const migrated: LegacyDemoStateV2 = {
    version: 2,
    parentWallet: baseline.parentWallet,
    card: { ...v1.card },
    piggy: {
      balance: v1.piggy.balance,
      shareSlug: v1.piggy.shareSlug ?? baseline.piggy.shareSlug,
    },
    cardLimit: null,
    starsBalance: v1.starsBalance,
    tasks: v1.tasks.map((task) => ({
      ...task,
      templateId: task.templateId ?? task.id,
      dueTime:
        task.dueTime ??
        TASK_TEMPLATE_DEFAULT_DUE[task.id as keyof typeof TASK_TEMPLATE_DEFAULT_DUE] ??
        '18:00',
    })),
    goals: v1.goals.map((goal) => {
      const baseGoal = baseline.goals.find((g) => g.id === goal.id);
      return {
        ...goal,
        templateId: goal.id,
        amdValue: baseGoal?.amdValue ?? 100000,
        redeemed: false,
        selected: baseGoal?.selected ?? goal.currentStars > 0,
      };
    }),
    transactions: [...baseline.transactions],
  };
  return migrateV2ToV3(migrated);
}

function migrateV4ToV5(v4: LegacyDemoStateV4): DemoState {
  const baseline = cloneDemoBaseline();
  const migratedGoals = v4.goals.map((goal) => ({
    ...goal,
    selected: goal.selected ?? goal.currentStars > 0,
  }));

  const usedTemplates = new Set(
    migratedGoals.filter((goal) => !goal.redeemed).map((goal) => goal.templateId),
  );
  const vitrineFromBaseline = baseline.goals.filter(
    (goal) => !goal.selected && !usedTemplates.has(goal.templateId),
  );

  return normalizeDemoState({
    ...v4,
    version: DEMO_STATE_VERSION,
    goals: [...migratedGoals, ...vitrineFromBaseline.map((goal) => ({ ...goal }))],
  });
}

function migrateV3ToV4(v3: LegacyDemoStateV3): DemoState {
  const baseline = cloneDemoBaseline();
  const v4: LegacyDemoStateV4 = {
    ...v3,
    version: 4,
    taskStats: v3.taskStats ?? cloneDemoBaseline().taskStats,
    tasks: v3.tasks.map((task) => normalizeTask(task)),
    pet: v3.pet ?? baseline.pet,
  };
  return migrateV4ToV5(v4);
}

function migrateV2ToV3(v2: LegacyDemoStateV2): DemoState {
  return migrateV3ToV4({
    ...v2,
    version: 3,
    taskStats: v2.taskStats ?? cloneDemoBaseline().taskStats,
    tasks: v2.tasks.map((task) => normalizeTask(task)),
  });
}

function migrateV5ToV6(v5: LegacyDemoStateV5): DemoState {
  return migrateV6ToV7(normalizeDemoState({ ...v5, version: 6 }));
}

type LegacyDemoStateV6 = Omit<DemoState, 'version' | keyof DemoLimitsFields> & {
  version: 6;
};

function migrateV6ToV7(v6: LegacyDemoStateV6 | DemoState): DemoState {
  return normalizeDemoState({ ...v6, version: DEMO_STATE_VERSION });
}

function isDemoStateV7(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as DemoState;
  return (
    candidate.version === DEMO_STATE_VERSION &&
    Array.isArray(candidate.transferRecipients) &&
    candidate.cashWithdrawal !== undefined &&
    Array.isArray(candidate.children) &&
    Array.isArray(candidate.savedPlaces) &&
    typeof candidate.activeChildId === 'string' &&
    typeof candidate.locationUpdatedAt === 'string' &&
    candidate.fallbackChild !== undefined &&
    typeof candidate.parentWallet === 'number' &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    Array.isArray(candidate.transactions) &&
    typeof candidate.starsBalance === 'number' &&
    candidate.taskStats !== undefined &&
    typeof candidate.taskStats.starsEarned === 'number' &&
    typeof candidate.taskStats.tasksCompleted === 'number' &&
    candidate.pet !== undefined &&
    typeof candidate.pet.xp === 'number'
  );
}

function isDemoStateV6(value: unknown): value is LegacyDemoStateV6 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV6;
  return (
    candidate.version === 6 &&
    Array.isArray(candidate.children) &&
    typeof candidate.parentWallet === 'number'
  );
}

function isDemoStateV5(value: unknown): value is LegacyDemoStateV5 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV5;
  return (
    candidate.version === 5 &&
    typeof candidate.parentWallet === 'number' &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    Array.isArray(candidate.transactions) &&
    typeof candidate.starsBalance === 'number' &&
    candidate.taskStats !== undefined &&
    candidate.pet !== undefined &&
    typeof candidate.pet.xp === 'number'
  );
}

function isDemoStateV4(value: unknown): value is LegacyDemoStateV4 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV4;
  return (
    candidate.version === 4 &&
    typeof candidate.parentWallet === 'number' &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    Array.isArray(candidate.transactions) &&
    typeof candidate.starsBalance === 'number' &&
    candidate.taskStats !== undefined &&
    candidate.pet !== undefined
  );
}

function isDemoStateV3(value: unknown): value is LegacyDemoStateV3 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV3;
  return (
    candidate.version === 3 &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
    typeof candidate.starsBalance === 'number' &&
    candidate.taskStats !== undefined
  );
}

function isDemoStateV2(value: unknown): value is LegacyDemoStateV2 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyDemoStateV2;
  return (
    candidate.version === 2 &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.goals) &&
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
    if (isDemoStateV7(parsed)) {
      return normalizeDemoState(parsed);
    }
    if (isDemoStateV6(parsed)) {
      return migrateV6ToV7(parsed);
    }
    if (isDemoStateV5(parsed)) {
      return migrateV5ToV6(parsed);
    }
    if (isDemoStateV4(parsed)) {
      return migrateV4ToV5(parsed);
    }
    if (isDemoStateV3(parsed)) {
      return migrateV3ToV4(parsed);
    }
    if (isDemoStateV2(parsed)) {
      return migrateV2ToV3(parsed);
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
    window.dispatchEvent(new CustomEvent('kidsbank-demo-updated'));
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
  clearDesignerHandoffStorage();
  const baseline = cloneDemoBaseline();
  writeDemoState(baseline);
  mergeKidsBankIntoHandoffStorage();
  return baseline;
}

export { DEMO_BASELINE };

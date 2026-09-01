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

type LegacyDemoStateV2 = Omit<DemoState, 'version' | 'taskStats' | 'pet'> & {
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
  };
}

type LegacyDemoStateV3 = Omit<DemoState, 'version' | 'pet'> & {
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

function normalizeDemoState(state: DemoState | LegacyDemoStateV3): DemoState {
  const baseline = cloneDemoBaseline();
  const petSource = 'pet' in state && state.pet ? state.pet : baseline.pet;
  return {
    ...state,
    version: DEMO_STATE_VERSION,
    piggy: {
      balance: state.piggy.balance,
      shareSlug: state.piggy.shareSlug ?? baseline.piggy.shareSlug,
    },
    taskStats: state.taskStats ?? { ...baseline.taskStats },
    tasks: state.tasks.map((task) => normalizeTask(task)),
    goals: state.goals.map((goal) => normalizeGoal(goal)),
    pet: normalizePet(petSource, baseline.pet),
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
      };
    }),
    transactions: [...baseline.transactions],
  };
  return migrateV2ToV3(migrated);
}

function migrateV3ToV4(v3: LegacyDemoStateV3): DemoState {
  const baseline = cloneDemoBaseline();
  return normalizeDemoState({
    ...v3,
    version: DEMO_STATE_VERSION,
    pet: v3.pet ?? baseline.pet,
  });
}

function migrateV2ToV3(v2: LegacyDemoStateV2): DemoState {
  return migrateV3ToV4({
    ...v2,
    version: 3,
    taskStats: v2.taskStats ?? cloneDemoBaseline().taskStats,
    tasks: v2.tasks.map((task) => normalizeTask(task)),
  });
}

function isDemoStateV4(value: unknown): value is DemoState {
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
    typeof candidate.starsBalance === 'number' &&
    candidate.taskStats !== undefined &&
    typeof candidate.taskStats.starsEarned === 'number' &&
    typeof candidate.taskStats.tasksCompleted === 'number' &&
    candidate.pet !== undefined &&
    typeof candidate.pet.xp === 'number'
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
    if (isDemoStateV4(parsed)) {
      return normalizeDemoState(parsed);
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

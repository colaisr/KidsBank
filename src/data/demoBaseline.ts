import type { DemoGoal, GoalIconId } from './goals';
import type { DemoTask } from './tasks';

export type TaskStatusId = 'open' | 'inProgress' | 'waitingParent' | 'done';

export type DemoTaskState = DemoTask & {
  statusId: TaskStatusId;
};

export type DemoGoalState = DemoGoal & {
  amdValue: number;
  redeemed: boolean;
};

export type TransactionTypeId =
  | 'parentToCard'
  | 'parentToPiggy'
  | 'childToParent'
  | 'spend'
  | 'goalRedeem';

export type DemoTransaction = {
  id: string;
  typeId: TransactionTypeId;
  amount: number;
  at: string;
};

export type DemoState = {
  version: 2;
  parentWallet: number;
  card: {
    last4: string;
    balance: number;
  };
  piggy: {
    balance: number;
  };
  cardLimit: number | null;
  starsBalance: number;
  tasks: DemoTaskState[];
  goals: DemoGoalState[];
  transactions: DemoTransaction[];
};

export const DEMO_STATE_VERSION = 2 as const;

export const DEMO_BASELINE: DemoState = {
  version: DEMO_STATE_VERSION,
  parentWallet: 50000,
  card: {
    last4: '1234',
    balance: 2567.48,
  },
  piggy: {
    balance: 6780,
  },
  cardLimit: null,
  starsBalance: 860,
  tasks: [
    { id: 'homework', rewardStars: 25, statusId: 'open' },
    { id: 'walkDog', rewardStars: 15, statusId: 'inProgress' },
    { id: 'tidyRoom', rewardStars: 20, statusId: 'waitingParent' },
  ],
  goals: [
    {
      id: 'bike',
      iconId: 'bike' as GoalIconId,
      currentStars: 650,
      targetStars: 800,
      amdValue: 120000,
      redeemed: false,
    },
    {
      id: 'ps5',
      iconId: 'gamepad' as GoalIconId,
      currentStars: 150,
      targetStars: 1500,
      amdValue: 250000,
      redeemed: false,
    },
  ],
  transactions: [
    {
      id: 'tx-seed-1',
      typeId: 'spend',
      amount: 450,
      at: '2026-08-28T14:30:00.000Z',
    },
    {
      id: 'tx-seed-2',
      typeId: 'parentToCard',
      amount: 1000,
      at: '2026-08-25T10:00:00.000Z',
    },
  ],
};

export function cloneDemoBaseline(): DemoState {
  return {
    ...DEMO_BASELINE,
    card: { ...DEMO_BASELINE.card },
    piggy: { ...DEMO_BASELINE.piggy },
    tasks: DEMO_BASELINE.tasks.map((task) => ({ ...task })),
    goals: DEMO_BASELINE.goals.map((goal) => ({ ...goal })),
    transactions: DEMO_BASELINE.transactions.map((tx) => ({ ...tx })),
  };
}

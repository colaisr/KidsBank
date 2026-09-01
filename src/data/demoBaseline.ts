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
  | 'goalRedeem'
  | 'piggyCashback'
  | 'piggyGiftMom'
  | 'piggyGiftGrandma'
  | 'cardToPiggy'
  | 'piggyToCard';

export const PIGGY_DEPOSIT_TYPE_IDS: TransactionTypeId[] = [
  'parentToPiggy',
  'piggyCashback',
  'piggyGiftMom',
  'piggyGiftGrandma',
  'cardToPiggy',
];

export function isPiggyDeposit(typeId: TransactionTypeId): boolean {
  return PIGGY_DEPOSIT_TYPE_IDS.includes(typeId);
}

export type DemoTransaction = {
  id: string;
  typeId: TransactionTypeId;
  amount: number;
  at: string;
};

export type TaskStats = {
  starsEarned: number;
  tasksCompleted: number;
};

export type DemoState = {
  version: 3;
  parentWallet: number;
  card: {
    last4: string;
    balance: number;
  };
  piggy: {
    balance: number;
    shareSlug: string;
  };
  cardLimit: number | null;
  starsBalance: number;
  taskStats: TaskStats;
  tasks: DemoTaskState[];
  goals: DemoGoalState[];
  transactions: DemoTransaction[];
};

export const DEMO_STATE_VERSION = 3 as const;

export const DEMO_BASELINE: DemoState = {
  version: DEMO_STATE_VERSION,
  parentWallet: 50000,
  card: {
    last4: '1234',
    balance: 2567.48,
  },
  piggy: {
    balance: 6780,
    shareSlug: 'david92',
  },
  cardLimit: null,
  starsBalance: 860,
  taskStats: {
    starsEarned: 860,
    tasksCompleted: 31,
  },
  tasks: [
    {
      id: 'homework',
      templateId: 'homework',
      rewardStars: 25,
      dueTime: '18:00',
      statusId: 'open',
    },
    {
      id: 'walkDog',
      templateId: 'walkDog',
      rewardStars: 15,
      dueTime: '20:00',
      statusId: 'open',
    },
    {
      id: 'hangLaundry',
      templateId: 'hangLaundry',
      rewardStars: 10,
      dueTime: '16:00',
      statusId: 'open',
    },
    {
      id: 'tidyRoom',
      templateId: 'tidyRoom',
      rewardStars: 15,
      dueTime: '19:30',
      statusId: 'open',
    },
    {
      id: 'dishes',
      templateId: 'dishes',
      rewardStars: 10,
      dueTime: '17:00',
      statusId: 'done',
    },
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

function createPiggySeedTransactions(): DemoTransaction[] {
  const now = new Date();
  const todayLate = new Date(now);
  todayLate.setHours(10, 24, 0, 0);
  const todayEarly = new Date(now);
  todayEarly.setHours(8, 15, 0, 0);
  const yesterdayLate = new Date(now);
  yesterdayLate.setDate(yesterdayLate.getDate() - 1);
  yesterdayLate.setHours(15, 30, 0, 0);
  const yesterdayEarly = new Date(now);
  yesterdayEarly.setDate(yesterdayEarly.getDate() - 1);
  yesterdayEarly.setHours(11, 0, 0, 0);

  return [
    {
      id: 'piggy-tx-cashback',
      typeId: 'piggyCashback',
      amount: 8,
      at: todayLate.toISOString(),
    },
    {
      id: 'piggy-tx-mom',
      typeId: 'piggyGiftMom',
      amount: 500,
      at: todayEarly.toISOString(),
    },
    {
      id: 'piggy-tx-grandma',
      typeId: 'piggyGiftGrandma',
      amount: 500,
      at: yesterdayLate.toISOString(),
    },
    {
      id: 'piggy-tx-grandma-2',
      typeId: 'piggyGiftGrandma',
      amount: 500,
      at: yesterdayEarly.toISOString(),
    },
  ];
}

export function cloneDemoBaseline(): DemoState {
  return {
    ...DEMO_BASELINE,
    card: { ...DEMO_BASELINE.card },
    piggy: { ...DEMO_BASELINE.piggy },
    taskStats: { ...DEMO_BASELINE.taskStats },
    tasks: DEMO_BASELINE.tasks.map((task) => ({ ...task })),
    goals: DEMO_BASELINE.goals.map((goal) => ({ ...goal })),
    transactions: [
      ...createPiggySeedTransactions(),
      ...DEMO_BASELINE.transactions.map((tx) => ({ ...tx })),
    ],
  };
}

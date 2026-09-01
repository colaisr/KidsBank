import type { DemoGoal } from './goals';
import type { DemoTask } from './tasks';

export type TaskStatusId = 'open' | 'inProgress' | 'waitingParent' | 'done';

export type DemoTaskState = DemoTask & {
  statusId: TaskStatusId;
};

export type DemoGoalState = DemoGoal & {
  templateId: string;
  customTitle?: string;
  amdValue: number;
  redeemed: boolean;
  /** Child chose to pursue this goal; false = parent vitrine only */
  selected: boolean;
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
  | 'piggyToCard'
  | 'taskReward';

export type TransactionCurrency = 'AMD' | 'STARS';

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
  currency?: TransactionCurrency;
  taskId?: string;
  taskTemplateId?: string;
  merchantKey?: string;
};

export type TaskStats = {
  starsEarned: number;
  tasksCompleted: number;
};

export type PetState = {
  xp: number;
  fullness: number;
  joy: number;
  energy: number;
  careCount: number;
  visitCount: number;
  taskBuff: boolean;
  lastTickAt: string;
};

export type DemoState = {
  version: 5;
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
  pet: PetState;
};

export const DEMO_STATE_VERSION = 5 as const;

function createBaselinePet(): PetState {
  return {
    xp: 25,
    fullness: 80,
    joy: 65,
    energy: 40,
    careCount: 0,
    visitCount: 0,
    taskBuff: false,
    lastTickAt: new Date().toISOString(),
  };
}

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
      id: 'ps5',
      templateId: 'ps5',
      iconId: 'gamepad',
      currentStars: 600,
      targetStars: 1500,
      amdValue: 250000,
      redeemed: false,
      selected: true,
    },
    {
      id: 'sneakers',
      templateId: 'sneakers',
      iconId: 'gift',
      currentStars: 86,
      targetStars: 430,
      amdValue: 35000,
      redeemed: false,
      selected: true,
    },
    {
      id: 'bike',
      templateId: 'bike',
      iconId: 'gift',
      currentStars: 0,
      targetStars: 2200,
      amdValue: 120000,
      redeemed: false,
      selected: false,
    },
    {
      id: 'skateboard',
      templateId: 'skateboard',
      iconId: 'gift',
      currentStars: 0,
      targetStars: 900,
      amdValue: 80000,
      redeemed: false,
      selected: false,
    },
    {
      id: 'book',
      templateId: 'book',
      iconId: 'book',
      currentStars: 0,
      targetStars: 150,
      amdValue: 15000,
      redeemed: false,
      selected: false,
    },
    {
      id: 'headphones',
      templateId: 'headphones',
      iconId: 'gift',
      currentStars: 0,
      targetStars: 1100,
      amdValue: 50000,
      redeemed: false,
      selected: false,
    },
  ],
  transactions: [],
  pet: createBaselinePet(),
};

function createTransactionsSeed(): DemoTransaction[] {
  const now = new Date();
  const todayHomework = new Date(now);
  todayHomework.setHours(16, 45, 0, 0);
  const todaySpend = new Date(now);
  todaySpend.setHours(14, 20, 0, 0);
  const todayCashback = new Date(now);
  todayCashback.setHours(14, 21, 0, 0);
  const yesterdayMom = new Date(now);
  yesterdayMom.setDate(yesterdayMom.getDate() - 1);
  yesterdayMom.setHours(18, 10, 0, 0);
  const yesterdayPiggy = new Date(now);
  yesterdayPiggy.setDate(yesterdayPiggy.getDate() - 1);
  yesterdayPiggy.setHours(12, 30, 0, 0);
  const yesterdayWater = new Date(now);
  yesterdayWater.setDate(yesterdayWater.getDate() - 1);
  yesterdayWater.setHours(10, 15, 0, 0);

  return [
    {
      id: 'tx-homework',
      typeId: 'taskReward',
      amount: 25,
      currency: 'STARS',
      taskId: 'homework',
      at: todayHomework.toISOString(),
    },
    {
      id: 'tx-sweet-shop',
      typeId: 'spend',
      amount: 180,
      merchantKey: 'sweetShop',
      at: todaySpend.toISOString(),
    },
    {
      id: 'tx-cashback',
      typeId: 'piggyCashback',
      amount: 8,
      at: todayCashback.toISOString(),
    },
    {
      id: 'tx-mom',
      typeId: 'piggyGiftMom',
      amount: 500,
      at: yesterdayMom.toISOString(),
    },
    {
      id: 'tx-to-piggy',
      typeId: 'cardToPiggy',
      amount: 200,
      at: yesterdayPiggy.toISOString(),
    },
    {
      id: 'tx-water',
      typeId: 'taskReward',
      amount: 10,
      currency: 'STARS',
      taskTemplateId: 'waterPlants',
      at: yesterdayWater.toISOString(),
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
    pet: createBaselinePet(),
    transactions: createTransactionsSeed().map((tx) => ({ ...tx })),
  };
}

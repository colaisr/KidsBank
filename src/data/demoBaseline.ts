import type { DemoGoal } from './goals';
import type { DemoTask } from './tasks';

export type TaskStatusId = 'open' | 'inProgress' | 'waitingParent' | 'done';

export type DemoTaskState = DemoTask & {
  statusId: TaskStatusId;
  /** Set when parent confirms `waitingParent` → `done` */
  completedAt?: string;
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

export type MapOffsetMeters = {
  east: number;
  north: number;
};

export type DemoTransaction = {
  id: string;
  typeId: TransactionTypeId;
  amount: number;
  at: string;
  currency?: TransactionCurrency;
  taskId?: string;
  taskTemplateId?: string;
  merchantKey?: string;
  transferRecipientId?: string;
  mapLat?: number;
  mapLng?: number;
  liveOffsetMeters?: MapOffsetMeters;
};

export type DemoChildProfile = {
  id: string;
  nameKey: string;
  age: number;
  initial: string;
};

export type DemoSavedPlace = {
  id: string;
  labelKey: string;
  lat: number;
  lng: number;
  liveOffsetMeters: MapOffsetMeters;
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

export type DemoTransferRecipientTone = 'primary' | 'warm' | 'sky';

export type DemoTransferRecipient = {
  id: string;
  nameKey?: string;
  customName?: string;
  initial: string;
  avatarTone: DemoTransferRecipientTone;
  dailyLimit: number | null;
  enabled: boolean;
};

export type DemoCashWithdrawal = {
  enabled: boolean;
  dailyLimit: number;
  maxDaily: number;
};

export type DemoState = {
  version: 7;
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
  children: DemoChildProfile[];
  activeChildId: string;
  locationUpdatedAt: string;
  fallbackChild: { lat: number; lng: number };
  savedPlaces: DemoSavedPlace[];
  transferRecipients: DemoTransferRecipient[];
  cashWithdrawal: DemoCashWithdrawal;
};

export const DEMO_STATE_VERSION = 7 as const;

export const CASH_WITHDRAWAL_MAX_DAILY = 3000;
export const CASH_WITHDRAWAL_STEP = 500;

/** Yerevan demo cluster — fallback when geolocation is unavailable */
const FALLBACK_CHILD = { lat: 40.1812, lng: 44.5146 };

function createBaselineSavedPlaces(): DemoSavedPlace[] {
  return [
    {
      id: 'school27',
      labelKey: 'demo.places.school27',
      lat: FALLBACK_CHILD.lat,
      lng: FALLBACK_CHILD.lng,
      liveOffsetMeters: { east: 0, north: 0 },
    },
    {
      id: 'home',
      labelKey: 'demo.places.home',
      lat: 40.1754,
      lng: 44.5082,
      liveOffsetMeters: { east: -180, north: -220 },
    },
    {
      id: 'grandma',
      labelKey: 'demo.places.grandma',
      lat: 40.1858,
      lng: 44.4965,
      liveOffsetMeters: { east: 260, north: 310 },
    },
  ];
}

function createBaselineChildren(): DemoChildProfile[] {
  return [
    {
      id: 'david',
      nameKey: 'demo.child.david.name',
      age: 7,
      initial: 'Д',
    },
  ];
}

function createBaselineTransferRecipients(): DemoTransferRecipient[] {
  return [
    {
      id: 'mom',
      nameKey: 'demo.limits.recipient.mom',
      initial: 'М',
      avatarTone: 'primary',
      dailyLimit: null,
      enabled: true,
    },
    {
      id: 'grandma',
      nameKey: 'demo.limits.recipient.grandma',
      initial: 'Б',
      avatarTone: 'warm',
      dailyLimit: 1000,
      enabled: true,
    },
    {
      id: 'friend',
      nameKey: 'demo.limits.recipient.friend',
      initial: 'Т',
      avatarTone: 'sky',
      dailyLimit: 500,
      enabled: true,
    },
  ];
}

function createBaselineCashWithdrawal(): DemoCashWithdrawal {
  return {
    enabled: true,
    dailyLimit: 1000,
    maxDaily: CASH_WITHDRAWAL_MAX_DAILY,
  };
}

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
      statusId: 'waitingParent',
    },
    {
      id: 'hangLaundry',
      templateId: 'hangLaundry',
      rewardStars: 10,
      dueTime: '16:00',
      statusId: 'waitingParent',
    },
    {
      id: 'tidyRoom',
      templateId: 'tidyRoom',
      rewardStars: 15,
      dueTime: '19:30',
      statusId: 'done',
      completedAt: '2026-01-01T12:00:00.000Z',
    },
    {
      id: 'dishes',
      templateId: 'dishes',
      rewardStars: 10,
      dueTime: '17:00',
      statusId: 'done',
      completedAt: '2025-12-31T12:00:00.000Z',
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
  children: createBaselineChildren(),
  activeChildId: 'david',
  locationUpdatedAt: new Date().toISOString(),
  fallbackChild: { ...FALLBACK_CHILD },
  savedPlaces: createBaselineSavedPlaces(),
  transferRecipients: createBaselineTransferRecipients(),
  cashWithdrawal: createBaselineCashWithdrawal(),
};

function createTransactionsSeed(): DemoTransaction[] {
  const now = new Date();
  const todayHomework = new Date(now);
  todayHomework.setHours(16, 45, 0, 0);
  const todayTidyRoom = new Date(now);
  todayTidyRoom.setHours(11, 30, 0, 0);
  const todaySpend = new Date(now);
  todaySpend.setHours(13, 45, 0, 0);
  const earlierCafe = new Date(now);
  earlierCafe.setMonth(earlierCafe.getMonth() - 1);
  earlierCafe.setHours(12, 5, 0, 0);
  const yesterdaySupermarket = new Date(now);
  yesterdaySupermarket.setDate(yesterdaySupermarket.getDate() - 1);
  yesterdaySupermarket.setHours(19, 10, 0, 0);
  const yesterdayArcade = new Date(now);
  yesterdayArcade.setDate(yesterdayArcade.getDate() - 1);
  yesterdayArcade.setHours(17, 32, 0, 0);
  const earlierBookstore = new Date(now);
  earlierBookstore.setDate(earlierBookstore.getDate() - 4);
  earlierBookstore.setHours(15, 0, 0, 0);
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
      id: 'tx-tidy-room',
      typeId: 'taskReward',
      amount: 15,
      currency: 'STARS',
      taskId: 'tidyRoom',
      at: todayTidyRoom.toISOString(),
    },
    {
      id: 'tx-sweet-shop',
      typeId: 'spend',
      amount: 180,
      merchantKey: 'sweetShop',
      at: todaySpend.toISOString(),
      mapLat: 40.1824,
      mapLng: 44.5112,
      liveOffsetMeters: { east: -160, north: 140 },
    },
    {
      id: 'tx-cafe',
      typeId: 'spend',
      amount: 320,
      merchantKey: 'cafe',
      at: earlierCafe.toISOString(),
      mapLat: 40.1788,
      mapLng: 44.5125,
      liveOffsetMeters: { east: 110, north: -90 },
    },
    {
      id: 'tx-supermarket',
      typeId: 'spend',
      amount: 260,
      merchantKey: 'supermarket',
      at: yesterdaySupermarket.toISOString(),
      mapLat: 40.1796,
      mapLng: 44.5098,
      liveOffsetMeters: { east: -240, north: -130 },
    },
    {
      id: 'tx-arcade',
      typeId: 'spend',
      amount: 100,
      merchantKey: 'arcade',
      at: yesterdayArcade.toISOString(),
      mapLat: 40.181,
      mapLng: 44.514,
      liveOffsetMeters: { east: 80, north: 60 },
    },
    {
      id: 'tx-bookstore',
      typeId: 'spend',
      amount: 800,
      merchantKey: 'bookstore',
      at: earlierBookstore.toISOString(),
      mapLat: 40.1832,
      mapLng: 44.5168,
      liveOffsetMeters: { east: 200, north: 210 },
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
    tasks: DEMO_BASELINE.tasks.map((task) => {
      const now = new Date();
      const todayNoon = new Date(now);
      todayNoon.setHours(12, 0, 0, 0);
      const yesterdayNoon = new Date(todayNoon);
      yesterdayNoon.setDate(yesterdayNoon.getDate() - 1);

      if (task.id === 'tidyRoom' && task.statusId === 'done') {
        return { ...task, completedAt: todayNoon.toISOString() };
      }
      if (task.id === 'dishes' && task.statusId === 'done') {
        return { ...task, completedAt: yesterdayNoon.toISOString() };
      }
      return { ...task };
    }),
    goals: DEMO_BASELINE.goals.map((goal) => ({ ...goal })),
    pet: createBaselinePet(),
    transactions: createTransactionsSeed().map((tx) => ({ ...tx })),
    children: DEMO_BASELINE.children.map((child) => ({ ...child })),
    activeChildId: DEMO_BASELINE.activeChildId,
    locationUpdatedAt: new Date().toISOString(),
    fallbackChild: { ...DEMO_BASELINE.fallbackChild },
    savedPlaces: DEMO_BASELINE.savedPlaces.map((place) => ({
      ...place,
      liveOffsetMeters: { ...place.liveOffsetMeters },
    })),
    transferRecipients: DEMO_BASELINE.transferRecipients.map((recipient) => ({ ...recipient })),
    cashWithdrawal: { ...DEMO_BASELINE.cashWithdrawal },
  };
}

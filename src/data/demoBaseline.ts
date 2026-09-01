import type { DemoGoal, GoalIconId } from './goals';
import type { DemoTask } from './tasks';

export type TaskStatusId = 'open' | 'inProgress' | 'waitingParent' | 'done';

export type DemoTaskState = DemoTask & {
  statusId: TaskStatusId;
};

export type DemoGoalState = DemoGoal;

export type DemoState = {
  version: 1;
  card: {
    last4: string;
    balance: number;
  };
  piggy: {
    balance: number;
  };
  starsBalance: number;
  tasks: DemoTaskState[];
  goals: DemoGoalState[];
};

export const DEMO_STATE_VERSION = 1 as const;

export const DEMO_BASELINE: DemoState = {
  version: DEMO_STATE_VERSION,
  card: {
    last4: '1234',
    balance: 2567.48,
  },
  piggy: {
    balance: 6780,
  },
  starsBalance: 860,
  tasks: [
    { id: 'homework', rewardStars: 25, statusId: 'open' },
    { id: 'walkDog', rewardStars: 15, statusId: 'inProgress' },
    { id: 'tidyRoom', rewardStars: 20, statusId: 'waitingParent' },
  ],
  goals: [
    { id: 'ps5', iconId: 'gamepad' as GoalIconId, currentStars: 600, targetStars: 1500 },
    { id: 'bike', iconId: 'bike' as GoalIconId, currentStars: 370, targetStars: 1000 },
  ],
};

export function cloneDemoBaseline(): DemoState {
  return {
    ...DEMO_BASELINE,
    card: { ...DEMO_BASELINE.card },
    piggy: { ...DEMO_BASELINE.piggy },
    tasks: DEMO_BASELINE.tasks.map((task) => ({ ...task })),
    goals: DEMO_BASELINE.goals.map((goal) => ({ ...goal })),
  };
}

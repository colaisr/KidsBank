import type { ActivityIconId } from './activityIcons';

export type GoalIconId = ActivityIconId;

export type DemoGoal = {
  id: string;
  iconId: ActivityIconId;
  currentStars: number;
  targetStars: number;
};

export const demoGoals: readonly DemoGoal[] = [
  { id: 'bike', iconId: 'gift', currentStars: 650, targetStars: 800 },
  { id: 'ps5', iconId: 'gamepad', currentStars: 150, targetStars: 1500 },
];

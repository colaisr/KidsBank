export type GoalIconId = 'gamepad' | 'bike' | 'headphones';

export type DemoGoal = {
  id: string;
  iconId: GoalIconId;
  currentStars: number;
  targetStars: number;
};

export const demoGoals: readonly DemoGoal[] = [
  { id: 'ps5', iconId: 'gamepad', currentStars: 600, targetStars: 1500 },
  { id: 'bike', iconId: 'bike', currentStars: 370, targetStars: 1000 },
];

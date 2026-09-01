export type GoalIconId = 'gamepad' | 'bike' | 'headphones';

export type DemoGoal = {
  id: string;
  iconId: GoalIconId;
  currentStars: number;
  targetStars: number;
};

export const demoGoals: readonly DemoGoal[] = [
  { id: 'bike', iconId: 'bike', currentStars: 650, targetStars: 800 },
  { id: 'ps5', iconId: 'gamepad', currentStars: 150, targetStars: 1500 },
];

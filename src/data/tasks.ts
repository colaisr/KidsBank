export type DemoTask = {
  id: string;
  rewardStars: number;
};

export const demoTasks: readonly DemoTask[] = [
  { id: 'homework', rewardStars: 25 },
  { id: 'walkDog', rewardStars: 15 },
  { id: 'tidyRoom', rewardStars: 20 },
];

export type DemoTask = {
  id: string;
  templateId: string;
  rewardStars: number;
  dueTime: string;
  customTitle?: string;
};

export const demoTasks: readonly DemoTask[] = [
  { id: 'homework', templateId: 'homework', rewardStars: 25, dueTime: '18:00' },
  { id: 'walkDog', templateId: 'walkDog', rewardStars: 15, dueTime: '20:00' },
  { id: 'hangLaundry', templateId: 'hangLaundry', rewardStars: 10, dueTime: '16:00' },
  { id: 'tidyRoom', templateId: 'tidyRoom', rewardStars: 15, dueTime: '19:30' },
  { id: 'dishes', templateId: 'dishes', rewardStars: 10, dueTime: '17:00' },
];

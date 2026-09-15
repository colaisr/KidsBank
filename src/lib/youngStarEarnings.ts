import type { DemoState, DemoTaskState, DemoTransaction } from '../data/demoBaseline';

export type YoungStarEarningKind = 'task' | 'pet' | 'lesson';

export type YoungStarEarning = {
  id: string;
  kind: YoungStarEarningKind;
  at: string;
  amount: number;
  taskId?: string;
  taskTemplateId?: string;
  titleKey?: string;
};

type DemoExtra = {
  id: string;
  kind: Exclude<YoungStarEarningKind, 'task'>;
  daysAgo: number;
  amount: number;
  titleKey: string;
};

const DEMO_YOUNG_STAR_EXTRAS: DemoExtra[] = [
  {
    id: 'young-star-pet-leo',
    kind: 'pet',
    daysAgo: 1,
    amount: 8,
    titleKey: 'demo.youngStars.petLeo',
  },
  {
    id: 'young-star-lesson',
    kind: 'lesson',
    daysAgo: 2,
    amount: 5,
    titleKey: 'demo.youngStars.lessonPiggyGoals',
  },
];

function isoDaysAgo(daysAgo: number, hour = 12, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function extrasToEarnings(): YoungStarEarning[] {
  return DEMO_YOUNG_STAR_EXTRAS.map((extra) => ({
    id: extra.id,
    kind: extra.kind,
    at: isoDaysAgo(extra.daysAgo, extra.kind === 'pet' ? 16 : 11, 20),
    amount: extra.amount,
    titleKey: extra.titleKey,
  }));
}

function taskRewardToEarning(tx: DemoTransaction): YoungStarEarning {
  return {
    id: tx.id,
    kind: 'task',
    at: tx.at,
    amount: tx.amount,
    taskId: tx.taskId,
    taskTemplateId: tx.taskTemplateId,
  };
}

export function getYoungStarEarnings(demo: DemoState): YoungStarEarning[] {
  const fromTasks = demo.transactions
    .filter((tx) => tx.typeId === 'taskReward' && (tx.currency ?? 'STARS') === 'STARS')
    .map(taskRewardToEarning);

  const merged = [...fromTasks, ...extrasToEarnings()];
  const seen = new Set<string>();
  const unique = merged.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });

  return unique.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function youngStarEarningTitle(
  earning: YoungStarEarning,
  tasks: DemoTaskState[],
  t: (key: string, options?: Record<string, string>) => string,
): string {
  if (earning.titleKey) {
    return t(earning.titleKey);
  }

  const task = earning.taskId ? tasks.find((item) => item.id === earning.taskId) : undefined;
  const templateId = task?.templateId ?? earning.taskTemplateId;
  const customTitle = task?.customTitle;
  const taskTitle =
    customTitle ??
    (templateId ? t(`demo.tasks.${templateId}.title`) : t('demo.transactions.taskReward'));

  return t('ui.childYoung.stars.taskLabel', { task: taskTitle });
}

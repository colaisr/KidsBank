import type { DemoTaskState } from '../data/demoBaseline';
import { CUSTOM_TASK_TEMPLATE_ID } from '../data/taskTemplates';
import type { TFunction } from 'i18next';

export function getTaskTitle(task: DemoTaskState, t: TFunction): string {
  if (task.templateId === CUSTOM_TASK_TEMPLATE_ID && task.customTitle) {
    return task.customTitle;
  }

  return t(`demo.tasks.${task.templateId}.title`);
}

export function sortTasksForDisplay(tasks: DemoTaskState[]): DemoTaskState[] {
  const active = tasks.filter((task) => task.statusId !== 'done');
  const done = tasks.filter((task) => task.statusId === 'done');
  return [...active, ...done];
}

export function isActiveTaskTemplate(tasks: DemoTaskState[], templateId: string): boolean {
  if (templateId === CUSTOM_TASK_TEMPLATE_ID) {
    return false;
  }

  return tasks.some(
    (task) =>
      task.templateId === templateId &&
      task.statusId !== 'done',
  );
}

export function getActiveTasks(tasks: DemoTaskState[]): DemoTaskState[] {
  return tasks.filter((task) => task.statusId !== 'done');
}

export function getActiveTasksForParent(tasks: DemoTaskState[]): DemoTaskState[] {
  const active = getActiveTasks(tasks);
  const waiting = active.filter((task) => task.statusId === 'waitingParent');
  const others = active.filter((task) => task.statusId !== 'waitingParent');
  return [...waiting, ...others];
}

export function countTasksWaitingParent(tasks: DemoTaskState[]): number {
  return tasks.filter((task) => task.statusId === 'waitingParent').length;
}

export function getParentPendingTasks(tasks: DemoTaskState[]): DemoTaskState[] {
  return getActiveTasksForParent(tasks);
}

function isSameLocalDay(iso: string, reference: Date): boolean {
  const date = new Date(iso);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export function getTasksCompletedToday(
  tasks: DemoTaskState[],
  reference = new Date(),
): DemoTaskState[] {
  return tasks.filter(
    (task) =>
      task.statusId === 'done' &&
      task.completedAt !== undefined &&
      isSameLocalDay(task.completedAt, reference),
  );
}

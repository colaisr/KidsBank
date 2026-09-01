import type { DemoGoalState } from '../data/demoBaseline';
import { CUSTOM_GOAL_TEMPLATE_ID } from '../data/goalTemplates';
import type { TFunction } from 'i18next';

export function getGoalTitle(goal: DemoGoalState, t: TFunction): string {
  if (goal.templateId === CUSTOM_GOAL_TEMPLATE_ID && goal.customTitle) {
    return goal.customTitle;
  }

  return t(`demo.goals.${goal.templateId}.title`);
}

/** All non-redeemed goals (selected + vitrine) — parent overview */
export function getActiveGoals(goals: DemoGoalState[]): DemoGoalState[] {
  return goals.filter((goal) => !goal.redeemed);
}

/** Goals the child chose to pursue — home + «Мои цели» */
export function getSelectedGoals(goals: DemoGoalState[]): DemoGoalState[] {
  return goals.filter((goal) => goal.selected && !goal.redeemed);
}

/** Parent-added / available goals not yet chosen by child */
export function getVitrineGoals(goals: DemoGoalState[]): DemoGoalState[] {
  return goals.filter((goal) => !goal.selected && !goal.redeemed);
}

export function isGoalTemplateInUse(goals: DemoGoalState[], templateId: string): boolean {
  if (templateId === CUSTOM_GOAL_TEMPLATE_ID) {
    return false;
  }

  return goals.some((goal) => goal.templateId === templateId && !goal.redeemed);
}

/** @deprecated use isGoalTemplateInUse */
export function isActiveGoalTemplate(goals: DemoGoalState[], templateId: string): boolean {
  return isGoalTemplateInUse(goals, templateId);
}

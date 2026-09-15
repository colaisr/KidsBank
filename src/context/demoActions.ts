import type { DemoState, DemoTransaction, TransactionTypeId } from '../data/demoBaseline';
import type { ActivityIconId } from '../data/activityIcons';
import { CUSTOM_GOAL_TEMPLATE_ID } from '../data/goalTemplates';
import { isGoalTemplateInUse } from '../lib/goals';
import {
  PET_ACTION_COSTS,
  applyPetNeedEffects,
  type PetActionId,
} from '../lib/pet';
import { isActiveTaskTemplate } from '../lib/tasks';

function txId(): string {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type TransactionMeta = Pick<
  DemoTransaction,
  'currency' | 'taskId' | 'taskTemplateId' | 'merchantKey'
>;

function appendTransaction(
  state: DemoState,
  typeId: TransactionTypeId,
  amount: number,
  meta?: TransactionMeta,
): DemoState {
  const entry: DemoTransaction = {
    id: txId(),
    typeId,
    amount,
    at: new Date().toISOString(),
    ...meta,
  };
  return {
    ...state,
    transactions: [entry, ...state.transactions],
  };
}

export function acceptTask(state: DemoState, taskId: string): DemoState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId && task.statusId === 'open'
        ? { ...task, statusId: 'inProgress' }
        : task,
    ),
  };
}

export function completeTask(state: DemoState, taskId: string): DemoState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId && task.statusId === 'inProgress'
        ? { ...task, statusId: 'waitingParent' }
        : task,
    ),
  };
}

export function confirmTask(state: DemoState, taskId: string): DemoState {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.statusId !== 'waitingParent') {
    return state;
  }

  const updated: DemoState = {
    ...state,
    starsBalance: state.starsBalance + task.rewardStars,
    taskStats: {
      starsEarned: state.taskStats.starsEarned + task.rewardStars,
      tasksCompleted: state.taskStats.tasksCompleted + 1,
    },
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? { ...t, statusId: 'done' as const, completedAt: new Date().toISOString() }
        : t,
    ),
    pet: {
      ...state.pet,
      taskBuff: true,
    },
  };

  return appendTransaction(updated, 'taskReward', task.rewardStars, {
    currency: 'STARS',
    taskId: task.id,
  });
}

export function submitTaskForParent(state: DemoState, taskId: string): DemoState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId &&
      (task.statusId === 'open' || task.statusId === 'inProgress')
        ? { ...task, statusId: 'waitingParent' }
        : task,
    ),
  };
}

export type AddTaskInput = {
  templateId: string;
  rewardStars: number;
  dueTime: string;
  customTitle?: string;
};

export function addTask(
  state: DemoState,
  input: AddTaskInput,
): DemoState | 'duplicate' | 'emptyTitle' {
  if (input.templateId === 'other') {
    const customTitle = input.customTitle?.trim();
    if (!customTitle) {
      return 'emptyTitle';
    }
  } else if (isActiveTaskTemplate(state.tasks, input.templateId)) {
    return 'duplicate';
  }

  const customTitle =
    input.templateId === 'other' ? input.customTitle?.trim() : undefined;

  const task = {
    id:
      input.templateId === 'other'
        ? `custom-${Date.now()}`
        : `${input.templateId}-${Date.now()}`,
    templateId: input.templateId,
    rewardStars: input.rewardStars,
    dueTime: input.dueTime,
    ...(customTitle ? { customTitle } : {}),
    statusId: 'open' as const,
  };

  return {
    ...state,
    tasks: [task, ...state.tasks],
  };
}

export type UpdateTaskInput = {
  rewardStars: number;
  dueTime: string;
};

export function updateTask(
  state: DemoState,
  taskId: string,
  patch: UpdateTaskInput,
): DemoState | 'notEditable' {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.statusId === 'done') {
    return 'notEditable';
  }

  return {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, ...patch } : t,
    ),
  };
}

export type AddGoalInput = {
  templateId: string;
  customTitle?: string;
  iconId: ActivityIconId;
  targetStars: number;
  amdValue: number;
};

export function addGoal(
  state: DemoState,
  input: AddGoalInput,
): DemoState | 'duplicate' | 'emptyTitle' {
  if (input.templateId === CUSTOM_GOAL_TEMPLATE_ID) {
    const customTitle = input.customTitle?.trim();
    if (!customTitle) {
      return 'emptyTitle';
    }
  } else if (isGoalTemplateInUse(state.goals, input.templateId)) {
    return 'duplicate';
  }

  const customTitle =
    input.templateId === CUSTOM_GOAL_TEMPLATE_ID ? input.customTitle?.trim() : undefined;

  const goal = {
    id:
      input.templateId === CUSTOM_GOAL_TEMPLATE_ID
        ? `custom-${Date.now()}`
        : `${input.templateId}-${Date.now()}`,
    templateId: input.templateId,
    iconId: input.iconId,
    currentStars: 0,
    targetStars: input.targetStars,
    amdValue: input.amdValue,
    redeemed: false,
    selected: false,
    ...(customTitle ? { customTitle } : {}),
  };

  return {
    ...state,
    goals: [goal, ...state.goals],
  };
}

export function selectGoal(state: DemoState, goalId: string): DemoState {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || goal.redeemed || goal.selected) {
    return state;
  }

  return {
    ...state,
    goals: state.goals.map((g) => (g.id === goalId ? { ...g, selected: true } : g)),
  };
}

export function deselectGoal(state: DemoState, goalId: string): DemoState {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || !goal.selected || goal.redeemed) {
    return state;
  }

  return {
    ...state,
    starsBalance: state.starsBalance + goal.currentStars,
    goals: state.goals.map((g) =>
      g.id === goalId ? { ...g, selected: false, currentStars: 0 } : g,
    ),
  };
}

export function cancelTask(state: DemoState, taskId: string): DemoState {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.statusId === 'done') {
    return state;
  }

  return {
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
  };
}

export function allocateStarsToGoal(
  state: DemoState,
  goalId: string,
  amount: number,
): DemoState {
  if (amount <= 0 || amount > state.starsBalance) {
    return state;
  }

  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || goal.redeemed || !goal.selected) {
    return state;
  }

  const room = goal.targetStars - goal.currentStars;
  const transfer = Math.min(amount, room, state.starsBalance);
  if (transfer <= 0) {
    return state;
  }

  return {
    ...state,
    starsBalance: state.starsBalance - transfer,
    goals: state.goals.map((g) =>
      g.id === goalId ? { ...g, currentStars: g.currentStars + transfer } : g,
    ),
  };
}

export function redeemGoal(state: DemoState, goalId: string): DemoState {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || goal.redeemed || !goal.selected || goal.currentStars < goal.targetStars) {
    return state;
  }

  const next = appendTransaction(state, 'goalRedeem', goal.amdValue);
  return {
    ...next,
    card: { ...next.card, balance: next.card.balance + goal.amdValue },
    goals: next.goals.map((g) =>
      g.id === goalId ? { ...g, redeemed: true } : g,
    ),
  };
}

export type TransferTarget = 'card' | 'piggy';

export function transferParentToChild(
  state: DemoState,
  amount: number,
  target: TransferTarget,
): DemoState {
  if (amount <= 0 || amount > state.parentWallet) {
    return state;
  }

  const typeId: TransactionTypeId = target === 'card' ? 'parentToCard' : 'parentToPiggy';
  const next = appendTransaction(state, typeId, amount);

  if (target === 'card') {
    return {
      ...next,
      parentWallet: next.parentWallet - amount,
      card: { ...next.card, balance: next.card.balance + amount },
    };
  }

  return {
    ...next,
    parentWallet: next.parentWallet - amount,
    piggy: { ...next.piggy, balance: next.piggy.balance + amount },
  };
}

export function transferChildToParent(state: DemoState, amount: number): DemoState {
  if (amount <= 0 || amount > state.card.balance) {
    return state;
  }

  const next = appendTransaction(state, 'childToParent', amount);
  return {
    ...next,
    card: { ...next.card, balance: next.card.balance - amount },
    parentWallet: next.parentWallet + amount,
  };
}

export function transferCardToPiggy(state: DemoState, amount: number): DemoState {
  if (amount <= 0 || amount > state.card.balance) {
    return state;
  }

  const next = appendTransaction(state, 'cardToPiggy', amount);
  return {
    ...next,
    card: { ...next.card, balance: next.card.balance - amount },
    piggy: { ...next.piggy, balance: next.piggy.balance + amount },
  };
}

export function transferPiggyToCard(state: DemoState, amount: number): DemoState {
  if (amount <= 0 || amount > state.piggy.balance) {
    return state;
  }

  const next = appendTransaction(state, 'piggyToCard', amount);
  return {
    ...next,
    piggy: { ...next.piggy, balance: next.piggy.balance - amount },
    card: { ...next.card, balance: next.card.balance + amount },
  };
}

export function setCardLimit(state: DemoState, limit: number): DemoState {
  if (limit <= 0) {
    return state;
  }
  return { ...state, cardLimit: limit };
}

export function clearCardLimit(state: DemoState): DemoState {
  return { ...state, cardLimit: null };
}

export function setTransferRecipientEnabled(
  state: DemoState,
  recipientId: string,
  enabled: boolean,
): DemoState {
  return {
    ...state,
    transferRecipients: state.transferRecipients.map((recipient) =>
      recipient.id === recipientId ? { ...recipient, enabled } : recipient,
    ),
  };
}

export function addTransferRecipient(
  state: DemoState,
  params: { customName: string; dailyLimit: number | null },
): DemoState {
  const trimmed = params.customName.trim();
  if (!trimmed) {
    return state;
  }

  const initial = trimmed.charAt(0).toUpperCase();
  const id = `custom-${Date.now()}`;

  return {
    ...state,
    transferRecipients: [
      ...state.transferRecipients,
      {
        id,
        customName: trimmed,
        initial,
        avatarTone: 'sky',
        dailyLimit: params.dailyLimit,
        enabled: true,
      },
    ],
  };
}

export function setCashWithdrawalEnabled(state: DemoState, enabled: boolean): DemoState {
  return {
    ...state,
    cashWithdrawal: { ...state.cashWithdrawal, enabled },
  };
}

export function setCashWithdrawalDailyLimit(state: DemoState, dailyLimit: number): DemoState {
  const max = state.cashWithdrawal.maxDaily;
  const clamped = Math.min(max, Math.max(0, dailyLimit));
  return {
    ...state,
    cashWithdrawal: { ...state.cashWithdrawal, dailyLimit: clamped },
  };
}

export function demoSpend(
  state: DemoState,
  amount: number,
  merchantKey = 'cafe',
): DemoState | 'limit' | 'insufficient' {
  if (amount <= 0 || amount > state.card.balance) {
    return amount > state.card.balance ? 'insufficient' : state;
  }

  if (state.cardLimit !== null && amount > state.cardLimit) {
    return 'limit';
  }

  const next = appendTransaction(state, 'spend', amount, { merchantKey });
  return {
    ...next,
    card: { ...next.card, balance: next.card.balance - amount },
  };
}

export function demoPhoneTopUp(
  state: DemoState,
  amount: number,
): DemoState | 'limit' | 'insufficient' {
  return demoSpend(state, amount, 'mobileTopUp');
}

export function applyPetAction(
  state: DemoState,
  action: PetActionId,
): DemoState | 'insufficient' {
  const cost = state.pet.taskBuff ? 0 : PET_ACTION_COSTS[action];
  if (!state.pet.taskBuff && state.starsBalance < cost) {
    return 'insufficient';
  }

  return {
    ...state,
    starsBalance: state.starsBalance - cost,
    pet: applyPetNeedEffects(state.pet, action),
  };
}

import type { DemoState, DemoTransaction, TransactionTypeId } from '../data/demoBaseline';

function txId(): string {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function appendTransaction(
  state: DemoState,
  typeId: TransactionTypeId,
  amount: number,
): DemoState {
  const entry: DemoTransaction = {
    id: txId(),
    typeId,
    amount,
    at: new Date().toISOString(),
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

  return {
    ...state,
    starsBalance: state.starsBalance + task.rewardStars,
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, statusId: 'done' } : t,
    ),
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
  if (!goal || goal.redeemed) {
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
  if (!goal || goal.redeemed || goal.currentStars < goal.targetStars) {
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

export function demoSpend(state: DemoState, amount: number): DemoState | 'limit' {
  if (amount <= 0 || amount > state.card.balance) {
    return state;
  }

  if (state.cardLimit !== null && amount > state.cardLimit) {
    return 'limit';
  }

  const next = appendTransaction(state, 'spend', amount);
  return {
    ...next,
    card: { ...next.card, balance: next.card.balance - amount },
  };
}

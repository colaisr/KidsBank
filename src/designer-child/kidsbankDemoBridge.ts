import i18n from '../i18n';
import type { DemoState, DemoTaskState } from '../data/demoBaseline';
import { readDemoState, writeDemoState } from '../context/demoState';
import type { Entry, Recipient, RewardGoal } from './DemoState';
import { home } from './data';

export const KIDS_BANK_DEMO_EVENT = 'kidsbank-demo-updated';

type HandoffTask = {
  id: string;
  title: string;
  reward: number;
  deadline: string;
  status: 'open' | 'waitingParent';
};

function taskTitle(task: DemoTaskState): string {
  const key = `demo.tasks.${task.templateId}.title`;
  const translated = i18n.t(key);
  return translated === key ? task.templateId : translated;
}

function mapTasks(demo: DemoState): HandoffTask[] {
  return demo.tasks
    .filter((task) => task.statusId !== 'done')
    .map((task) => ({
      id: task.id,
      title: taskTitle(task),
      reward: task.rewardStars,
      deadline: task.dueTime,
      status: task.statusId === 'waitingParent' ? 'waitingParent' : 'open',
    }));
}

const RECIPIENT_ID_TO_HANDOFF: Record<string, string> = {
  mom: 'mama',
  grandma: 'grandmother',
  friend: 'timur',
};

const RECIPIENT_ID_FROM_HANDOFF: Record<string, string> = {
  mama: 'mom',
  grandmother: 'grandma',
  timur: 'friend',
};

function mapRecipients(demo: DemoState): Recipient[] {
  const avatarById: Record<string, string> = {
    mom: '/assets/recipients/mama.png',
    grandma: '/assets/recipients/grandmother.png',
    friend: '/assets/recipients/timur.png',
  };
  return demo.transferRecipients.map((recipient) => ({
    id: RECIPIENT_ID_TO_HANDOFF[recipient.id] ?? recipient.id,
    name: i18n.t(recipient.nameKey as 'demo.limits.recipient.mom'),
    enabled: recipient.enabled,
    limit: recipient.dailyLimit,
    avatar: avatarById[recipient.id],
  }));
}

function mapRewardGoals(demo: DemoState): RewardGoal[] {
  return demo.goals.map((goal) => ({
    id: goal.id,
    title: i18n.t(`demo.goals.${goal.templateId}.title` as 'demo.goals.ps5.title'),
    target: goal.targetStars,
    saved: goal.currentStars,
    exchange: goal.amdValue,
    icon: goal.iconId,
    selected: goal.selected,
    redeemed: goal.redeemed,
  }));
}

export function kidsBankSnapshotForDesigner(): Partial<{
  balance: number;
  savings: number;
  stars: number;
  parentWallet: number;
  tasks: HandoffTask[];
  recipients: Recipient[];
  rewardGoals: RewardGoal[];
  cashEnabled: boolean;
  cashLimit: number;
}> {
  const demo = readDemoState();
  return {
    balance: demo.card.balance,
    savings: demo.piggy.balance,
    stars: demo.starsBalance,
    parentWallet: demo.parentWallet,
    tasks: mapTasks(demo),
    recipients: mapRecipients(demo),
    rewardGoals: mapRewardGoals(demo),
    cashEnabled: demo.cashWithdrawal.enabled,
    cashLimit: demo.cashWithdrawal.dailyLimit,
  };
}

function findDemoTask(demo: DemoState, handoffId: string): DemoTaskState | undefined {
  return demo.tasks.find((task) => task.id === handoffId);
}

export function applyDesignerPatchToKidsBank(patch: {
  balance?: number;
  savings?: number;
  stars?: number;
  parentWallet?: number;
  tasks?: HandoffTask[];
  entries?: Entry[];
  recipients?: Recipient[];
  rewardGoals?: RewardGoal[];
  cashEnabled?: boolean;
  cashLimit?: number;
}): void {
  const demo = readDemoState();
  let next: DemoState = {
    ...demo,
    card: { ...demo.card, balance: patch.balance ?? demo.card.balance },
    piggy: { ...demo.piggy, balance: patch.savings ?? demo.piggy.balance },
    starsBalance: patch.stars ?? demo.starsBalance,
    parentWallet: patch.parentWallet ?? demo.parentWallet,
  };

  if (patch.cashEnabled !== undefined || patch.cashLimit !== undefined) {
    next = {
      ...next,
      cashWithdrawal: {
        ...next.cashWithdrawal,
        enabled: patch.cashEnabled ?? next.cashWithdrawal.enabled,
        dailyLimit: patch.cashLimit ?? next.cashWithdrawal.dailyLimit,
      },
    };
  }

  if (patch.tasks) {
    const byId = new Map(patch.tasks.map((task) => [task.id, task]));
    next = {
      ...next,
      tasks: next.tasks.map((task) => {
        const handoff = byId.get(task.id);
        if (!handoff) {
          return task.statusId === 'done' ? task : { ...task, statusId: 'done' };
        }
        return {
          ...task,
          rewardStars: handoff.reward,
          dueTime: handoff.deadline,
          statusId: handoff.status === 'waitingParent' ? 'waitingParent' : 'open',
        };
      }),
    };
    for (const handoff of patch.tasks) {
      if (!findDemoTask(next, handoff.id)) {
        next.tasks.push({
          id: handoff.id,
          templateId: handoff.id,
          rewardStars: handoff.reward,
          dueTime: handoff.deadline,
          statusId: handoff.status === 'waitingParent' ? 'waitingParent' : 'open',
        });
      }
    }
  }

  if (patch.rewardGoals) {
    const byId = new Map(patch.rewardGoals.map((goal) => [goal.id, goal]));
    next = {
      ...next,
      goals: next.goals.map((goal) => {
        const handoff = byId.get(goal.id);
        if (!handoff) {
          return goal;
        }
        return {
          ...goal,
          currentStars: handoff.saved,
          targetStars: handoff.target,
          selected: handoff.selected,
          redeemed: handoff.redeemed ?? goal.redeemed,
        };
      }),
    };
  }

  if (patch.recipients) {
    const byId = new Map(
      patch.recipients.map((recipient) => [
        RECIPIENT_ID_FROM_HANDOFF[recipient.id] ?? recipient.id,
        recipient,
      ]),
    );
    next = {
      ...next,
      transferRecipients: next.transferRecipients.map((recipient) => {
        const handoff = byId.get(recipient.id);
        if (!handoff) {
          return recipient;
        }
        return {
          ...recipient,
          enabled: handoff.enabled,
          dailyLimit: handoff.limit ?? recipient.dailyLimit,
        };
      }),
    };
  }

  writeDemoState(next);
}

export function mergeKidsBankIntoHandoffStorage(): void {
  const snapshot = kidsBankSnapshotForDesigner();
  try {
    const current = JSON.parse(localStorage.getItem('evoca-demo-v2') || 'null');
    const base = current && typeof current === 'object' ? current : {};
    const merged = {
      ...base,
      balance: snapshot.balance ?? base.balance ?? home.balance,
      savings: snapshot.savings ?? base.savings ?? 0,
      stars: snapshot.stars ?? base.stars ?? home.stars,
      parentWallet: snapshot.parentWallet ?? base.parentWallet ?? 50000,
      tasks: snapshot.tasks ?? base.tasks ?? home.tasks,
      recipients: snapshot.recipients ?? base.recipients,
      rewardGoals: snapshot.rewardGoals ?? base.rewardGoals,
      cashEnabled: snapshot.cashEnabled ?? base.cashEnabled ?? true,
      cashLimit: snapshot.cashLimit ?? base.cashLimit ?? 1000,
    };
    localStorage.setItem('evoca-demo-v2', JSON.stringify(merged));
  } catch {
    // ignore
  }
}

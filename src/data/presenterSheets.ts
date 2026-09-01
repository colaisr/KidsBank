export const PRESENTER_SHEET_IDS = [
  'child-home',
  'child-accounts',
  'child-tasks',
  'child-goals',
  'child-piggy',
  'child-card-design',
  'child-transactions',
  'child-pet',
  'child-hub',
  'parent-home',
  'appearance',
  'onboarding-age',
] as const;

export type PresenterSheetId = (typeof PRESENTER_SHEET_IDS)[number];

export type PresenterSheetConfig = {
  childRows: readonly string[];
  bankRows: readonly string[];
  demoSteps: readonly string[];
};

export const PRESENTER_SHEET_CONFIG: Record<PresenterSheetId, PresenterSheetConfig> = {
  'child-home': {
    childRows: ['habit', 'literacy', 'agency'],
    bankRows: ['retention', 'ltv', 'family'],
    demoSteps: ['step1', 'step2', 'step3', 'step4', 'step5'],
  },
  'child-accounts': {
    childRows: ['threeWallets', 'roles'],
    bankRows: ['crossSell', 'engagement'],
    demoSteps: ['step1', 'step2'],
  },
  'child-tasks': {
    childRows: ['contract', 'reward', 'habit'],
    bankRows: ['family', 'engagement', 'noPayout'],
    demoSteps: ['step1', 'step2', 'step3'],
  },
  'child-goals': {
    childRows: ['dream', 'delay', 'exchange', 'choice'],
    bankRows: ['savings', 'amdLink', 'motivation', 'catalog'],
    demoSteps: ['step1', 'step2', 'step3', 'step4'],
  },
  'child-piggy': {
    childRows: ['separate', 'share', 'grow'],
    bankRows: ['viral', 'familyMoney', 'deposits'],
    demoSteps: ['step1', 'step2', 'step3'],
  },
  'child-card-design': {
    childRows: ['identity', 'fun'],
    bankRows: ['personalization', 'oneCodebase'],
    demoSteps: ['step1', 'step2'],
  },
  'child-transactions': {
    childRows: ['awareness', 'history', 'dualCurrency', 'earnedVsSpent'],
    bankRows: ['literacy', 'parentMirror', 'unifiedFeed'],
    demoSteps: ['step1', 'step2', 'step3', 'step4'],
  },
  'child-pet': {
    childRows: ['regularity', 'earnSpend', 'choice', 'responsibility'],
    bankRows: ['retention', 'ltv', 'differentiation', 'family'],
    demoSteps: ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'],
  },
  'child-hub': {
    childRows: ['spend', 'limit', 'transfer'],
    bankRows: ['realSpend', 'control', 'demo'],
    demoSteps: ['step1', 'step2', 'step3'],
  },
  'parent-home': {
    childRows: ['rules', 'support'],
    bankRows: ['control', 'familyProduct', 'trust'],
    demoSteps: ['step1', 'step2', 'step3', 'step4', 'step5'],
  },
  appearance: {
    childRows: ['meta'],
    bankRows: ['whiteLabel', 'locales', 'reset'],
    demoSteps: ['step1', 'step2', 'step3'],
  },
  'onboarding-age': {
    childRows: ['tasks', 'style', 'limits'],
    bankRows: ['segmentation', 'retention', 'oneProduct'],
    demoSteps: ['step1', 'step2', 'step3', 'step4'],
  },
};

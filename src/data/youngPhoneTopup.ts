export const YOUNG_PHONE_TOPUP_AMOUNTS = [500, 1000, 2000] as const;

export type YoungPhoneTopupAmount = (typeof YOUNG_PHONE_TOPUP_AMOUNTS)[number];

export const DEFAULT_YOUNG_PHONE_TOPUP_AMOUNT: YoungPhoneTopupAmount = 1000;

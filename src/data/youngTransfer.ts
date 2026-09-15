export const YOUNG_TRANSFER_AMOUNTS = [100, 300, 500] as const;

export type YoungTransferAmount = (typeof YOUNG_TRANSFER_AMOUNTS)[number];

export const DEFAULT_YOUNG_TRANSFER_AMOUNT: YoungTransferAmount = 300;

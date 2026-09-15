export type ReportPeriod = 'week' | 'month';

export type ReportCategoryId = 'food' | 'transport' | 'piggy' | 'other';

export type ReportSlice = {
  id: ReportCategoryId;
  amount: number;
  percent: number;
  color: string;
};

const WEEK_SLICES: ReportSlice[] = [
  { id: 'food', amount: 320, percent: 40, color: '#7dd3fc' },
  { id: 'transport', amount: 180, percent: 22, color: '#fdba74' },
  { id: 'piggy', amount: 250, percent: 31, color: '#05a9c7' },
  { id: 'other', amount: 60, percent: 7, color: '#f97316' },
];

const MONTH_SLICES: ReportSlice[] = [
  { id: 'food', amount: 1240, percent: 38, color: '#7dd3fc' },
  { id: 'transport', amount: 720, percent: 22, color: '#fdba74' },
  { id: 'piggy', amount: 980, percent: 30, color: '#05a9c7' },
  { id: 'other', amount: 320, percent: 10, color: '#f97316' },
];

export function getSpendingReport(period: ReportPeriod): {
  slices: ReportSlice[];
  total: number;
} {
  const slices = period === 'week' ? WEEK_SLICES : MONTH_SLICES;
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);
  return { slices, total };
}

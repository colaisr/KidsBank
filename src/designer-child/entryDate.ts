import type {Entry} from './DemoState';

/** Stable example dates for operations from the early demo without timestamps. */
export function entryDate(entry:Entry,entries:Entry[]):Date {
  if(entry.createdAt){const date=new Date(entry.createdAt);if(Number.isFinite(date.getTime()))return date;}
  const index=Math.max(0,entries.filter(e=>!e.createdAt).findIndex(e=>e.id===entry.id));
  return new Date(2026,8,18-Math.floor(index/3),18-(index%3)*3,15);
}

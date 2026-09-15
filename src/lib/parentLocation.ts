import type { DemoSavedPlace, DemoState, DemoTransaction } from '../data/demoBaseline';

export type LatLng = { lat: number; lng: number };

const METERS_PER_DEG_LAT = 111_320;

function metersToLatLng(anchor: LatLng, eastMeters: number, northMeters: number): LatLng {
  const latRad = (anchor.lat * Math.PI) / 180;
  const dLat = northMeters / METERS_PER_DEG_LAT;
  const dLng = eastMeters / (METERS_PER_DEG_LAT * Math.cos(latRad));
  return { lat: anchor.lat + dLat, lng: anchor.lng + dLng };
}

export function resolvePlacePosition(
  place: DemoSavedPlace,
  mode: 'live' | 'fallback',
  anchor: LatLng | null,
): LatLng {
  if (mode === 'live' && anchor) {
    return metersToLatLng(anchor, place.liveOffsetMeters.east, place.liveOffsetMeters.north);
  }
  return { lat: place.lat, lng: place.lng };
}

export function resolveSpendPosition(
  tx: DemoTransaction,
  mode: 'live' | 'fallback',
  anchor: LatLng | null,
): LatLng | null {
  if (tx.typeId !== 'spend') {
    return null;
  }
  if (mode === 'live' && anchor && tx.liveOffsetMeters) {
    return metersToLatLng(anchor, tx.liveOffsetMeters.east, tx.liveOffsetMeters.north);
  }
  if (tx.mapLat !== undefined && tx.mapLng !== undefined) {
    return { lat: tx.mapLat, lng: tx.mapLng };
  }
  return null;
}

export function getSpendTransactionsWithMap(
  demo: DemoState,
  mode: 'live' | 'fallback',
  anchor: LatLng | null,
): Array<{ tx: DemoTransaction; position: LatLng }> {
  return demo.transactions
    .map((tx) => {
      const position = resolveSpendPosition(tx, mode, anchor);
      return position ? { tx, position } : null;
    })
    .filter((row): row is { tx: DemoTransaction; position: LatLng } => row !== null);
}

export function resolveChildFallbackPosition(demo: DemoState): LatLng {
  return { lat: demo.fallbackChild.lat, lng: demo.fallbackChild.lng };
}

export function formatRelativeUpdatedAt(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
  if (diffSec < 60) {
    return rtf.format(-diffSec, 'second');
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return rtf.format(-diffMin, 'minute');
  }
  const diffHour = Math.floor(diffMin / 60);
  return rtf.format(-diffHour, 'hour');
}

export type LocationSummaryKind = 'neutral' | 'fallback';

export function getLocationSummaryKind(mode: 'live' | 'fallback'): LocationSummaryKind {
  return mode === 'live' ? 'neutral' : 'fallback';
}

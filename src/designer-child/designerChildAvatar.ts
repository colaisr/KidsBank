import type { Bank } from '../context/preferences';

/** Raster bust for designer child header / parent map (Evoca export vs AMIO recolor). */
export function designerChildAvatarSrc(bank: Bank): string {
  return bank === 'amio' ? '/assets/avatar-amio.png' : '/assets/avatar.png';
}

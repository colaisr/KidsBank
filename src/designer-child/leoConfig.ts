import type { Bank } from '../context/preferences';

const validColor = (value?: string): value is string => /^#[0-9a-f]{6}$/i.test(value ?? '');

const AMIO_MANE = '#05a9c7';

function mixColor(color: string, toward: string, amount: number) {
  const from = color.match(/[0-9a-f]{2}/gi)!.map(value => parseInt(value,16));
  const to = toward.match(/[0-9a-f]{2}/gi)!.map(value => parseInt(value,16));
  return `#${from.map((value,index)=>Math.round(value+(to[index]-value)*amount).toString(16).padStart(2,'0')).join('')}`;
}

declare global {
  interface Window {
    EVOCA_LEO_CONFIG?: { primaryColor?: string; maneColor?: string; poster?: string };
  }
}

const config = window.EVOCA_LEO_CONFIG;
export const primaryColor = validColor(config?.primaryColor)
  ? config.primaryColor
  : validColor(config?.maneColor) ? config.maneColor : '#6A00DE';
export const brandPalette = {
  base: primaryColor,
  dark: mixColor(primaryColor, '#000000', .18),
  mid: mixColor(primaryColor, '#ffffff', .22),
  light: mixColor(primaryColor, '#ffffff', .42),
  outline: mixColor(primaryColor, '#ffffff', .70),
  soft: mixColor(primaryColor, '#ffffff', .87),
  pale: mixColor(primaryColor, '#ffffff', .94),
  wash: mixColor(primaryColor, '#ffffff', .975),
};
const defaultPoster =
  config?.poster?.startsWith('data:image/png;base64,') || config?.poster?.startsWith('/assets/')
    ? config.poster
    : '/assets/lion-purple.png';

export function leoConfigForBank(bank: Bank) {
  if (bank === 'amio') {
    return { primaryColor: AMIO_MANE, maneColor: AMIO_MANE, poster: defaultPoster };
  }
  return {
    primaryColor,
    maneColor: validColor(config?.maneColor) ? config.maneColor : primaryColor,
    poster: defaultPoster,
  };
}

/** Evoca defaults; prefer `leoConfigForBank` when bank is known. */
export const leoConfig = leoConfigForBank('evoca');

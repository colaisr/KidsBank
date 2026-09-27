const validColor = (value?: string): value is string => /^#[0-9a-f]{6}$/i.test(value ?? '');

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
export const leoConfig = {
  primaryColor,
  maneColor: validColor(config?.maneColor) ? config.maneColor : primaryColor,
  poster: config?.poster?.startsWith('data:image/png;base64,') || config?.poster?.startsWith('/assets/')
    ? config.poster : '/assets/lion-purple.png',
};

const root = document.documentElement;
root.style.setProperty('--brand', brandPalette.base);
root.style.setProperty('--brand-deep', brandPalette.dark);
root.style.setProperty('--brand-mid', brandPalette.mid);
root.style.setProperty('--brand-light', brandPalette.light);
root.style.setProperty('--brand-outline', brandPalette.outline);
root.style.setProperty('--brand-soft', brandPalette.soft);
root.style.setProperty('--brand-pale', brandPalette.pale);
root.style.setProperty('--brand-wash', brandPalette.wash);

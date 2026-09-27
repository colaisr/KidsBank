import type { Bank } from '../context/preferences';

const AMIO_PRIMARY = '#05a9c7';
const AMIO_DEEP = '#086f83';
const EVOCA_PRIMARY = '#6a00de';

function mixColor(color: string, toward: string, amount: number): string {
  const from = color.match(/[0-9a-f]{2}/gi)!.map((value) => parseInt(value, 16));
  const to = toward.match(/[0-9a-f]{2}/gi)!.map((value) => parseInt(value, 16));
  return `#${from
    .map((value, index) =>
      Math.round(value + (to[index] - value) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

export type DesignerBrandPalette = {
  base: string;
  dark: string;
  mid: string;
  light: string;
  outline: string;
  soft: string;
  pale: string;
  wash: string;
};

export function designerBrandPalette(bank: Bank): DesignerBrandPalette {
  const primary = bank === 'amio' ? AMIO_PRIMARY : EVOCA_PRIMARY;
  if (bank === 'amio') {
    return {
      base: AMIO_PRIMARY,
      dark: AMIO_DEEP,
      mid: mixColor(AMIO_PRIMARY, '#ffffff', 0.22),
      light: mixColor(AMIO_PRIMARY, '#ffffff', 0.42),
      outline: mixColor(AMIO_PRIMARY, '#ffffff', 0.7),
      soft: mixColor(AMIO_PRIMARY, '#ffffff', 0.87),
      pale: mixColor(AMIO_PRIMARY, '#ffffff', 0.94),
      wash: mixColor(AMIO_PRIMARY, '#ffffff', 0.975),
    };
  }
  return {
    base: primary,
    dark: mixColor(primary, '#000000', 0.18),
    mid: mixColor(primary, '#ffffff', 0.22),
    light: mixColor(primary, '#ffffff', 0.42),
    outline: mixColor(primary, '#ffffff', 0.7),
    soft: mixColor(primary, '#ffffff', 0.87),
    pale: mixColor(primary, '#ffffff', 0.94),
    wash: mixColor(primary, '#ffffff', 0.975),
  };
}

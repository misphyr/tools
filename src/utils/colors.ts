// utils/colors.ts

export interface Rgb { r: number; g: number; b: number }
export interface Hsl { h: number; s: number; l: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const rgbToHex = ({ r, g, b }: Rgb): string =>
  '#' + [r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('').toUpperCase();

export const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
};

export const hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  const sn = clamp(s, 0, 100) / 100, ln = clamp(l, 0, 100) / 100;
  const hn = ((h % 360) + 360) % 360;
  const k = (n: number) => (n + hn / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
};

export const rgbToHsv = ({ r, g, b }: Rgb) => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  const { h } = rgbToHsl({ r, g, b });
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
};

export const rgbToCmyk = ({ r, g, b }: Rgb) => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: ((1 - rn - k) / (1 - k)) * 100,
    m: ((1 - gn - k) / (1 - k)) * 100,
    y: ((1 - bn - k) / (1 - k)) * 100,
    k: k * 100,
  };
};

export const formatRgb = ({ r, g, b }: Rgb) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

export const formatHsl = (rgb: Rgb) => {
  const { h, s, l } = rgbToHsl(rgb);
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
};

// Aceita #RGB, #RRGGBB (com ou sem #, alfa ignorado), rgb(), hsl() e "r, g, b"
export const parseColor = (input: string): Rgb | null => {
  const value = input.trim().toLowerCase();

  const hexMatch = value.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length <= 4) hex = hex.split('').map((c) => c + c).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(/^(?:rgba?\()?\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)?$/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1, 4).map(Number);
    if ([r, g, b].some((channel) => channel > 255)) return null;
    return { r, g, b };
  }

  const hslMatch = value.match(/^hsla?\(\s*(-?[\d.]+)(?:deg)?\s*[,\s]\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/);
  if (hslMatch) {
    const [h, s, l] = hslMatch.slice(1, 4).map(Number);
    if (s > 100 || l > 100) return null;
    return hslToRgb({ h, s, l });
  }

  return null;
};

const relativeLuminance = ({ r, g, b }: Rgb) => {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

export const contrastRatio = (a: Rgb, b: Rgb) => {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// Cor de texto legível (preto ou branco) sobre a cor informada
export const readableTextColor = (rgb: Rgb) =>
  contrastRatio(rgb, { r: 0, g: 0, b: 0 }) >= contrastRatio(rgb, { r: 255, g: 255, b: 255 }) ? '#000000' : '#FFFFFF';


 
export interface CardTheme {
  /** Unique solid background colour for this card */
  background: string;
  /** "#000000" or "#ffffff" — whichever passes WCAG 4.5:1 on `background` */
  textColor: string;
  /** background at sowewhat 9% opacity — for the transaction panel tint */
  panelTint: string;
  /** background at somewhat 25% opacity — for the panel border */
  panelBorder: string;
}
 
//  Hash 
 
function hashId(id: string): number {
  let hash = 5381;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33) ^ id.charCodeAt(i);
  }
  return Math.abs(hash);
}
 
//Colour helpers 
 
function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + hNorm / 30) % 12;
    const c = lNorm - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
 
function relativeLuminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  return rgb
    .map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, val, i) => sum + val * [0.2126, 0.7152, 0.0722][i], 0);
}
 
function readableTextColor(background: string): string {
  const L = relativeLuminance(background);
  // WCAG contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
  // White (#fff) luminance = 1, Black (#000) luminance = 0
  const contrastWithWhite = (1 + 0.05) / (L + 0.05);
  const contrastWithBlack = (L + 0.05) / (0 + 0.05);
  return contrastWithWhite >= contrastWithBlack ? "#ffffff" : "#000000";
}
 
// Public API
 
export function generateCardTheme(id: string): CardTheme {
  const hash = hashId(id);
  const hue  = hash % 360;
 
  // Saturation 55%, lightness 40% 
  const background = hslToHex(hue, 55, 40);
  const textColor  = readableTextColor(background);
 
  return {
    background,
    textColor,
    panelTint:   `${background}18`, // somewhat 9% opacity
    panelBorder: `${background}40`, // somewhat 25% opacity
  };
}
 
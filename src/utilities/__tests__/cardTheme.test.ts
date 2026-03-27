
import { generateCardTheme } from "../cardTheme";

describe("generateCardTheme", () => {
  it("returns all required fields", () => {
    const theme = generateCardTheme("card-1");
    expect(theme).toHaveProperty("background");
    expect(theme).toHaveProperty("textColor");
    expect(theme).toHaveProperty("panelTint");
    expect(theme).toHaveProperty("panelBorder");
  });

  it("is deterministic — same id always returns same background", () => {
    const a = generateCardTheme("lkmfkl-mlfkm-dlkfm");
    const b = generateCardTheme("lkmfkl-mlfkm-dlkfm");
    expect(a.background).toBe(b.background);
    expect(a.textColor).toBe(b.textColor);
  });

  it("produces different backgrounds for different ids", () => {
    const a = generateCardTheme("lkmfkl-mlfkm-dlkfm");
    const b = generateCardTheme("elek-n3lk-4m3lk4");
    expect(a.background).not.toBe(b.background);
  });

  it("background is a single solid hex colour — not a gradient", () => {
    const { background } = generateCardTheme("test-id");
    expect(background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(background).not.toContain("gradient");
  });

  it("textColor is always black or white", () => {
    ["lkmfkl-mlfkm-dlkfm", "elek-n3lk-4m3lk4", "card-1", "a", "xyz"].forEach((id) => {
      expect(["#000000", "#ffffff"]).toContain(generateCardTheme(id).textColor);
    });
  });

  it("text contrast ratio is at least 4.5:1 (WCAG AA) across many hues", () => {
    const lum = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
        .map((c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    };

    Array.from({ length: 20 }, (_, i) => `card-${i}`).forEach((id) => {
      const { background, textColor } = generateCardTheme(id);
      const L1 = lum(background);
      const L2 = lum(textColor);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  it("panelTint appends 2-char opacity suffix to background", () => {
    const { background, panelTint } = generateCardTheme("test-id");
    expect(panelTint).toBe(`${background}18`);
  });

  it("panelBorder appends 2-char opacity suffix to background", () => {
    const { background, panelBorder } = generateCardTheme("test-id");
    expect(panelBorder).toBe(`${background}40`);
  });

  it("does not crash on empty string id", () => {
    expect(() => generateCardTheme("")).not.toThrow();
  });

  it("does not crash on very long id", () => {
    expect(() => generateCardTheme("a".repeat(500))).not.toThrow();
  });
});
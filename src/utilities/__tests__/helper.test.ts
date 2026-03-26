import { formatCurrency, filterByMinAmount } from "../helper";

// formatCurrency

describe("formatCurrency", () => {
  // Intl.NumberFormat inserts a non-breaking space (\u00a0) between
  // the number and the € sign — use toMatch(/pattern/) to avoid
  // hardcoding the exact whitespace character
  it("formats integer in German locale by default", () => {
    expect(formatCurrency(100)).toMatch(/100,00/);
    expect(formatCurrency(100)).toMatch(/€/);
  });

  it("formats decimal with correct German padding", () => {
    expect(formatCurrency(43.8)).toMatch(/43,80/);
    expect(formatCurrency(43.8)).toMatch(/€/);
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/0,00/);
    expect(formatCurrency(0)).toMatch(/€/);
  });

  it("formats negative amount", () => {
    expect(formatCurrency(-100.88)).toMatch(/-100,88/);
    expect(formatCurrency(-100.88)).toMatch(/€/);
  });

  it("formats large amount with German thousands separator", () => {
    expect(formatCurrency(1234.56)).toMatch(/1\.234,56/);
    expect(formatCurrency(1234.56)).toMatch(/€/);
  });

  it("accepts custom locale and currency", () => {
    const result = formatCurrency(99.99, "en-US", "USD");
    expect(result).toMatch(/99\.99/);
    expect(result).toMatch(/\$/);
  });
});

// filterByMinAmount 

describe("filterByMinAmount", () => {
  const items = [
    { id: "1", amount: -100.88 },
    { id: "2", amount: 0       },
    { id: "3", amount: 17.99   },
    { id: "4", amount: 43.80   },
    { id: "5", amount: 129.00  },
  ];

  it("returns all items when minAmount is empty string", () => {
    expect(filterByMinAmount(items, "")).toHaveLength(5);
  });

  it("returns all items when minAmount is not a number", () => {
    expect(filterByMinAmount(items, "abc")).toHaveLength(5);
  });

  it("filters items below the threshold", () => {
    const result = filterByMinAmount(items, "20");
    expect(result.map((i) => i.id)).toEqual(["4", "5"]);
  });

  it("includes items exactly equal to threshold — >= semantics", () => {
    const result = filterByMinAmount(items, "43.80");
    expect(result.map((i) => i.id)).toEqual(["4", "5"]);
  });

  it("returns items >= 0 when threshold is 0 — excludes negatives", () => {
    // -100.88 < 0 so it is excluded; 0, 17.99, 43.80, 129.00 qualify
    const result = filterByMinAmount(items, "0");
    expect(result).toHaveLength(4);
    expect(result.map((i) => i.id)).toEqual(["2", "3", "4", "5"]);
  });

  it("negative threshold — includes all items >= -200", () => {
    const result = filterByMinAmount(items, "-200");
    expect(result).toHaveLength(5);
  });

  it("negative threshold — excludes items below -50", () => {
    // -100.88 < -50 → excluded
    const result = filterByMinAmount(items, "-50");
    expect(result.map((i) => i.id)).toEqual(["2", "3", "4", "5"]);
  });

  it("returns empty array when threshold exceeds all amounts", () => {
    expect(filterByMinAmount(items, "9999")).toHaveLength(0);
  });

  it("does not mutate the original array", () => {
    const copy = [...items];
    filterByMinAmount(items, "50");
    expect(items).toEqual(copy);
  });
});
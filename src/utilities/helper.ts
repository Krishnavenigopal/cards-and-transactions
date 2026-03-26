
export function formatCurrency(
  amount: number,
  locale = "de-DE",
  currency = "EUR"
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function filterByMinAmount<T extends { amount: number }>(
  items: T[],
  minAmount: string
): T[] {
  const threshold = parseFloat(minAmount);
  if (!minAmount || isNaN(threshold)) return items;
  return items.filter((item) => item.amount >= threshold);
}
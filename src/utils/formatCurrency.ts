/**
 * Format a number as a currency string.
 * Amount is in cents (e.g., 1999 = $19.99).
 *
 * TODO(TEAM-FRONTEND): Add locale support for international currencies
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  return formatter.format(amount / 100);
}

/**
 * Parse a currency string to cents.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const floatValue = parseFloat(cleaned);
  return Math.round(floatValue * 100);
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

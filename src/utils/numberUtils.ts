/**
 * Formats a number or string with Indonesian thousands separator (dots).
 * Example: 1000000 -> "1.000.000"
 */
export const formatNumber = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const s = val.toString().replace(/\./g, '');
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parses a formatted number string back to a numeric string (removes dots).
 * Example: "1.000.000" -> "1000000"
 */
export const parseNumber = (val: string): string => {
  return val.replace(/\./g, '');
};

/**
 * Formats a number as IDR currency.
 * Example: 1000000 -> "Rp 1.000.000"
 */
export const formatCurrency = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '-';
  const formatted = formatNumber(val);
  return formatted ? `Rp ${formatted}` : '-';
};

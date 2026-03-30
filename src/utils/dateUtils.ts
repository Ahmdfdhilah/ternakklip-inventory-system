import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Formats a date string or Date object to Indonesian long format.
 * Example: "d MMM yyyy, HH:mm" -> "30 Mar 2026, 17:15"
 */
export const formatDate = (date: string | number | Date | undefined | null): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'd MMM yyyy, HH:mm', { locale: id });
  } catch (err) {
    return '-';
  }
};

/**
 * Formats a date string or Date object to Indonesian short format.
 * Example: "d MMM yyyy" -> "30 Mar 2026"
 */
export const formatDateShort = (date: string | number | Date | undefined | null): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'd MMM yyyy', { locale: id });
  } catch (err) {
    return '-';
  }
};

/**
 * Formats a date string or Date object to Indonesian full format with day name.
 * Example: "EEEE, dd MMMM yyyy" -> "Senin, 30 Maret 2026"
 */
export const formatDateFull = (date: string | number | Date | undefined | null): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: id });
  } catch (err) {
    return '-';
  }
};

/**
 * Formats a date to relative time in Indonesian.
 * Example: "3 minutes ago" -> "3 menit yang lalu"
 */
export const formatRelativeTime = (date: string | number | Date | undefined | null): string => {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
  } catch (err) {
    return '-';
  }
};

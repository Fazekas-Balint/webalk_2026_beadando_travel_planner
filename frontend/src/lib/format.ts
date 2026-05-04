import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { hu } from 'date-fns/locale';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'yyyy. MMM d.', { locale: hu });
}

export function formatDateLong(iso: string): string {
  return format(parseISO(iso), 'yyyy. MMMM d., EEEE', { locale: hu });
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${format(s, 'yyyy. MMM d.', { locale: hu })} – ${format(e, 'd.', { locale: hu })}`;
  }
  return `${format(s, 'MMM d.', { locale: hu })} – ${format(e, 'MMM d., yyyy', { locale: hu })}`;
}

export function tripDays(start: string, end: string): number {
  return differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;
}

export function formatCost(value: number | null | undefined): string {
  if (value == null) return '';
  return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(value);
}

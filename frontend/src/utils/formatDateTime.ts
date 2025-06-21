// frontend/src/utils/formatDateTime.ts
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DATE_FORMAT = 'dd/MM/yyyy';
const DATETIME_FORMAT = `${DATE_FORMAT} HH:mm`;

export const formatDateTime = (date?: string | Date): string =>
  date ? format(new Date(date), DATETIME_FORMAT, { locale: fr }) : '—';

export const formatDate = (date?: string | Date): string =>
  date ? format(new Date(date), DATE_FORMAT, { locale: fr }) : '—';

export const formatTimestampToDate = (timestamp?: {
  seconds: number;
  nanoseconds: number;
}): string => {
  if (
    !timestamp ||
    typeof timestamp.seconds !== 'number' ||
    typeof timestamp.nanoseconds !== 'number'
  )
    return '—';

  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
  const date = new Date(milliseconds);

  return date ? format(new Date(date), DATE_FORMAT, { locale: fr }) : '—';
};

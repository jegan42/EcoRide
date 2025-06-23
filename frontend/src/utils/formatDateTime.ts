// frontend/src/utils/formatDateTime.ts
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { FirestoreTimestamp } from '../types/common';

const DATE_FORMAT = 'dd/MM/yyyy';
const DATETIME_FORMAT = `${DATE_FORMAT} HH:mm`;

export const formatDateTime = (date?: string | Date): string =>
  date ? format(new Date(date), DATETIME_FORMAT, { locale: fr }) : '—';

export const formatDate = (date?: string | Date): string =>
  date ? format(new Date(date), DATE_FORMAT, { locale: fr }) : '—';

export const formatTimestampToDate = (
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  },
  full = false
): string => {
  if (
    !timestamp ||
    typeof timestamp.seconds !== 'number' ||
    typeof timestamp.nanoseconds !== 'number'
  )
    return '—';

  return format(
    timestampToDate(timestamp),
    full ? DATETIME_FORMAT : DATE_FORMAT,
    {
      locale: fr,
    }
  );
};

export const timestampToDate = (ts?: FirestoreTimestamp): Date =>
  ts
    ? new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6))
    : new Date(0);

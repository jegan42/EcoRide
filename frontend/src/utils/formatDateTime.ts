// frontend/src/utils/formatDateTime.ts
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateTime = (date?: string | Date): string =>
  date ? format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr }) : '—';

// frontend/src/types/contact.ts

import type { FirestoreTimestamp } from './common';

export type ContactStatus = 'unread' | 'answered' | 'no-reply';

export interface Contact {
  id?: string;
  email: string;
  subject: string;
  message: string;
  status?: ContactStatus;
  sentAt?: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

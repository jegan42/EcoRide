// frontend/src/types/contact.ts
export interface Contact {
  id?: string;
  email: string;
  subject: string;
  message: string;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

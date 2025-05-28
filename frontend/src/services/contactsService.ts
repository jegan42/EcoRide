import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from 'firebase/firestore';
import type { Contact } from '../types/contact';

const contactsCollection = collection(db, 'contacts');

export const addContact = async (
  contact: Partial<Contact>
): Promise<DocumentReference> => {
  return await addDoc(contactsCollection, {
    ...contact,
    sent_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });
};

export const getAllContacts = async (): Promise<Contact[]> => {
  const snapshot = await getDocs(contactsCollection);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Contact),
    id: doc.id,
  }));
};

export const updateContact = async (
  id: string,
  data: Partial<Contact>
): Promise<void> => {
  const contactDoc = doc(db, 'contacts', id);
  await updateDoc(contactDoc, { ...data, updated_at: new Date() });
};

export const deleteContact = async (id: string): Promise<void> => {
  const contactDoc = doc(db, 'contacts', id);
  await deleteDoc(contactDoc);
};

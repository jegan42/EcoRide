// frontend/src/services/contactsService.ts
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
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

export const addContact = async (
  contact: Partial<Contact>
): Promise<ApiResponse<DocumentReference>> => {
  const contactsCollection = collection(db, 'contacts');
  const docRef = await addDoc(contactsCollection, {
    ...contact,
    sent_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });
  return handleApiResponseSafe<DocumentReference>({
    message: 'Contact ajouté avec succès',
    data: docRef,
  });
};

export const getAllContacts = async (): Promise<ApiResponse<Contact[]>> => {
  const contactsCollection = collection(db, 'contacts');
  const snapshot = await getDocs(contactsCollection);
  const contacts = snapshot.docs.map((doc) => ({
    ...(doc.data() as Contact),
    id: doc.id,
  }));
  return handleApiResponseSafe<Contact[]>({
    message: 'Contacts récupérés',
    data: contacts,
  });
};

export const updateContact = async (
  id: string,
  data: Partial<Contact>
): Promise<ApiResponse<void>> => {
  const contactDoc = doc(db, 'contacts', id);
  await updateDoc(contactDoc, { ...data, updated_at: new Date() });
  return handleApiResponseBasic<void>({
    message: 'Contact mis à jour',
    data: undefined,
  });
};

export const deleteContact = async (id: string): Promise<ApiResponse<void>> => {
  const contactDoc = doc(db, 'contacts', id);
  await deleteDoc(contactDoc);
  return handleApiResponseBasic<void>({
    message: 'Contact supprimé',
    data: undefined,
  });
};

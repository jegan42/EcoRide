// frontend/src/services/historiesService.ts
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentReference,
} from 'firebase/firestore';
import type { History } from '../types/history';

export const addHistory = async (
  history: Partial<History>
): Promise<DocumentReference> => {
  const historiesCollection = collection(db, 'histories');
  return await addDoc(historiesCollection, {
    ...history,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

export const getAllHistories = async (): Promise<History[]> => {
  const historiesCollection = collection(db, 'histories');
  const snapshot = await getDocs(historiesCollection);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
};

export const getHistoriesByUser = async (
  userId: string
): Promise<History[]> => {
  const historiesCollection = collection(db, 'histories');
  const q = query(historiesCollection, where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
};

export const updateHistory = async (
  id: string,
  data: Partial<History>
): Promise<void> => {
  const historyDoc = doc(db, 'histories', id);
  await updateDoc(historyDoc, { ...data, updated_at: new Date() });
};

export const deleteHistory = async (id: string): Promise<void> => {
  const historyDoc = doc(db, 'histories', id);
  await deleteDoc(historyDoc);
};

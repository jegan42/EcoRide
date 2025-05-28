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

const historiesCollection = collection(db, 'histories');

// Ajouter une nouvelle history
export const addHistory = async (
  history: History
): Promise<DocumentReference> => {
  return await addDoc(historiesCollection, {
    ...history,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

// Récupérer toutes les histories
export const getAllHistories = async (): Promise<History[]> => {
  const snapshot = await getDocs(historiesCollection);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
};

// Récupérer histories d’un user spécifique
export const getHistoriesByUser = async (
  userId: string
): Promise<History[]> => {
  const q = query(historiesCollection, where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
};

// Mettre à jour une history
export const updateHistory = async (
  id: string,
  data: Partial<History>
): Promise<void> => {
  const historyDoc = doc(db, 'histories', id);
  await updateDoc(historyDoc, { ...data, updated_at: new Date() });
};

// Supprimer une history
export const deleteHistory = async (id: string): Promise<void> => {
  const historyDoc = doc(db, 'histories', id);
  await deleteDoc(historyDoc);
};

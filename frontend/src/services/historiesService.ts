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
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

export const addHistory = async (
  history: Partial<History>
): Promise<ApiResponse<DocumentReference>> => {
  const historiesCollection = collection(db, 'histories');
  const docRef = await addDoc(historiesCollection, {
    ...history,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return handleApiResponseSafe<DocumentReference>({
    message: 'Historique ajouté avec succès',
    data: docRef,
  });
};

export const getAllHistories = async (): Promise<ApiResponse<History[]>> => {
  const historiesCollection = collection(db, 'histories');
  const snapshot = await getDocs(historiesCollection);
  const histories = snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
  return handleApiResponseSafe<History[]>({
    message: 'Historiques récupérés',
    data: histories,
  });
};

export const getHistoriesByUser = async (
  userId: string
): Promise<ApiResponse<History[]>> => {
  const historiesCollection = collection(db, 'histories');
  const q = query(historiesCollection, where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  const histories = snapshot.docs.map((doc) => ({
    ...(doc.data() as History),
    id: doc.id,
  }));
  return handleApiResponseSafe<History[]>({
    message: 'Historiques utilisateur récupérés',
    data: histories,
  });
};

export const updateHistory = async (
  id: string,
  data: Partial<History>
): Promise<ApiResponse<void>> => {
  const historyDoc = doc(db, 'histories', id);
  await updateDoc(historyDoc, { ...data, updated_at: new Date() });
  return handleApiResponseBasic<void>({
    message: 'Historique mis à jour',
    data: undefined,
  });
};

export const deleteHistory = async (id: string): Promise<ApiResponse<void>> => {
  const historyDoc = doc(db, 'histories', id);
  await deleteDoc(historyDoc);
  return handleApiResponseBasic<void>({
    message: 'Historique supprimé',
    data: undefined,
  });
};

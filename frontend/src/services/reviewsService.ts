// frontend/src/services/reviewsService.ts
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
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

interface Review {
  author_id: string;
  target_id: string;
  trip_id: string;
  rating: number;
  comment: string;
  created_at?: Date;
  updated_at?: Date;
}

export const addReview = async (
  review: Review
): Promise<ApiResponse<DocumentReference>> => {
  const reviewsCollection = collection(db, 'reviews');
  const docRef = await addDoc(reviewsCollection, {
    ...review,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return handleApiResponseSafe<DocumentReference>({
    message: 'Avis ajouté avec succès',
    data: docRef,
  });
};

export const getAllReviews = async (): Promise<ApiResponse<Review[]>> => {
  const reviewsCollection = collection(db, 'reviews');
  const snapshot = await getDocs(reviewsCollection);
  const reviews = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
  return handleApiResponseSafe<Review[]>({
    message: 'Avis récupérés',
    data: reviews,
  });
};

export const getReviewsByAuthor = async (
  authorId: string
): Promise<ApiResponse<Review[]>> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('author_id', '==', authorId));
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
  return handleApiResponseSafe<Review[]>({
    message: 'Avis par autheur récupérés',
    data: reviews,
  });
};

export const getReviewsByTarget = async (
  targetId: string
): Promise<ApiResponse<Review[]>> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('target_id', '==', targetId));
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
  return handleApiResponseSafe<Review[]>({
    message: 'Avis par chauffeur récupérés',
    data: reviews,
  });
};

export const updateReview = async (
  id: string,
  data: Partial<Review>
): Promise<ApiResponse<void>> => {
  const reviewDoc = doc(db, 'reviews', id);
  await updateDoc(reviewDoc, { ...data, updated_at: new Date() });
  return handleApiResponseBasic<void>({
    message: 'Avis mis à jour',
    data: undefined,
  });
};

export const deleteReview = async (id: string): Promise<ApiResponse<void>> => {
  const reviewDoc = doc(db, 'reviews', id);
  await deleteDoc(reviewDoc);
  return handleApiResponseBasic<void>({
    message: 'Avis supprimé',
    data: undefined,
  });
};

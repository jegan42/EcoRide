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

interface Review {
  author_id: string;
  target_id: string;
  trip_id: string;
  rating: number;
  comment: string;
  created_at?: Date;
  updated_at?: Date;
}

export const addReview = async (review: Review): Promise<DocumentReference> => {
  const reviewsCollection = collection(db, 'reviews');
  return await addDoc(reviewsCollection, {
    ...review,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

export const getAllReviews = async (): Promise<Review[]> => {
  const reviewsCollection = collection(db, 'reviews');
  const snapshot = await getDocs(reviewsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
};

export const getReviewsByAuthor = async (
  authorId: string
): Promise<Review[]> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('author_id', '==', authorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
};

export const getReviewsByTarget = async (
  targetId: string
): Promise<Review[]> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('target_id', '==', targetId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
};

export const updateReview = async (
  id: string,
  data: Partial<Review>
): Promise<void> => {
  const reviewDoc = doc(db, 'reviews', id);
  await updateDoc(reviewDoc, { ...data, updated_at: new Date() });
};

export const deleteReview = async (id: string): Promise<void> => {
  const reviewDoc = doc(db, 'reviews', id);
  await deleteDoc(reviewDoc);
};

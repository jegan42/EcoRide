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
import type { Review } from '../types/review';
import tripService from './tripService';
import type { Trip } from '../types/trip';
import type { AverageRating } from '../types/user';
import type { Booking } from '../types/booking';

const addReview = async (
  review: Review
): Promise<ApiResponse<DocumentReference>> => {
  const alreadyReviewed = await hasAlreadyReviewedBooking(
    review.authorId,
    review.bookingId
  );

  if (alreadyReviewed) {
    return handleApiResponseBasic<DocumentReference>({
      message: 'Un avis a déjà été laissé pour cette réservation.',
    });
  }
  const reviewsCollection = collection(db, 'reviews');
  const docRef = await addDoc(reviewsCollection, {
    ...review,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return handleApiResponseSafe<DocumentReference>({
    message: 'Avis ajouté avec succès',
    data: docRef,
  });
};

const getAllReviews = async (): Promise<ApiResponse<Review[]>> => {
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

const getReviewsByAuthor = async (
  authorId: string
): Promise<ApiResponse<Review[]>> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('authorId', '==', authorId));
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

const getReviewsByTarget = async (
  targetId: string
): Promise<ApiResponse<Review[]>> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('targetId', '==', targetId));
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

const updateReview = async (
  id: string,
  data: Review
): Promise<ApiResponse<void>> => {
  const reviewDoc = doc(db, 'reviews', id);
  await updateDoc(reviewDoc, { ...data, updatedAt: new Date() });
  return handleApiResponseBasic<void>({
    message: 'Avis mis à jour',
    data: undefined,
  });
};

const deleteReview = async (id: string): Promise<ApiResponse<void>> => {
  const reviewDoc = doc(db, 'reviews', id);
  await deleteDoc(reviewDoc);
  return handleApiResponseBasic<void>({
    message: 'Avis supprimé',
    data: undefined,
  });
};

const hasAlreadyReviewedBooking = async (
  authorId: string,
  bookingId: string
): Promise<boolean> => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(
    reviewsCollection,
    where('authorId', '==', authorId),
    where('bookingId', '==', bookingId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

let cachedTrips: Trip[] | null = null;
let cachedTripsTimestamp = 0;

const clearTripCache = (): void => {
  cachedTrips = null;
  cachedTripsTimestamp = 0;
};

const CACHE_TTL = 15 * 60 * 1000;

const getAverageRatingsByTargetUser = async (
  userId: string
): Promise<AverageRating> => {
  const { data: dataReviews } = await getReviewsByTarget(userId);
  if (!dataReviews || dataReviews.length === 0) return {};

  if (!cachedTrips || Date.now() - cachedTripsTimestamp > CACHE_TTL) {
    const { data: allTrips } = await tripService.fetchAllTrips();
    if (!allTrips) return {};
    cachedTrips = allTrips;
    cachedTripsTimestamp = Date.now();
  }

  const tripMap = new Map(cachedTrips.map((t) => [t.id, t]));

  const driverRatings: number[] = [];
  const passengerRatings: number[] = [];

  for (const review of dataReviews) {
    const trip = tripMap.get(review.tripId);
    if (!trip) continue;

    if (trip.driverId === userId) {
      driverRatings.push(review.rating);
    } else {
      passengerRatings.push(review.rating);
    }
  }

  const computeStats = (
    arr: number[]
  ):
    | {
        rating: number;
        reviewCount: number;
      }
    | undefined =>
    arr.length > 0
      ? {
          rating: parseFloat(
            (arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(1)
          ),
          reviewCount: arr.length,
        }
      : undefined;

  return {
    asDriver: computeStats(driverRatings),
    asPassenger: computeStats(passengerRatings),
  };
};

const buildReview = (
  userId: string,
  booking: Booking,
  action: 'review' | 'no_show',
  rating: number,
  comment: string
): Review => ({
  authorId: userId,
  targetId:
    booking.user?.id === userId
      ? (booking.trip?.driverId ?? '')
      : (booking.user?.id ?? ''),
  driverId: booking.trip?.driverId ?? '',
  tripId: booking.trip?.id ?? '',
  bookingId: booking.id,
  rating: action === 'review' ? rating : 0,
  comment: action === 'review' ? comment : 'Pas présent',
});

export default {
  addReview,
  getAllReviews,
  getReviewsByAuthor,
  getReviewsByTarget,
  updateReview,
  deleteReview,
  hasAlreadyReviewedBooking,
  clearTripCache,
  getAverageRatingsByTargetUser,
  buildReview,
};

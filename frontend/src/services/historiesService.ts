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
  Timestamp,
} from 'firebase/firestore';
import type { History, HistoryStatusEnum } from '../types/history';
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';
import type { Booking } from '../types/booking';
import type { RoleEnum } from '../types/user';
import type { Trip } from '../types/trip';
import tripService from './tripService';
import bookingService from './bookingService';

export const addHistory = async (
  history: History
): Promise<ApiResponse<DocumentReference>> => {
  const historiesCollection = collection(db, 'histories');
  const docRef = await addDoc(historiesCollection, {
    ...history,
    createdAt: new Date(),
    updatedAt: new Date(),
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
  const q = query(historiesCollection, where('userId', '==', userId));
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
  await updateDoc(historyDoc, { ...data, updatedAt: new Date() });
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

export const buildHistory = (
  userId: string,
  booking: Booking,
  status: HistoryStatusEnum,
  role: RoleEnum
): History => {
  return {
    userId,
    tripId: booking.trip?.id ?? '',
    bookingId: booking.id,
    cancellerId: booking.cancellerId,
    role,
    status,
    tripDate: Timestamp.fromDate(new Date(booking.trip?.departureDate ?? '')),
  };
};

export const hasAlreadyHistory = async (
  userId: string,
  tripId: string,
  bookingId: string
): Promise<boolean> => {
  const HistoriesCollection = collection(db, 'histories');
  const q = query(
    HistoriesCollection,
    where('userId', '==', userId),
    where('tripId', '==', tripId),
    where('bookingId', '==', bookingId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

let cachedTrips: Trip[] | null = null;
let cachedTripsTimestamp = 0;
let cachedBookings: Booking[] | null = null;
let cachedBookingsTimestamp = 0;

export const clearTripCache = (): void => {
  cachedTrips = null;
  cachedTripsTimestamp = 0;
};

export const clearBookingCache = (): void => {
  cachedBookings = null;
  cachedBookingsTimestamp = 0;
};

const CACHE_TTL = 15 * 60 * 1000;

export const historieEnrichied = async (userId: string): Promise<History[]> => {
  const { data: dataHistories } = await getHistoriesByUser(userId);
  if (!dataHistories || dataHistories.length === 0) return [];

  if (!cachedTrips || Date.now() - cachedTripsTimestamp > CACHE_TTL) {
    const { data: allTrips } = await tripService.fetchAllTrips();
    if (!allTrips) return [];
    cachedTrips = allTrips;
    cachedTripsTimestamp = Date.now();
  }

  if (!cachedBookings || Date.now() - cachedBookingsTimestamp > CACHE_TTL) {
    const { data: allBookings } = await bookingService.fetchAllBookings();
    if (!allBookings) return [];
    cachedBookings = allBookings;
    cachedBookingsTimestamp = Date.now();
  }

  const tripMap = new Map<string, Trip>(
    cachedTrips.map((trip) => [trip.id, trip])
  );

  const bookingMap = new Map<string, Booking>(
    cachedBookings.map((booking) => [booking.id, booking])
  );

  const enrichedHistories = dataHistories
    .map((history) => {
      const trip = tripMap.get(history.tripId);
      const booking = bookingMap.get(history.bookingId);
      if (!trip || !booking) return null;
      return {
        ...history,
        trip,
        booking,
      };
    })
    .filter(Boolean) as History[];

  return enrichedHistories;
};

// frontend/src/hooks/useTrip.ts
import { useEffect, useState, useCallback } from 'react';
import tripService from '../services/tripService';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../utils/enqueueSnackbar';
import type { Trip } from '../types/trip';
import { useAppSelector } from './useAppSelector';

export type TripFilters = Partial<{
  departureCity: string;
  arrivalCity: string;
  date: string;
  flexible: boolean;
}>;

export const useTrip = (): {
  allTrips: Trip[];
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  fetchTrips: (
    data: Partial<{
      departureCity: string;
      arrivalCity: string;
      departureDate: string;
      flexible: boolean;
    }>
  ) => Promise<boolean>;
  fetchTripById: (id: string) => Promise<boolean>;
  onCreateTrip: (data: Trip) => Promise<boolean>;
  onUpdateTrip: (id: string, tripData: Trip) => Promise<boolean>;
  onCancelTrip: (id: string) => Promise<boolean>;
} => {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const fetchTrips = useCallback(
    async (filters?: TripFilters): Promise<boolean> => {
      setLoading(true);
      try {
        const { data, message } = await tripService.fetchTrips(filters);
        if (user) {
          const tripsWithoutOwnTrip = data.filter(
            (trip: Trip) => trip.driverId !== user.id
          );
          setAllTrips(tripsWithoutOwnTrip);
        } else {
          setAllTrips(data);
        }
        enqueueSnackbarSuccess(message);
        return true;
      } catch (err) {
        enqueueSnackbarError(err);
        setError('Erreur lors du chargement des trajets');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchTripById = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, message } = await tripService.fetchTripById(id);
      setSelectedTrip(data);
      enqueueSnackbarSuccess(message);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors du chargement du trajet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTripByDriver = async (): Promise<void> => {
      setLoading(true);
      try {
        const { data, message } = await tripService.fetchTripsByDriver();
        if (isMounted) {
          setTrips(data);
          enqueueSnackbarSuccess(message);
        }
      } catch (err) {
        if (isMounted) {
          enqueueSnackbarError(err);
          setError('Vous n’avez encore enregistré aucun voyage.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchTripByDriver();

    return () => {
      isMounted = false;
    };
  }, []);

  const onCreateTrip = async (tripData: Trip): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data, message } = await tripService.createTrip({
        ...tripData,
        status: 'open',
      });
      enqueueSnackbarSuccess(message);
      setTrips((prev) => [...prev, data]);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la création du trajet');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateTrip = async (
    id: string,
    tripData: Partial<Trip>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data, message } = await tripService.updateTrip(id, tripData);
      enqueueSnackbarSuccess(message);
      setTrips((prev) => prev.map((t) => (t.id === id ? data : t)));
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la mise à jour du trajet');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancelTrip = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data, message } = await tripService.cancelTrip(id);
      enqueueSnackbarSuccess(message);
      setTrips((prev) => prev.map((t) => (t.id === id ? data : t)));
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de l’annulation du trajet');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    allTrips,
    trips,
    selectedTrip,
    loading,
    error,
    isSubmitting,
    fetchTrips,
    fetchTripById,
    onCreateTrip,
    onUpdateTrip,
    onCancelTrip,
  };
};

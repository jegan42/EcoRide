// frontend/src/hooks/usePreferences.ts
import { useEffect, useState } from 'react';
import userPreferencesService from '../services/userPreferencesService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import type { UserPreferences } from '../types/preferences';

export const usePreferences = (): {
  preferences: Partial<UserPreferences> | null;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  onCreatePreferences: (data: Partial<UserPreferences>) => Promise<boolean>;
  onUpdatePreferences: (data: Partial<UserPreferences>) => Promise<boolean>;
  onDeletePreferences: () => Promise<boolean>;
  fetchPreferencesById: (userId: string) => Promise<boolean>;
} => {
  const [preferences, setPreferences] =
    useState<Partial<UserPreferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPreferences = async (): Promise<void> => {
      setLoading(true);
      try {
        const { data, message } =
          await userPreferencesService.fetchUserPreferences();
        setPreferences(data);
        enqueueSnackbarSuccess(message);
      } catch (err) {
        setError('Vous n’avez encore enregistré aucune préférence.');
        enqueueSnackbarError(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchPreferences();
  }, []);

  const onCreatePreferences = async (
    data: Partial<UserPreferences>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data: newPrefs, message } =
        await userPreferencesService.createUserPreferences(data);
      setPreferences(newPrefs);
      enqueueSnackbarSuccess(message);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la création des préférences');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdatePreferences = async (
    data: Partial<UserPreferences>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data: updatedPrefs, message } =
        await userPreferencesService.updateUserPreferences(data);
      setPreferences(updatedPrefs);
      enqueueSnackbarSuccess(message);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la mise à jour des préférences');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeletePreferences = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { message } = await userPreferencesService.deleteUserPreferences();
      setPreferences(null);
      enqueueSnackbarSuccess(message);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la suppression des préférences');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPreferencesById = async (userId: string): Promise<boolean> => {
    if (!userId) {
      enqueueSnackbarError('Utilisateur invalide.');
      return false;
    }
    setLoading(true);
    try {
      const { data, message } =
        await userPreferencesService.fetchUserPreferencesById(userId);
      setPreferences(data);
      enqueueSnackbarSuccess(message);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors du chargement des préférences de l’utilisateur');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    isSubmitting,
    onCreatePreferences,
    onUpdatePreferences,
    onDeletePreferences,
    fetchPreferencesById,
  };
};

// tests/__tests__/hooks/usePreferences.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePreferences } from '../../hooks/usePreferences';
import userPreferencesService from '../../services/userPreferencesService';
import * as enqueue from '../../utils/enqueueSnackbar';
import { vi } from 'vitest';

vi.mock('../../services/userPreferencesService');
vi.mock('../../utils/enqueueSnackbar');
vi.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));

describe('usePreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch preferences successfully', async () => {
    const fakePrefs = { acceptsSmoker: true };
    (
      userPreferencesService.fetchUserPreferences as jest.Mock
    ).mockResolvedValue({
      data: fakePrefs,
      message: 'OK',
    });

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.preferences).toEqual(fakePrefs);
    expect(enqueue.enqueueSnackbarSuccess).toHaveBeenCalledWith('OK');
  });

  it('should handle fetch preferences error', async () => {
    (
      userPreferencesService.fetchUserPreferences as jest.Mock
    ).mockRejectedValue('Erreur API');

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      'Vous n’avez encore enregistré aucune préférence.'
    );
    expect(enqueue.enqueueSnackbarError).toHaveBeenCalled();
  });

  it('should create preferences successfully', async () => {
    const fakeData = { acceptsSmoker: true };
    (
      userPreferencesService.createUserPreferences as jest.Mock
    ).mockResolvedValue({
      data: fakeData,
      message: 'Préférences créées',
    });

    const { result } = renderHook(() => usePreferences());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.onCreatePreferences(fakeData);
    });

    expect(success).toBe(true);
    expect(result.current.preferences).toEqual(fakeData);
    expect(enqueue.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Préférences créées'
    );
  });

  it('should handle create preferences error', async () => {
    (
      userPreferencesService.createUserPreferences as jest.Mock
    ).mockRejectedValue('Erreur');

    const { result } = renderHook(() => usePreferences());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.onCreatePreferences({
        acceptsSmoker: true,
      });
    });

    expect(success).toBe(false);
    expect(enqueue.enqueueSnackbarError).toHaveBeenCalled();
  });
});

describe('usePreferences updateUserPreferences', () => {
  it('should update preferences successfully', async () => {
    const updatedData = { acceptsSmoker: false };
    (
      userPreferencesService.updateUserPreferences as jest.Mock
    ).mockResolvedValue({
      data: updatedData,
      message: 'Modifié avec succès',
    });

    const { result } = renderHook(() => usePreferences());

    await act(async () => {
      await result.current.onUpdatePreferences(updatedData);
    });

    expect(result.current.preferences).toEqual(updatedData);
    expect(enqueue.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Modifié avec succès'
    );
  });

  it('should handle update preferences error', async () => {
    (
      userPreferencesService.updateUserPreferences as jest.Mock
    ).mockRejectedValue('Erreur');

    const { result } = renderHook(() => usePreferences());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.onUpdatePreferences({
        acceptsSmoker: false,
      });
    });

    expect(success).toBe(false);

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Erreur lors de la mise à jour des préférences'
      );
    });

    expect(enqueue.enqueueSnackbarError).toHaveBeenCalled();
  });
});

describe('usePreferences deleteUserPreferences', () => {
  it('deletes preferences successfully', async () => {
    (
      userPreferencesService.deleteUserPreferences as jest.Mock
    ).mockResolvedValueOnce({
      message: 'Suppression réussie',
    });

    const { result } = renderHook(() => usePreferences());

    const success = await act(
      async () => await result.current.onDeletePreferences()
    );

    expect(success).toBe(true);
    expect(enqueue.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Suppression réussie'
    );
  });

  it('sets error when deleting preferences fails', async () => {
    (
      userPreferencesService.deleteUserPreferences as jest.Mock
    ).mockRejectedValueOnce(new Error('Erreur API'));

    const { result } = renderHook(() => usePreferences());

    const success = await act(
      async () => await result.current.onDeletePreferences()
    );

    expect(success).toBe(false);
    expect(result.current.error).toBe(
      'Erreur lors de la suppression des préférences'
    );
    expect(enqueue.enqueueSnackbarError).toHaveBeenCalled();
  });
});

describe('usePreferences fetchPreferencesById', () => {
  it('returns false and shows error if userId is empty in fetchPreferencesById', async () => {
    const { result } = renderHook(() => usePreferences());

    const success = await act(
      async () => await result.current.fetchPreferencesById('')
    );

    expect(success).toBe(false);
    expect(enqueue.enqueueSnackbarError).toHaveBeenCalledWith(
      'Utilisateur invalide.'
    );
  });

  it('fetches preferences by userId successfully', async () => {
    (
      userPreferencesService.fetchUserPreferencesById as jest.Mock
    ).mockResolvedValueOnce({
      data: { language: 'fr' },
      message: 'Chargement réussi',
    });

    const { result } = renderHook(() => usePreferences());

    const success = await act(
      async () => await result.current.fetchPreferencesById('123')
    );

    expect(success).toBe(true);
    expect(result.current.preferences).toEqual({ language: 'fr' });
    expect(enqueue.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Chargement réussi'
    );
  });

  it('sets error when fetchPreferencesById fails', async () => {
    (
      userPreferencesService.fetchUserPreferencesById as jest.Mock
    ).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePreferences());

    const success = await act(
      async () => await result.current.fetchPreferencesById('123')
    );

    expect(success).toBe(false);
    expect(result.current.error).toBe(
      'Erreur lors du chargement des préférences de l’utilisateur'
    );
    expect(enqueue.enqueueSnackbarError).toHaveBeenCalled();
  });
});

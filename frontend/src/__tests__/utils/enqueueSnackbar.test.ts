// frontend/src/__tests__/utils/enqueueSnackbar.test.ts
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../../utils/enqueueSnackbar';
import { enqueueSnackbar } from 'notistack';
import { extractApiError } from '../../utils/handleApiError';
import { vi } from 'vitest';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

vi.mock('../../utils/handleApiError', () => ({
  extractApiError: vi.fn(),
}));

describe('snackbarUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enqueueSnackbarSuccess appelle enqueueSnackbar avec message et variant success', () => {
    enqueueSnackbarSuccess('Succès !');
    expect(enqueueSnackbar).toHaveBeenCalledWith('Succès !', {
      variant: 'success',
    });
  });

  it('enqueueSnackbarError appelle extractApiError et enqueueSnackbar avec variant error', () => {
    (extractApiError as jest.Mock).mockReturnValue('Erreur personnalisée');
    const fakeError = new Error('Test error');

    enqueueSnackbarError(fakeError);

    expect(extractApiError).toHaveBeenCalledWith(fakeError);
    expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur personnalisée', {
      variant: 'error',
    });
  });
});

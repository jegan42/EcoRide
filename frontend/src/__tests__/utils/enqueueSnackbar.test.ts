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

  it('enqueueSnackbarSuccess calls enqueueSnackbar with message and variant success', () => {
    enqueueSnackbarSuccess('Succès !');
    expect(enqueueSnackbar).toHaveBeenCalledWith('Succès !', {
      variant: 'success',
    });
  });

  it('enqueueSnackbarError calls extractApiError and enqueueSnackbar with variant error', () => {
    (extractApiError as jest.Mock).mockReturnValue('Erreur personnalisée');
    const fakeError = new Error('Test error');

    enqueueSnackbarError(fakeError);

    expect(extractApiError).toHaveBeenCalledWith(fakeError);
    expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur personnalisée', {
      variant: 'error',
    });
  });
});

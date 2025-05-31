// frontend/src/utils/enqueueSnackbar.ts
import { enqueueSnackbar } from 'notistack';
import { extractApiError } from './handleApiError';

export const enqueueSnackbarSuccess = (message: string): void => {
  enqueueSnackbar(message, { variant: 'success' });
};

export const enqueueSnackbarError = (error: unknown): void => {
  enqueueSnackbar(extractApiError(error), { variant: 'error' });
};

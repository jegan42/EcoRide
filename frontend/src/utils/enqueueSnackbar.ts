// frontend/src/utils/enqueueSnackbar.ts

// import { enqueueSnackbar } from 'notistack';
import { extractApiError } from './handleApiError';

export const enqueueSnackbarSuccess = (message: string): void => {
  console.info(message);
  // enqueueSnackbar(message, { variant: 'success' });
};

export const enqueueSnackbarError = (error: unknown): void => {
  console.error(extractApiError(error));
  // enqueueSnackbar(extractApiError(error), { variant: 'error' });
};

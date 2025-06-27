// frontend/src/hooks/useInitApp.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import userService from '../services/userService';
import {
  setAuthLoading,
  setCsrfToken,
  signin,
  signout,
} from '../store/slices/authSlice';
import { getCsrfToken } from '../services/csrfService';
import { useAppSelector } from './useAppSelector';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';

export const useInitApp = (): void => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchCsrf = async (): Promise<void> => {
      try {
        const { message, data } = await getCsrfToken();
        dispatch(setCsrfToken(data));
        enqueueSnackbarSuccess(message);
      } catch (err) {
        enqueueSnackbarError(err);
      }
    };

    void fetchCsrf();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      const initAuth = async (): Promise<void> => {
        dispatch(setAuthLoading(true));
        try {
          if (!isAuthenticated) throw new Error('Utilisateur non connecté');
          const { message, data: user } = await userService.fetchUser();
          dispatch(signin({ user, isAuthenticated: true }));
          enqueueSnackbarSuccess(message);
        } catch {
          dispatch(signout());
        } finally {
          dispatch(setAuthLoading(false));
        }
      };

      void initAuth();
    }
  }, [dispatch, isAuthenticated]);
};

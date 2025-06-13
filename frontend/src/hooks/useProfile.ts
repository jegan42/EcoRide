// frontend/src/hooks/useProfile.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import userService from '../services/userService';
import { signin as signinAction } from '../store/slices/authSlice';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import type { User } from '../types/user';
import type { ProfileFormData } from '../validations/profileSchema';
import { hasRole } from '../utils/hasRole';
import { useAppSelector } from './useAppSelector';

export const useProfile = (): {
  user: Partial<User> | null;
  isDriver: boolean;
  isSubmitting: boolean;
  onUpdateUser: (formData: ProfileFormData) => Promise<boolean>;
} => {
  const { user: getUser } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [user, setUser] = useState<Partial<User> | null>(getUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDriver = user ? hasRole(user, 'driver') : false;

  const onUpdateUser = async (formData: ProfileFormData): Promise<boolean> => {
    if (!user?.id) {
      enqueueSnackbarError("L'utilisateur est invalide.");
      return false;
    }

    setIsSubmitting(true);
    try {
      const { message, data: updatedUser } =
        await userService.updateUser(formData);
      setUser(updatedUser);
      dispatch(signinAction({ user: updatedUser, isAuthenticated: true }));
      enqueueSnackbarSuccess(message);
      return true;
    } catch (error) {
      enqueueSnackbarError(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { user, isDriver, isSubmitting, onUpdateUser };
};

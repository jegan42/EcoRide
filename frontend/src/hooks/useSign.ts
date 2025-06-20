// frontend/src/hooks/useSign.ts
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signin as signinAction } from '../store/slices/authSlice';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import authService from '../services/authService';
import type { SigninFormData } from '../forms/SigninForm';
import type { SignupFormData } from '../forms/SignupForm';

export const useSign = (): {
  signin: boolean;
  setSignin: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignupSubmit: (data: SignupFormData) => Promise<void>;
  handleSigninSubmit: (data: SigninFormData) => Promise<void>;
} => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signin, setSignin] = useState(true);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignupSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      const { message, data: user } = await authService.signup(data);
      dispatch(
        signinAction({
          user,
          isAuthenticated: true,
        })
      );
      enqueueSnackbarSuccess(message);
      void navigate('/');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const handleSigninSubmit = async (data: SigninFormData): Promise<void> => {
    try {
      const { message, data: user } = await authService.signin(data);
      dispatch(signinAction({ user, isAuthenticated: true }));
      enqueueSnackbarSuccess(message);
      void navigate('/');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  return { signin, setSignin, handleSignupSubmit, handleSigninSubmit };
};

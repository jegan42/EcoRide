// frontend/src/hooks/useFirebaseLogin.ts
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';
import { useAppSelector } from './useAppSelector';
import axios from 'axios';
import { API_URL } from '../constants/api';

export const useFirebaseLogin = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    const connectFirebase = async (): Promise<void> => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/firebase-token`, {
          withCredentials: true,
        });
        const firebaseToken = data.data.token;
        await signInWithCustomToken(auth, firebaseToken);
        console.log('[Firebase] Connecté avec succès');
      } catch (err) {
        setIsLoading(true);
        console.error('[Firebase] Échec de connexion :', err);
      } finally {
        setIsLoading(false);
      }
    };

    void connectFirebase();
  }, [user?.id]);

  return isLoading;
};

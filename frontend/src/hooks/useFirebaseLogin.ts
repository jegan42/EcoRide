// frontend/src/hooks/useFirebaseLogin.ts
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';
import { useAppSelector } from './useAppSelector';
import axios from 'axios';
import { API_URL } from '../constants/api';

export const useFirebaseLogin = (): void => {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const connectFirebase = async (): Promise<void> => {
      if (!user?.id) return;

      try {
        const { data } = await axios.get(`${API_URL}/firebase-token`, {
          withCredentials: true,
        });
        const firebaseToken = data.data.token;
        await signInWithCustomToken(auth, firebaseToken);
        console.log('[Firebase] Connecté avec succès');
      } catch (err) {
        console.error('[Firebase] Échec de connexion :', err);
      }
    };

    void connectFirebase();
  }, [user?.id]);
};

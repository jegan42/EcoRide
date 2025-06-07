// frontend/src/hooks/useIsDriver.ts
import { useAppSelector } from './useAppSelector';
import { hasRole } from '../utils/hasRole';

export const useIsDriver = (): boolean => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth || !auth.user || !auth.user.role) return false;
  return hasRole(auth.user, 'driver');
};

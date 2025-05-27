// frontend/src/hooks/useAppSelector.tsx
import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

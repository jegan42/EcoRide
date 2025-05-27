// Ce hook simplifie l'usage de useSelector avec typage Redux
import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store.ts';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

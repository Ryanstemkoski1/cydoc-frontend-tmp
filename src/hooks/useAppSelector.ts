import { useSelector } from 'react-redux';
import type { RootState } from '@redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector = useSelector.withTypes<RootState>();

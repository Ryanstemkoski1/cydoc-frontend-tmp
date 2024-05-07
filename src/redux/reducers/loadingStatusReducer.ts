import { LoadingStatusActionTypes } from '@redux/actions/loadingStatusActions';
import { LOADING_STATUS } from '../actions/actionTypes';

export const initialLoadingStatus = false;

export function loadingStatusReducer(
    state = initialLoadingStatus,
    action: LoadingStatusActionTypes
): boolean {
    switch (action.type) {
        case LOADING_STATUS.SET_LOADING_STATUS:
            return action.payload.value;
        case LOADING_STATUS.TOGGLE_LOADING_STATUS:
            return !state;
        default:
            return state;
    }
}

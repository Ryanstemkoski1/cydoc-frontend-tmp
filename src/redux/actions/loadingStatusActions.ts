import { UnknownAction } from 'redux';
import { LOADING_STATUS } from './actionTypes';

export interface SetLoadingStatus extends UnknownAction {
    type: LOADING_STATUS.SET_LOADING_STATUS;
    payload: {
        value: boolean;
    };
}

export interface ToggleLoadingState extends UnknownAction {
    type: LOADING_STATUS.TOGGLE_LOADING_STATUS;
}

export function setLoadingStatus(value: boolean): SetLoadingStatus {
    return {
        type: LOADING_STATUS.SET_LOADING_STATUS,
        payload: {
            value,
        },
    };
}

export function toggleLoadingState(): ToggleLoadingState {
    return {
        type: LOADING_STATUS.TOGGLE_LOADING_STATUS,
    };
}

export type LoadingStatusActionTypes = SetLoadingStatus | ToggleLoadingState;

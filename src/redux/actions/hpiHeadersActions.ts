import { HpiHeadersState } from 'redux/reducers/hpiHeadersReducer';
import { HPI_HEADER_ACTION } from './actionTypes';

export interface SaveHpiHeaderAction {
    type: HPI_HEADER_ACTION.SAVE_HPI_HEADER;
    payload: {
        data: HpiHeadersState;
    };
}

export function saveHpiHeader(data: HpiHeadersState): SaveHpiHeaderAction {
    return {
        type: HPI_HEADER_ACTION.SAVE_HPI_HEADER,
        payload: {
            data,
        },
    };
}

export type HpiHeaderActionTypes = SaveHpiHeaderAction;

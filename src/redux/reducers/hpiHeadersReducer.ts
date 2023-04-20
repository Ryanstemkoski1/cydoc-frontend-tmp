import { HPI_HEADER_ACTION } from 'redux/actions/actionTypes';
import { HpiHeaderActionTypes } from 'redux/actions/hpiHeadersActions';

export interface HpiHeadersState {
    bodySystems: {
        [bodySystem: string]: string[];
    };
    parentNodes: {
        [chiefComplaint: string]: {
            [chiefComplaintCode: string]: string;
            patientView: string;
        };
    };
}

export const initialHpiHeadersState: HpiHeadersState = {
    bodySystems: {},
    parentNodes: {},
};

export function hpiHeadersReducer(
    state = initialHpiHeadersState,
    action: HpiHeaderActionTypes
): HpiHeadersState {
    switch (action.type) {
        case HPI_HEADER_ACTION.SAVE_HPI_HEADER: {
            const { data } = action.payload;
            return data;
        }

        default:
            return state;
    }
}

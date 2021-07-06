import { SURGICAL_HISTORY_ACTION } from '../actions/actionTypes';
import { SurgicalHistoryActionTypes } from '../actions/surgicalHistoryActions';
import { v4 } from 'uuid';

export interface SurgicalHistoryState {
    [index: string]: SurgicalHistoryItem;
}

export interface SurgicalHistoryItem {
    procedure: string;
    year: number;
    comments: string;
}

export const initialSurgicalHistoryState: SurgicalHistoryState = {
    [v4()]: { procedure: '', year: -1, comments: '' },
    [v4()]: { procedure: '', year: -1, comments: '' },
    [v4()]: { procedure: '', year: -1, comments: '' },
};

export function surgicalHistoryReducer(
    state = initialSurgicalHistoryState,
    action: SurgicalHistoryActionTypes
): SurgicalHistoryState {
    switch (action.type) {
        case SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE: {
            const { index, newProcedure } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    procedure: newProcedure,
                },
            };
        }
        case SURGICAL_HISTORY_ACTION.UPDATE_YEAR: {
            const { index, newYear } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    year: newYear,
                },
            };
        }
        case SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS: {
            const { index, newComments } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    comments: newComments,
                },
            };
        }
        case SURGICAL_HISTORY_ACTION.ADD_PROCEDURE: {
            // Adds a default (blank, no buttons selected) procedure
            // NOTE: Must change default condition initialization accordingly here if Surgical History state structure changes
            return {
                ...state,
                [v4()]: {
                    procedure: '',
                    year: -1,
                    comments: '',
                },
            };
        }
        case SURGICAL_HISTORY_ACTION.DELETE_PROCEDURE: {
            const { index } = action.payload;
            const { [index]: deleted, ...newState } = state;
            return newState;
        }
        default:
            return state;
    }
}

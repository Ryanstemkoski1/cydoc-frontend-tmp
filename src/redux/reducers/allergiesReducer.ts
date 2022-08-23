import { ALLERGIES_ACTION } from '../actions/actionTypes';
import { AllergiesActionTypes } from '../actions/allergiesActions';
import { v4 } from 'uuid';

export interface AllergiesState {
    [index: string]: AllergiesItem;
}

export interface AllergiesItem {
    incitingAgent: string;
    reaction: string;
    comments: string;
    id: string;
}

export const initialAllergiesState: AllergiesState = {
    [v4()]: { incitingAgent: '', reaction: '', comments: '', id: '' },
    [v4()]: { incitingAgent: '', reaction: '', comments: '', id: '' },
    [v4()]: { incitingAgent: '', reaction: '', comments: '', id: '' },
};

export function allergiesReducer(
    state = initialAllergiesState,
    action: AllergiesActionTypes
): AllergiesState {
    switch (action.type) {
        case ALLERGIES_ACTION.UPDATE_INCITING_AGENT: {
            const { index, newIncitingAgent } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    incitingAgent: newIncitingAgent,
                },
            };
        }
        case ALLERGIES_ACTION.UPDATE_REACTION: {
            const { index, newReaction } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    reaction: newReaction,
                },
            };
        }
        case ALLERGIES_ACTION.UPDATE_COMMENTS: {
            const { index, newComments } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    comments: newComments,
                },
            };
        }
        case ALLERGIES_ACTION.UPDATE_ID: {
            const { index, id } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    id: id,
                },
            };
        }
        case ALLERGIES_ACTION.ADD_ALLERGY: {
            return {
                ...state,
                [v4()]: {
                    incitingAgent: '',
                    reaction: '',
                    comments: '',
                    id: '',
                },
            };
        }
        case ALLERGIES_ACTION.DELETE_ALLERGY: {
            const { index } = action.payload;
            const { [index]: deleted, ...newState } = state;
            return newState;
        }
        default:
            return state;
    }
}

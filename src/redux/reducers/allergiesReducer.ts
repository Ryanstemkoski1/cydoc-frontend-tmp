import { ALLERGIES_ACTION } from '../actions/actionTypes';
import { AllergiesActionTypes } from '../actions/allergiesActions';
import { v4 } from 'uuid';

export interface AllergiesState {
    hasAllergies: boolean | null;
    elements: AllergiesElements;
}

export interface AllergiesElements {
    [index: string]: AllergiesItem;
}

export interface AllergiesItem {
    incitingAgent: string;
    reaction: string;
    comments: string;
    id: string;
}

export const initialAllergiesState: AllergiesState = {
    hasAllergies: null,
    elements: {},
};

export function allergiesReducer(
    state = initialAllergiesState,
    action: AllergiesActionTypes
): AllergiesState {
    switch (action.type) {
        case ALLERGIES_ACTION.HAS_ALLERGIES: {
            return {
                ...state,
                hasAllergies: action.payload.hasAllergies,
            };
        }
        case ALLERGIES_ACTION.UPDATE_INCITING_AGENT: {
            const { index, newIncitingAgent } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    incitingAgent: newIncitingAgent,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case ALLERGIES_ACTION.UPDATE_REACTION: {
            const { index, newReaction } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    reaction: newReaction,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case ALLERGIES_ACTION.UPDATE_COMMENTS: {
            const { index, newComments } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    comments: newComments,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case ALLERGIES_ACTION.UPDATE_ID: {
            const { index, id } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    id: id,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case ALLERGIES_ACTION.ADD_ALLERGY: {
            const newElements = {
                ...state.elements,
                [v4()]: {
                    incitingAgent: '',
                    reaction: '',
                    comments: '',
                    id: '',
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case ALLERGIES_ACTION.DELETE_ALLERGY: {
            const { index } = action.payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [index]: deleted, ...newElements } = state.elements;
            const newState = {
                ...state,
                elements: newElements,
            };
            return newState;
        }
        default:
            return state;
    }
}

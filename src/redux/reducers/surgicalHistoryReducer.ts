import { SURGICAL_HISTORY_ACTION } from '../actions/actionTypes';
import { SurgicalHistoryActionTypes } from '../actions/surgicalHistoryActions';
import { YesNoResponse } from '@constants/enums';

export interface SurgicalHistoryState {
    hasSurgicalHistory: boolean | null;
    elements: SurgicalHistoryElements;
}

export interface SurgicalHistoryElements {
    [index: string]: SurgicalHistoryItem;
}

export interface SurgicalHistoryItem {
    procedure: string;
    hasHadSurgery: YesNoResponse;
    year: number;
    comments: string;
}

export const initialSurgicalHistoryState: SurgicalHistoryState = {
    hasSurgicalHistory: null,
    elements: {},
};

export function surgicalHistoryReducer(
    state = initialSurgicalHistoryState,
    action: SurgicalHistoryActionTypes
): SurgicalHistoryState {
    switch (action.type) {
        case SURGICAL_HISTORY_ACTION.HAS_SURGICAL_HISTORY: {
            return {
                ...state,
                hasSurgicalHistory: action.payload.hasSurgicalHistory,
            };
        }
        case SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE: {
            const { index, newProcedure } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    procedure: newProcedure,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case SURGICAL_HISTORY_ACTION.TOGGLE_OPTION: {
            const { index, optionSelected } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    hasHadSurgery:
                        state.elements[index].hasHadSurgery == optionSelected
                            ? YesNoResponse.None
                            : optionSelected,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case SURGICAL_HISTORY_ACTION.UPDATE_YEAR: {
            const { index, newYear } = action.payload;
            const newElements = {
                ...state.elements,
                [index]: {
                    ...state.elements[index],
                    year: newYear,
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        case SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS: {
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
        case SURGICAL_HISTORY_ACTION.DELETE_PROCEDURE: {
            const { index } = action.payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [index]: deleted, ...newElements } = state.elements;
            const newState = {
                ...state,
                elements: newElements,
            };
            return newState;
        }
        case SURGICAL_HISTORY_ACTION.ADD_PSH_POP_OPTIONS: {
            /* 
            For the POP component in the HPI state. Since the HPI
            state saves the condition IDs for the PSH POP inputs, the
            condition ID must be created in the component before being
            saved to the HPI and Surgical History states.
            */
            const { conditionIndex, conditionName } = action.payload;
            const newElements = {
                ...state.elements,
                [conditionIndex]: {
                    hasHadSurgery:
                        conditionName == ''
                            ? YesNoResponse.Yes
                            : YesNoResponse.None,
                    procedure: conditionName,
                    year: -1,
                    comments: '',
                },
            };
            return {
                ...state,
                elements: newElements,
            };
        }
        default:
            return state;
    }
}

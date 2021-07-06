import { MEDICAL_HISTORY_ACTION } from '../actions/actionTypes';
import { MedicalHistoryActionTypes } from '../actions/medicalHistoryActions';
import { YesNoResponse } from '../../constants/enums';
import { v4 } from 'uuid';

export interface MedicalHistoryState {
    [index: string]: MedicalHistoryItem;
}

export interface MedicalHistoryItem {
    condition: string;
    hasBeenAfflicted: YesNoResponse;
    startYear: number;
    hasConditionResolved: YesNoResponse;
    endYear: number;
    comments: string;
}

export const initialMedicalHistoryState: MedicalHistoryState = {
    [v4()]: {
        condition: 'Type II Diabetes',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    [v4()]: {
        condition: 'Myocardial Infarction',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    [v4()]: {
        condition: 'Hypertension',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    [v4()]: {
        condition: 'Hypercholesteremia',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    [v4()]: {
        condition: 'Depression',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    [v4()]: {
        condition: 'HIV',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
};

export function medicalHistoryReducer(
    state = initialMedicalHistoryState,
    action: MedicalHistoryActionTypes
): MedicalHistoryState {
    switch (action.type) {
        case MEDICAL_HISTORY_ACTION.TOGGLE_OPTION: {
            const { index, optionSelected } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    hasBeenAfflicted:
                        state[index].hasBeenAfflicted == optionSelected
                            ? YesNoResponse.None
                            : optionSelected,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_NAME: {
            const { index, newName } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    condition: newName,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR: {
            const { index, newStartYear } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    startYear: newStartYear,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED: {
            const { index, optionSelected } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    hasConditionResolved:
                        state[index].hasConditionResolved == optionSelected
                            ? YesNoResponse.None
                            : optionSelected,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR: {
            const { index, newEndYear } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    endYear: newEndYear,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.UPDATE_COMMENTS: {
            const { index, newComments } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    comments: newComments,
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.ADD_CONDITION: {
            // Adds a default (blank, no buttons selected) condition
            // NOTE: Must change default condition initialization accordingly here if Medical History state structure changes
            return {
                ...state,
                [v4()]: {
                    condition: '',
                    hasBeenAfflicted: YesNoResponse.None,
                    startYear: -1,
                    hasConditionResolved: YesNoResponse.None,
                    endYear: -1,
                    comments: '',
                },
            };
        }
        case MEDICAL_HISTORY_ACTION.ADD_PMH_POP_OPTIONS: {
            const { conditionIndex, conditionName } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    condition: conditionName,
                    hasBeenAfflicted: YesNoResponse.None,
                    startYear: -1,
                    hasConditionResolved: YesNoResponse.None,
                    endYear: -1,
                    comments: '',
                },
            };
        }
        default:
            return state;
    }
}

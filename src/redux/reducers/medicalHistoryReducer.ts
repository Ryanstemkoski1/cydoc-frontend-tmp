import { MEDICAL_HISTORY_ACTION } from '../actions/actionTypes';
import { MedicalHistoryActionTypes } from '../actions/medicalHistoryActions';
import { YesNoResponse } from '@constants/enums';

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

export const initialMedicalHistoryState: MedicalHistoryState = {};

export function medicalHistoryReducer(
    state = initialMedicalHistoryState,
    action: MedicalHistoryActionTypes
): MedicalHistoryState {
    switch (action.type) {
        case MEDICAL_HISTORY_ACTION.DELETE_CONDITION: {
            const { conditionIndex } = action.payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [conditionIndex]: deleted, ...newState } = state;
            return newState;
        }
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
        case MEDICAL_HISTORY_ACTION.ADD_PMH_POP_OPTIONS: {
            /*
            For the POP component used in HPI. Since the response in 
            the HPI state requires the condition ID/index to be saved, 
            the ID is created in the component and saved to both the
            medical history and HPI states at the same time. A new input
            is saved with the new condition ID.
            */
            const { conditionIndex, conditionName } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    condition: conditionName,
                    hasBeenAfflicted:
                        conditionName == ''
                            ? YesNoResponse.Yes
                            : YesNoResponse.None,
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

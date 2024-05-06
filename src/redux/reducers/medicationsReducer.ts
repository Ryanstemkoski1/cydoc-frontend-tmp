import { YesNoResponse } from 'constants/enums';
import { MEDICATIONS_ACTION } from '../actions/actionTypes';
import { MedicationsActionTypes } from '../actions/medicationsActions';

export interface MedicationsState {
    [index: string]: MedicationsItem;
}

export interface MedicationsItem {
    drugName: string;
    startYear: number;
    isCurrentlyTaking: YesNoResponse;
    endYear: number;
    schedule: string;
    dose: string;
    reasonForTaking: string;
    sideEffects: string[];
    comments: string;
}

export const initialMedicationsState: MedicationsState = {};

export function medicationsReducer(
    state = initialMedicationsState,
    action: MedicationsActionTypes
): MedicationsState {
    switch (action.type) {
        case MEDICATIONS_ACTION.UPDATE_DRUG_NAME: {
            const { index, newDrugName } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    drugName: newDrugName,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_START_YEAR: {
            const { index, newStartYear } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    startYear: newStartYear,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING: {
            const { index, optionSelected } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    isCurrentlyTaking:
                        state[index].isCurrentlyTaking == optionSelected
                            ? YesNoResponse.None
                            : optionSelected,
                    endYear: -1,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_END_YEAR: {
            const { index, newEndYear } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    endYear: newEndYear,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_SCHEDULE: {
            const { index, newSchedule } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    schedule: newSchedule,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_DOSE: {
            const { index, newDose } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    dose: newDose,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING: {
            const { index, newReasonForTaking } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    reasonForTaking: newReasonForTaking,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS: {
            const { index, newSideEffects } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    sideEffects: newSideEffects,
                },
            };
        }
        case MEDICATIONS_ACTION.UPDATE_COMMENTS: {
            const { index, newComments } = action.payload;
            return {
                ...state,
                [index]: {
                    ...state[index],
                    comments: newComments,
                },
            };
        }
        case MEDICATIONS_ACTION.DELETE_MEDICATION: {
            const { index } = action.payload;
            const { [index]: deleted, ...newState } = state;
            return newState;
        }

        case MEDICATIONS_ACTION.ADD_MEDS_POP_OPTION: {
            /*
            For the POP response type in the HPI section. 
            HPI state saves the response for the node with 
            the MEDS-POP question type, so the medications
            ID must be first indicated in the component 
            before being saved to the medications state as 
            a new entry and the HPI state in a list of IDs.
            */
            const { medIndex, medName } = action.payload;
            return {
                ...state,
                [medIndex]: {
                    drugName: medName,
                    startYear: -1,
                    isCurrentlyTaking:
                        medName == '' ? YesNoResponse.Yes : YesNoResponse.None,
                    endYear: -1,
                    schedule: '',
                    dose: '',
                    reasonForTaking: '',
                    sideEffects: [],
                    comments: '',
                },
            };
        }

        default:
            return state;
    }
}

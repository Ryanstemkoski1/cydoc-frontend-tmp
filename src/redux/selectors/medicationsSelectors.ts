import { CurrentNoteState } from '../reducers';
import {
    MedicationsState,
    MedicationsItem,
} from '../reducers/medicationsReducer';

export function selectMedicationsState(
    state: CurrentNoteState
): MedicationsState {
    return state.medications;
}

export function selectMedicationsValues(
    state: CurrentNoteState
): MedicationsItem[] {
    const medicationsState = state.medications;
    return Object.values(medicationsState);
}

export function selectMedicationsEntries(
    state: CurrentNoteState
): [string, MedicationsItem][] {
    return Object.entries(state.medications);
}

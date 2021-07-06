import { CurrentNoteState } from '../reducers';
import {
    MedicalHistoryState,
    MedicalHistoryItem,
} from '../reducers/medicalHistoryReducer';

export function selectMedicalHistoryState(
    state: CurrentNoteState
): MedicalHistoryState {
    return state.medicalHistory;
}

export function selectMedicalHistory(
    state: CurrentNoteState
): MedicalHistoryItem[] {
    const medicalHistoryState = state.medicalHistory;
    return Object.values(medicalHistoryState);
}

export function selectMedicalHistoryItem(
    state: CurrentNoteState,
    index: string
): MedicalHistoryItem {
    const medicalHistoryState = state.medicalHistory;
    return medicalHistoryState[index];
}

import { CurrentNoteState } from 'redux/reducers';
import {
    AlcoholState,
    TobaccoState,
    RecreationalDrugsState,
} from 'redux/reducers/socialHistoryReducer';

export interface SocialHistorySecondaryFieldsState {
    livingSituation: string;
    employment: string;
    diet: string;
    exercise: string;
}

export function selectAlcoholState(state: CurrentNoteState): AlcoholState {
    return state.socialHistory.alcohol;
}

export function selectTobaccoState(state: CurrentNoteState): TobaccoState {
    return state.socialHistory.tobacco;
}

export function selectRecreationalDrugsState(
    state: CurrentNoteState
): RecreationalDrugsState {
    return state.socialHistory.recreationalDrugs;
}

export function selectSecondaryFieldsState(
    state: CurrentNoteState
): SocialHistorySecondaryFieldsState {
    const socialHistoryState = state.socialHistory;
    return {
        livingSituation: socialHistoryState.livingSituation,
        employment: socialHistoryState.employment,
        diet: socialHistoryState.diet,
        exercise: socialHistoryState.exercise,
    };
}

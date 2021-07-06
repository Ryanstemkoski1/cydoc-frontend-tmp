import { CurrentNoteState } from '../reducers';
import { ReviewOfSystemsState } from '../reducers/reviewOfSystemsReducer';

export function selectReviewOfSystemsState(
    state: CurrentNoteState
): ReviewOfSystemsState {
    return state.reviewOfSystems;
}

export function selectReviewOfSystemsCategories(
    state: CurrentNoteState
): string[] {
    return Object.keys(state.reviewOfSystems);
}

export function selectReviewOfSystemsOptions(
    state: CurrentNoteState,
    category: string
): string[] {
    if (!state.reviewOfSystems[category]) {
        throw new Error(
            `Category ${category} does not exist in Review of Systems!`
        );
    }
    return Object.keys(state.reviewOfSystems[category]);
}

export function selectReviewOfSystemsYesOrNo(
    state: CurrentNoteState,
    category: string,
    option: string
) {
    if (!state.reviewOfSystems[category]) {
        throw new Error(
            `Category ${category} does not exist in Review of Systems!`
        );
    } else if (!state.reviewOfSystems[category][option]) {
        throw new Error(
            `Option ${option} does not exist in category ${category} in Review of Systems!`
        );
    }
    return state.reviewOfSystems[category][option];
}

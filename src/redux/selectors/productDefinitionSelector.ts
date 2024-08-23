import { CurrentNoteState } from '@redux/reducers';

export function selectProductDefinitions(state: CurrentNoteState) {
    return state?.productDefinition?.definitions;
}

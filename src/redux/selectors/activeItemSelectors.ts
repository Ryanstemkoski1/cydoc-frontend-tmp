import { CurrentNoteState } from 'redux/reducers';

export function selectActiveItem(state: CurrentNoteState) {
    return state.activeItem.activeItem;
}

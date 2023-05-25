import { CurrentNoteState } from 'redux/reducers';
import { displayedNodesState } from 'redux/reducers/displayedNodesReducer';

export function selectDisplayedNodes(
    state: CurrentNoteState
): displayedNodesState {
    return state.displayedNodes;
}

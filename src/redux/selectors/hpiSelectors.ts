import { CurrentNoteState } from 'redux/reducers';
import { HpiState } from 'redux/reducers/hpiReducer';

export function selectHpiState(state: CurrentNoteState): HpiState {
    return state.hpi;
}

import {
    MurmursWidgetItemState,
    MurmursWidgetState,
} from 'redux/reducers/widgetReducers/murmurswidgetReducer';
import { CurrentNoteState } from '../../reducers';

export function selectMurmursWidgetState(
    state: CurrentNoteState
): MurmursWidgetState {
    return state.physicalExam.widgets.murmurs;
}

export function selectMurmursWidgetItem(
    state: CurrentNoteState,
    id: string
): MurmursWidgetItemState {
    return state.physicalExam.widgets.murmurs[id];
}

export function selectMurmursWidgetSpecificInfo(
    state: CurrentNoteState,
    id: string
): NonNullable<MurmursWidgetItemState['specificMurmurInfo']> {
    const specificInfo =
        state.physicalExam.widgets.murmurs[id].specificMurmurInfo;
    if (specificInfo === undefined) {
        throw new Error(`Error: specificInfo not defined for MurmurItem ${id}`);
    } else {
        return specificInfo;
    }
}

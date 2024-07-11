import {
    PulsesWidgetItemState,
    PulsesWidgetState,
} from '@redux/reducers/widgetReducers/pulsesWidgetReducer';
import { CurrentNoteState } from '../../reducers';

export function selectPulsesWidgetState(
    state: CurrentNoteState
): PulsesWidgetState {
    return state.physicalExam.widgets.pulses;
}

export function selectPulsesWidgetItem(
    state: CurrentNoteState,
    id: string
): PulsesWidgetItemState {
    return state.physicalExam.widgets.pulses[id];
}

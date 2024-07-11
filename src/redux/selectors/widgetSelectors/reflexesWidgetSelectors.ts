import {
    ReflexesWidgetItemState,
    ReflexesWidgetState,
} from '@redux/reducers/widgetReducers/reflexesWidgetReducer';
import { CurrentNoteState } from '../../reducers';

export function selectReflexesWidgetState(
    state: CurrentNoteState
): ReflexesWidgetState {
    return state.physicalExam.widgets.reflexes;
}

export function selectReflexesWidgetItem(
    state: CurrentNoteState,
    id: string
): ReflexesWidgetItemState {
    return state.physicalExam.widgets.reflexes[id];
}

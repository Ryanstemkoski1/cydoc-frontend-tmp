import {
    LungsWidgetSection,
    LungsWidgetState,
} from '@redux/reducers/widgetReducers/lungsWidgetReducer';
import { CurrentNoteState } from '../../reducers';

export function selectLungsWidgetState(
    state: CurrentNoteState
): LungsWidgetState {
    return state.physicalExam.widgets.lungs;
}

export function selectLungsWidgetSection(
    state: CurrentNoteState,
    section: keyof LungsWidgetState
): LungsWidgetSection {
    return state.physicalExam.widgets.lungs[section];
}

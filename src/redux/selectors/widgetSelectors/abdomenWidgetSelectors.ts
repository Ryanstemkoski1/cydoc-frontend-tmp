import {
    AbdomenWidgetSection,
    AbdomenWidgetState,
} from 'redux/reducers/widgetReducers/abdomenWidgetReducer';
import { CurrentNoteState } from '../../reducers';

export function selectAbdomenWidgetState(
    state: CurrentNoteState
): AbdomenWidgetState {
    return state.physicalExam.widgets.abdomen;
}

export function selectAbdomenWidgetSection(
    state: CurrentNoteState,
    section: keyof AbdomenWidgetState
): AbdomenWidgetSection {
    return state.physicalExam.widgets.abdomen[section];
}

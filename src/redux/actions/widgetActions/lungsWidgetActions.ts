import {
    LungsWidgetSection,
    LungsWidgetState,
} from 'redux/reducers/widgetReducers/lungsWidgetReducer';
import { LUNGS_WIDGET_ACTION } from '../actionTypes';

export interface ToggleLungsWidgetSectionAction {
    type: LUNGS_WIDGET_ACTION.TOGGLE_LUNGS_WIDGET_SECTION;
    payload: {
        section: keyof LungsWidgetState;
        field: keyof LungsWidgetSection;
    };
}

export const toggleLungsWidgetSection = (
    section: keyof LungsWidgetState,
    field: keyof LungsWidgetSection
): ToggleLungsWidgetSectionAction => ({
    type: LUNGS_WIDGET_ACTION.TOGGLE_LUNGS_WIDGET_SECTION,
    payload: {
        section,
        field,
    },
});

export type LungsWidgetActionTypes = ToggleLungsWidgetSectionAction;

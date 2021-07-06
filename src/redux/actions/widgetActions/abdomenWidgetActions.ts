import {
    AbdomenWidgetSection,
    AbdomenWidgetState,
} from 'redux/reducers/widgetReducers/abdomenWidgetReducer';
import { ABDOMEN_WIDGET_ACTION } from '../actionTypes';

export interface ToggleAbdomenWidgetSectionAction {
    type: ABDOMEN_WIDGET_ACTION.TOGGLE_ABDOMEN_WIDGET_SECTION;
    payload: {
        section: keyof AbdomenWidgetState;
        field: keyof AbdomenWidgetSection;
    };
}

export const toggleAbdomenWidgetSection = (
    section: keyof AbdomenWidgetState,
    field: keyof AbdomenWidgetSection
): ToggleAbdomenWidgetSectionAction => ({
    type: ABDOMEN_WIDGET_ACTION.TOGGLE_ABDOMEN_WIDGET_SECTION,
    payload: {
        section,
        field,
    },
});

export type AbdomenWidgetActionTypes = ToggleAbdomenWidgetSectionAction;

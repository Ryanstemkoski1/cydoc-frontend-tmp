import { ABDOMEN_WIDGET_ACTION } from '@redux/actions/actionTypes';
import { AbdomenWidgetActionTypes } from '@redux/actions/widgetActions/abdomenWidgetActions';

export interface AbdomenWidgetState {
    rightUpperQuadrant: AbdomenWidgetSection;
    leftUpperQuadrant: AbdomenWidgetSection;
    rightLowerQuadrant: AbdomenWidgetSection;
    leftLowerQuadrant: AbdomenWidgetSection;
}

export interface AbdomenWidgetSection {
    tenderness: boolean;
    rebound: boolean;
    guarding: boolean;
}

export const initialAbdomenWidgetState: AbdomenWidgetState = {
    rightUpperQuadrant: {
        tenderness: false,
        rebound: false,
        guarding: false,
    },
    leftUpperQuadrant: {
        tenderness: false,
        rebound: false,
        guarding: false,
    },
    rightLowerQuadrant: {
        tenderness: false,
        rebound: false,
        guarding: false,
    },
    leftLowerQuadrant: {
        tenderness: false,
        rebound: false,
        guarding: false,
    },
};

export function abdomenWidgetReducer(
    state = initialAbdomenWidgetState,
    action: AbdomenWidgetActionTypes
): AbdomenWidgetState {
    const { section, field } = action.payload || {};
    switch (action.type) {
        case ABDOMEN_WIDGET_ACTION.TOGGLE_ABDOMEN_WIDGET_SECTION:
            return {
                ...state,
                [section]: {
                    ...state[section],
                    [field]: !state[section][field],
                },
            };
        default:
            return state;
    }
}

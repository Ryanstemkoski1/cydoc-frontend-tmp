import { LUNGS_WIDGET_ACTION } from '@redux/actions/actionTypes';
import { LungsWidgetActionTypes } from '@redux/actions/widgetActions/lungsWidgetActions';

export interface LungsWidgetState {
    leftUpperLobe: LungsWidgetSection;
    rightUpperLobe: LungsWidgetSection;
    lingula: LungsWidgetSection;
    rightMiddleLobe: LungsWidgetSection;
    leftLowerLobe: LungsWidgetSection;
    rightLowerLobe: LungsWidgetSection;
}

export interface LungsWidgetSection {
    wheezes: boolean;
    rales: boolean;
    rhonchi: boolean;
    bronchialBreathSounds: boolean;
    egophony: boolean;
    stridor: boolean;
    whistling: boolean;
    vesicularBreathSounds: boolean;
}

export const initialLungsWidgetState: LungsWidgetState = {
    leftUpperLobe: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
    rightUpperLobe: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
    lingula: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
    rightMiddleLobe: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
    leftLowerLobe: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
    rightLowerLobe: {
        wheezes: false,
        rales: false,
        rhonchi: false,
        bronchialBreathSounds: false,
        egophony: false,
        stridor: false,
        whistling: false,
        vesicularBreathSounds: false,
    },
};

export function lungsWidgetReducer(
    state = initialLungsWidgetState,
    action: LungsWidgetActionTypes
): LungsWidgetState {
    const { section, field } = action.payload || {};
    switch (action.type) {
        case LUNGS_WIDGET_ACTION.TOGGLE_LUNGS_WIDGET_SECTION:
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

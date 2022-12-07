import {
    DiastolicMurmur,
    MurmurAdditionalFeature,
    MurmurLocation,
    MurmurPitch,
    MurmurQuality,
    MurmurRadiation,
    Phase,
    SystolicMurmur,
} from 'redux/reducers/widgetReducers/murmurswidgetReducer';
import { MURMURS_WIDGET_ACTION } from '../actionTypes';

export interface AddMurmursWidgetItemAction {
    type: MURMURS_WIDGET_ACTION.ADD_MURMURS_WIDGET_ITEM;
    payload: Record<string, never>;
}

export const addMurmursWidgetItem = (): AddMurmursWidgetItemAction => ({
    type: MURMURS_WIDGET_ACTION.ADD_MURMURS_WIDGET_ITEM,
    payload: {},
});

export interface UpdatePhaseAction {
    type: MURMURS_WIDGET_ACTION.UPDATE_PHASE;
    payload: {
        id: string;
        newPhase: Phase;
    };
}

export const updatePhase = (
    id: string,
    newPhase: Phase
): UpdatePhaseAction => ({
    type: MURMURS_WIDGET_ACTION.UPDATE_PHASE,
    payload: {
        id,
        newPhase,
    },
});

export interface ToggleCrescendoDecrescendoAction {
    type: MURMURS_WIDGET_ACTION.TOGGLE_CRESCENDO_DECRESCENDO;
    payload: {
        id: string;
        crescendo: boolean;
        decrescendo: boolean;
    };
}

export const toggleCrescendoDecrescendo = (
    id: string,
    crescendo = false,
    decrescendo = false
): ToggleCrescendoDecrescendoAction => ({
    type: MURMURS_WIDGET_ACTION.TOGGLE_CRESCENDO_DECRESCENDO,
    payload: {
        id,
        crescendo,
        decrescendo,
    },
});

export interface UpdateBestHeardAtAction {
    type: MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT;
    payload: {
        id: string;
        newBestHeardAt: MurmurLocation;
    };
}

export const updateBestHeardAt = (
    id: string,
    newBestHeardAt: MurmurLocation
): UpdateBestHeardAtAction => ({
    type: MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT,
    payload: {
        id,
        newBestHeardAt,
    },
});

export interface UpdateIntensityAction {
    type: MURMURS_WIDGET_ACTION.UPDATE_INTENSITY;
    payload: {
        id: string;
        newIntensity: 1 | 2 | 3 | 4 | 5;
    };
}

export const updateIntensity = (
    id: string,
    newIntensity: 1 | 2 | 3 | 4 | 5
): UpdateIntensityAction => ({
    type: MURMURS_WIDGET_ACTION.UPDATE_INTENSITY,
    payload: {
        id,
        newIntensity,
    },
});

export interface UpdatePitchAction {
    type: MURMURS_WIDGET_ACTION.UPDATE_PITCH;
    payload: {
        id: string;
        newPitch: MurmurPitch;
    };
}

export const updatePitch = (
    id: string,
    newPitch: MurmurPitch
): UpdatePitchAction => ({
    type: MURMURS_WIDGET_ACTION.UPDATE_PITCH,
    payload: {
        id,
        newPitch,
    },
});

export interface ToggleQualityAction {
    type: MURMURS_WIDGET_ACTION.TOGGLE_QUALITY;
    payload: {
        id: string;
        field: MurmurQuality;
    };
}

export const toggleQuality = (
    id: string,
    field: MurmurQuality
): ToggleQualityAction => ({
    type: MURMURS_WIDGET_ACTION.TOGGLE_QUALITY,
    payload: {
        id,
        field,
    },
});

export interface ToggleSpecificMurmurInfoAction {
    type: MURMURS_WIDGET_ACTION.TOGGLE_SPECIFIC_MURMUR_INFO;
    payload: {
        id: string;
        showSpecificMurmurs: boolean;
    };
}

export const toggleSpecificMurmurInfo = (
    id: string,
    showSpecificMurmurs: boolean
): ToggleSpecificMurmurInfoAction => ({
    type: MURMURS_WIDGET_ACTION.TOGGLE_SPECIFIC_MURMUR_INFO,
    payload: {
        id,
        showSpecificMurmurs,
    },
});

export interface UpdateSpecificMurmurAction {
    type: MURMURS_WIDGET_ACTION.UPDATE_SPECIFIC_MURMUR;
    payload: {
        id: string;
        newSpecificMurmur: SystolicMurmur | DiastolicMurmur;
    };
}

export const updateSpecificMurmur = (
    id: string,
    newSpecificMurmur: SystolicMurmur | DiastolicMurmur
): UpdateSpecificMurmurAction => ({
    type: MURMURS_WIDGET_ACTION.UPDATE_SPECIFIC_MURMUR,
    payload: {
        id,
        newSpecificMurmur,
    },
});

export interface ToggleRadiationToAction {
    type: MURMURS_WIDGET_ACTION.TOGGLE_RADIATION_TO;
    payload: {
        id: string;
        field: MurmurRadiation;
    };
}

export const toggleRadiationTo = (
    id: string,
    field: MurmurRadiation
): ToggleRadiationToAction => ({
    type: MURMURS_WIDGET_ACTION.TOGGLE_RADIATION_TO,
    payload: {
        id,
        field,
    },
});

export interface ToggleAdditionalFeaturesAction {
    type: MURMURS_WIDGET_ACTION.TOGGLE_ADDITIONAL_FEATURES;
    payload: {
        id: string;
        field: MurmurAdditionalFeature;
    };
}

export const toggleAdditionalFeatures = (
    id: string,
    field: MurmurAdditionalFeature
): ToggleAdditionalFeaturesAction => ({
    type: MURMURS_WIDGET_ACTION.TOGGLE_ADDITIONAL_FEATURES,
    payload: {
        id,
        field,
    },
});

export interface DeleteMurmursWidgetItemAction {
    type: MURMURS_WIDGET_ACTION.DELETE_MURMURS_WIDGET_ITEM;
    payload: {
        id: string;
    };
}

export const deleteMurmursWidgetItem = (
    id: string
): DeleteMurmursWidgetItemAction => ({
    type: MURMURS_WIDGET_ACTION.DELETE_MURMURS_WIDGET_ITEM,
    payload: {
        id,
    },
});

export type MurmursWidgetActionTypes =
    | AddMurmursWidgetItemAction
    | UpdatePhaseAction
    | ToggleCrescendoDecrescendoAction
    | UpdateBestHeardAtAction
    | UpdateIntensityAction
    | UpdatePitchAction
    | ToggleQualityAction
    | ToggleSpecificMurmurInfoAction
    | UpdateSpecificMurmurAction
    | ToggleRadiationToAction
    | ToggleAdditionalFeaturesAction
    | DeleteMurmursWidgetItemAction;

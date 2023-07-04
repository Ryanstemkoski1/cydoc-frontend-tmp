import { MURMURS_WIDGET_ACTION } from 'redux/actions/actionTypes';
import { MurmursWidgetActionTypes } from 'redux/actions/widgetActions/murmursWidgetActions';
import { v4 } from 'uuid';

export interface MurmursWidgetState {
    [id: string]: MurmursWidgetItemState;
}

export interface MurmursWidgetItemState {
    phase: Phase | '';
    crescendo: boolean;
    decrescendo: boolean;
    bestHeardAt: MurmurLocation | '';
    intensity: 1 | 2 | 3 | 4 | 5 | -1;
    pitch: MurmurPitch | '';
    quality: {
        blowing: boolean;
        harsh: boolean;
        rumbling: boolean;
        whooshing: boolean;
        rasping: boolean;
        musical: boolean;
    };
    specificMurmurInfo?: {
        specificMurmur: SystolicMurmur | DiastolicMurmur | '';
        radiationTo: {
            carotids: boolean;
            leftClavicle: boolean;
            precordium: boolean;
            RLSB: boolean;
            LLSB: boolean;
            LUSB: boolean;
        };
        additionalFeatures: {
            increasedWithValsava: boolean;
            palpableThrill: boolean;
            systolicClick: boolean;
            openingSnap: boolean;
            early: boolean;
            mid: boolean;
        };
    };
}

export enum Phase {
    Systolic = 'systolic',
    Diastolic = 'diastolic',
}

export enum MurmurLocation {
    RUSB = 'RUSB',
    LUSB = 'LUSB',
    RLSB = 'RLSB',
    LLSB = 'LLSB',
    Apex = 'apex',
}

export enum MurmurPitch {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export type MurmurQuality = keyof MurmursWidgetItemState['quality'];

export enum SystolicMurmur {
    AorticStenosis = 'aortic stenosis',
    PulmonaryStenosis = 'pulmonary stenosis',
    AtrialSeptalDefect = 'atrial septal defect',
    HOCM = 'HOCM',
    MitralRegurgitation = 'mitral regurgitation',
    TricuspidRegurgitation = 'tricuspid regurgitation',
    VentricularSeptalDefect = 'ventricular septal defect',
    MitralProlapse = 'mitral prolapse',
    Physiologic = 'physiologic',
}

export enum DiastolicMurmur {
    AorticRegurgitation = 'aortic regurgitation',
    MitralStenosis = 'mitral stenosis',
    TricuspidStenosis = 'tricuspid stenosis',
    PulmonaryRegurgitation = 'pulmonary regurgitation',
}

export type MurmurRadiation = keyof NonNullable<
    MurmursWidgetItemState['specificMurmurInfo']
>['radiationTo'];

export type MurmurAdditionalFeature = keyof NonNullable<
    MurmursWidgetItemState['specificMurmurInfo']
>['additionalFeatures'];

const initialState: MurmursWidgetState = {};

const crescDecresSpecificMurmurs = [
    SystolicMurmur.AorticStenosis,
    SystolicMurmur.PulmonaryStenosis,
    SystolicMurmur.AtrialSeptalDefect,
    SystolicMurmur.HOCM,
];

export function murmursWidgetReducer(
    state = initialState,
    action: MurmursWidgetActionTypes
): MurmursWidgetState {
    switch (action.type) {
        case MURMURS_WIDGET_ACTION.ADD_MURMURS_WIDGET_ITEM: {
            return {
                ...state,
                [v4()]: {
                    phase: '',
                    crescendo: false,
                    decrescendo: false,
                    bestHeardAt: '',
                    intensity: -1,
                    pitch: '',
                    quality: {
                        blowing: false,
                        harsh: false,
                        rumbling: false,
                        whooshing: false,
                        rasping: false,
                        musical: false,
                    },
                },
            };
        }
        case MURMURS_WIDGET_ACTION.UPDATE_PHASE: {
            const { id, newPhase } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    phase: newPhase === state[id].phase ? '' : newPhase,
                },
            };
        }
        case MURMURS_WIDGET_ACTION.TOGGLE_CRESCENDO_DECRESCENDO: {
            // { crescendo, decrescendo } is { true, false } for crescendo, { false, true } for decrescendo,
            // { true, true } for cresc-decresc
            const { id, crescendo, decrescendo } = action.payload;

            // Toggles off the clicked selection if it is already selected
            const newCrescendoDecrescendo = (() => {
                if (
                    crescendo === state[id].crescendo &&
                    decrescendo === state[id].decrescendo
                ) {
                    return { crescendo: false, decrescendo: false };
                }
                return { crescendo, decrescendo };
            })();
            return {
                ...state,
                [id]: {
                    ...state[id],
                    ...newCrescendoDecrescendo,
                },
            };
        }
        case MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT: {
            const { id, newBestHeardAt } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    bestHeardAt:
                        newBestHeardAt === state[id].bestHeardAt
                            ? ''
                            : newBestHeardAt,
                },
            };
        }
        case MURMURS_WIDGET_ACTION.UPDATE_INTENSITY: {
            const { id, newIntensity } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    intensity:
                        newIntensity === state[id].intensity
                            ? -1
                            : newIntensity,
                },
            };
        }
        case MURMURS_WIDGET_ACTION.UPDATE_PITCH: {
            const { id, newPitch } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    pitch: newPitch === state[id].pitch ? '' : newPitch,
                },
            };
        }
        case MURMURS_WIDGET_ACTION.TOGGLE_QUALITY: {
            const { id, field } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    quality: {
                        ...state[id].quality,
                        [field]: !state[id].quality[field],
                    },
                },
            };
        }
        case MURMURS_WIDGET_ACTION.TOGGLE_SPECIFIC_MURMUR_INFO: {
            const { id, showSpecificMurmurs } = action.payload;
            if (showSpecificMurmurs) {
                if (state[id].specificMurmurInfo) {
                    return state;
                } else {
                    return {
                        ...state,
                        [id]: {
                            ...state[id],
                            specificMurmurInfo: {
                                specificMurmur: '',
                                radiationTo: {
                                    carotids: false,
                                    leftClavicle: false,
                                    precordium: false,
                                    RLSB: false,
                                    LLSB: false,
                                    LUSB: false,
                                },
                                additionalFeatures: {
                                    increasedWithValsava: false,
                                    palpableThrill: false,
                                    systolicClick: false,
                                    openingSnap: false,
                                    early: false,
                                    mid: false,
                                },
                            },
                        },
                    };
                }
            } else {
                const {
                    specificMurmurInfo: _deleted,
                    ...newMurmursWidgetItem
                } = state[id];
                return {
                    ...state,
                    [id]: newMurmursWidgetItem,
                };
            }
        }
        case MURMURS_WIDGET_ACTION.UPDATE_SPECIFIC_MURMUR: {
            const { id, newSpecificMurmur } = action.payload;
            if (!state[id].specificMurmurInfo) {
                throw new Error(
                    `Could not resolve updateSpecificMurmur: specificMurmurInfo not enabled for MurmursWidgetItem with id ${id}`
                );
            }
            //If the user selects a cresc-decresc or decresc murmur,
            //it should toggle on cresc-decresc/decresc if not toggled already
            const newCrescendoDecrescendo = (() => {
                if (
                    crescDecresSpecificMurmurs.includes(
                        newSpecificMurmur as SystolicMurmur
                    )
                ) {
                    return { crescendo: true, decrescendo: true };
                } else if (
                    Object.values(DiastolicMurmur).includes(
                        newSpecificMurmur as DiastolicMurmur
                    )
                ) {
                    return { crescendo: false, decrescendo: true };
                } else {
                    const { crescendo, decrescendo } = state[id];
                    return { crescendo, decrescendo };
                }
            })();
            return {
                ...state,
                [id]: {
                    ...state[id],
                    ...newCrescendoDecrescendo,
                    specificMurmurInfo: {
                        ...state[id].specificMurmurInfo!,
                        specificMurmur: newSpecificMurmur,
                    },
                },
            };
        }
        case MURMURS_WIDGET_ACTION.TOGGLE_RADIATION_TO: {
            const { id, field } = action.payload;
            if (!state[id].specificMurmurInfo) {
                throw new Error(
                    `Could not resolve toggleRadiationTo: specificMurmurInfo not enabled for MurmursWidgetItem with id ${id}`
                );
            }
            return {
                ...state,
                [id]: {
                    ...state[id],
                    specificMurmurInfo: {
                        ...state[id].specificMurmurInfo!,
                        radiationTo: {
                            ...state[id].specificMurmurInfo!.radiationTo,
                            [field]:
                                !state[id].specificMurmurInfo!.radiationTo[
                                    field
                                ],
                        },
                    },
                },
            };
        }
        case MURMURS_WIDGET_ACTION.TOGGLE_ADDITIONAL_FEATURES: {
            const { id, field } = action.payload;
            if (!state[id].specificMurmurInfo) {
                throw new Error(
                    `Could not resolve toggleRadiationTo: specificMurmurInfo not enabled for MurmursWidgetItem with id ${id}`
                );
            }
            return {
                ...state,
                [id]: {
                    ...state[id],
                    specificMurmurInfo: {
                        ...state[id].specificMurmurInfo!,
                        additionalFeatures: {
                            ...state[id].specificMurmurInfo!.additionalFeatures,
                            [field]:
                                !state[id].specificMurmurInfo!
                                    .additionalFeatures[field],
                        },
                    },
                },
            };
        }
        case MURMURS_WIDGET_ACTION.DELETE_MURMURS_WIDGET_ITEM: {
            const { id } = action.payload;
            /* eslint-disable-next-line */
            const { [id]: _deleted, ...newState } = state;
            return newState;
        }
        default:
            return state;
    }
}

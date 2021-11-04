import { PhysicalExamSchema } from 'constants/PhysicalExam/physicalExamSchema';
import { PhysicalExamActionTypes } from 'redux/actions/physicalExamActions';
import { WidgetActionTypes } from 'redux/actions/widgetActions';
import { PHYSICAL_EXAM_ACTION } from '../actions/actionTypes';
import { widgetReducer, WidgetsState } from './widgetReducers';
import schema from '../../constants/PhysicalExam/exampleSchema.json';
import { LRButtonState } from 'constants/enums';
import { initialLungsWidgetState } from './widgetReducers/lungsWidgetReducer';
import { initialAbdomenWidgetState } from './widgetReducers/abdomenWidgetReducer';

export interface PhysicalExamState {
    vitals: {
        systolicBloodPressure: number;
        diastolicBloodPressure: number;
        heartRate: number;
        RR: number;
        temperature: number;
        oxygenSaturation: number;
    };
    sections: PhysicalExamSectionState;
    widgets: WidgetsState;
}

export type VitalsFields = keyof PhysicalExamState['vitals'];

export interface Vitals {
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    heartRate: number;
    RR: number;
    temperature: number;
    oxygenSaturation: number;
}

export interface PhysicalExamSectionState {
    [section: string]: PhysicalExamSection;
}

export interface PhysicalExamSection {
    findings: {
        [finding: string]: Findings;
    };
    comments: string;
}

export type Findings = boolean | LRButtonState;

export const initialPhysicalExamState: PhysicalExamState = {
    vitals: {
        systolicBloodPressure: 0,
        diastolicBloodPressure: 0,
        heartRate: 0,
        RR: 0,
        temperature: 0,
        oxygenSaturation: 0,
    },
    /* eslint-disable-next-line */
    sections: processPhysicalExamSchema(schema as PhysicalExamSchema),
    widgets: {
        lungs: initialLungsWidgetState,
        abdomen: initialAbdomenWidgetState,
        pulses: {},
        reflexes: {},
        murmurs: {},
    },
};

export function processPhysicalExamSchema(
    schema: PhysicalExamSchema
): PhysicalExamSectionState {
    const state: PhysicalExamSectionState = {};
    schema.sections.forEach((section) => {
        const sectionState: PhysicalExamSection = {
            findings: {},
            comments: '',
        };
        section.rows.forEach((row) => {
            if (row.display !== 'autocompletedropdown') {
                if (row.needsRightLeft) {
                    row.findings.forEach((finding) => {
                        sectionState.findings[finding] = {
                            left: false,
                            center: false,
                            right: false,
                        };
                    });
                } else {
                    row.findings.forEach((finding) => {
                        sectionState.findings[finding] = false;
                    });
                }
            }
        });
        state[section.name] = sectionState;
    });
    return state;
}

export function physicalExamReducer(
    state = initialPhysicalExamState,
    action: PhysicalExamActionTypes | WidgetActionTypes
): PhysicalExamState {
    switch (action.type) {
        case PHYSICAL_EXAM_ACTION.UPDATE_VITALS: {
            const { vitalsField, newValue } = action.payload;
            return {
                ...state,
                vitals: {
                    ...state.vitals,
                    [vitalsField]: newValue,
                },
            };
        }
        case PHYSICAL_EXAM_ACTION.TOGGLE_FINDING: {
            const { section, finding } = action.payload;
            const currentFindingState =
                state.sections[section].findings[finding] ?? true;
            // Throw error if the finding is actually an LRFinding
            if (typeof currentFindingState !== 'boolean') {
                throw Error(
                    `Finding ${finding} in section ${section} is an LRFinding; use toggleLeftRightFinding instead.`
                );
            }
            return {
                ...state,
                sections: {
                    ...state.sections,
                    [section]: {
                        ...state.sections[section],
                        findings: {
                            ...state.sections[section].findings,
                            [finding]: !currentFindingState,
                        },
                    },
                },
            };
        }
        case PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING: {
            const { section, finding, buttonClicked } = action.payload;
            const currentFindingState = state.sections[section].findings[
                finding
            ] ?? { left: false, right: false, center: true };
            //Throw error if the finding is not actually an LRFinding
            if (typeof currentFindingState === 'boolean') {
                throw Error(
                    `Finding ${finding} in section ${section} is not an LRFinding; use toggleFinding instead.`
                );
            }
            let newFindingState;
            if (buttonClicked === 'center' && currentFindingState.center) {
                newFindingState = {
                    left: false,
                    center: false,
                    right: false,
                };
            } else {
                newFindingState = {
                    ...currentFindingState,
                    [buttonClicked]: !currentFindingState[buttonClicked],
                };
            }
            return {
                ...state,
                sections: {
                    ...state.sections,
                    [section]: {
                        ...state.sections[section],
                        findings: {
                            ...state.sections[section].findings,
                            [finding]: newFindingState,
                        },
                    },
                },
            };
        }
        case PHYSICAL_EXAM_ACTION.REMOVE_FINDING: {
            const { section, finding } = action.payload;
            const currentFindingsCopy = { ...state.sections[section].findings };
            delete currentFindingsCopy[finding];
            return {
                ...state,
                sections: {
                    ...state.sections,
                    [section]: {
                        ...state.sections[section],
                        findings: currentFindingsCopy,
                    },
                },
            };
        }
        case PHYSICAL_EXAM_ACTION.UPDATE_COMMENTS: {
            const { section, newComments } = action.payload;
            return {
                ...state,
                sections: {
                    ...state.sections,
                    [section]: {
                        ...state.sections[section],
                        comments: newComments,
                    },
                },
            };
        }
        default:
            return {
                ...state,
                widgets: widgetReducer(state.widgets, action),
            };
    }
}

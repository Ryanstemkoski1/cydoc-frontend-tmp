import {
    physicalExamReducer,
    initialPhysicalExamState,
} from './physicalExamReducer';
import { PHYSICAL_EXAM_ACTION } from '@redux/actions/actionTypes';
import { initialLungsWidgetState } from './widgetReducers/lungsWidgetReducer';
import { initialAbdomenWidgetState } from './widgetReducers/abdomenWidgetReducer';

const initialPhysicalExam = {
    vitals: {
        systolicBloodPressure: 0,
        diastolicBloodPressure: 0,
        heartRate: 0,
        RR: 0,
        temperature: 0,
        oxygenSaturation: 0,
    },
    sections: {
        foo: {
            findings: {
                bar: false,
                barT: true,
                barLR: {
                    left: true,
                    right: false,
                    center: true,
                },
            },
            comments: '',
        },
    },
    widgets: {
        lungs: initialLungsWidgetState,
        abdomen: initialAbdomenWidgetState,
        pulses: {},
        reflexes: {},
        murmurs: {},
    },
};

describe('physicalExam reducers', () => {
    it('returns the initial state', () => {
        expect(physicalExamReducer(undefined, {})).toEqual(
            initialPhysicalExamState
        );
    });
    it('updates vital', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.UPDATE_VITALS,
                payload: {
                    vitalsField: 'heartRate',
                    newValue: 100,
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            vitals: {
                ...initialPhysicalExam.vitals,
                heartRate: 100,
            },
        });
    });
    it('updates comment', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.UPDATE_COMMENTS,
                payload: {
                    section: 'foo',
                    newComments: 'testing',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    comments: 'testing',
                },
            },
        });
    });
    it('throws error when toggling fing on a LR', () => {
        expect(() =>
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                },
            })
        ).toThrow();
    });
    it('toggles finding initially false', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'bar',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        bar: true,
                    },
                },
            },
        });
    });
    it('toggles finding initially true', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'barT',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barT: false,
                    },
                },
            },
        });
    });
    it('toggles LR finding initially true', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                    buttonClicked: 'left',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barLR: {
                            left: false,
                            center: true,
                            right: false,
                        },
                    },
                },
            },
        });
    });
    it('toggles LR finding initially false', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                    buttonClicked: 'right',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barLR: {
                            left: true,
                            center: true,
                            right: true,
                        },
                    },
                },
            },
        });
    });
    it('toggles off every LR field if center deselected', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                    buttonClicked: 'center',
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barLR: {
                            left: false,
                            center: false,
                            right: false,
                        },
                    },
                },
            },
        });
    });
    it('throws error when toggling LR on non-LR', () => {
        expect(() =>
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
                payload: {
                    section: 'foo',
                    finding: 'bar',
                    buttonClicked: 'right',
                },
            })
        ).toThrow();
    });
    it('changes LR value to true', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                    response: true,
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barLR: {
                            left: true,
                            center: true,
                            right: false,
                        },
                    },
                },
            },
        });
    });
    it('changes LR value to false', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
                payload: {
                    section: 'foo',
                    finding: 'barLR',
                    response: false,
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        barLR: {
                            left: true,
                            center: false,
                            right: false,
                        },
                    },
                },
            },
        });
    });
    it('changes value to true', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
                payload: {
                    section: 'foo',
                    finding: 'bar',
                    response: true,
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        bar: true,
                    },
                },
            },
        });
    });
    it('changes value to false', () => {
        expect(
            physicalExamReducer(initialPhysicalExam, {
                type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
                payload: {
                    section: 'foo',
                    finding: 'bar',
                    response: false,
                },
            })
        ).toEqual({
            ...initialPhysicalExam,
            sections: {
                ...initialPhysicalExam.sections,
                foo: {
                    ...initialPhysicalExam.sections['foo'],
                    findings: {
                        ...initialPhysicalExam.sections['foo'].findings,
                        bar: false,
                    },
                },
            },
        });
    });
});

import React from 'react';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import PhysicalExamNote from '../PhysicalExamNote';
import { initialAbdomenWidgetState } from '../../../../../../redux/reducers/widgetReducers/abdomenWidgetReducer';
import { initialLungsWidgetState } from '../../../../../../redux/reducers/widgetReducers/lungsWidgetReducer';
import { PulseLocation } from '../../../../../../redux/reducers/widgetReducers/pulsesWidgetReducer';
import { initialSurgicalHistoryState } from '../../../../../../redux/reducers/surgicalHistoryReducer';
import {
    Phase,
    MurmurLocation,
    MurmurPitch,
} from '../../../../../../redux/reducers/widgetReducers/murmurswidgetReducer';
import { LeftRight } from '../../../../../../constants/enums';
import { Provider } from 'react-redux';
import { describe, expect, it, test } from 'vitest';
import { initialAdditionalSurveyData } from '../../../../../../redux/reducers/additionalSurveyReducer';
import { initialChiefComplaintsState } from '../../../../../../redux/reducers/chiefComplaintsReducer';

const mockStore = configureStore([]);

const emptyPhysicalExam = {
    vitals: {
        systolicBloodPressure: 0,
        diastolicBloodPressure: 0,
        heartRate: 0,
        RR: 0,
        temperature: 0,
        tempUnit: 0,
        oxygenSaturation: 0,
    },
    sections: {},
    widgets: {
        lungs: initialLungsWidgetState,
        abdomen: initialAbdomenWidgetState,
        pulses: {},
        reflexes: {},
        murmurs: {},
    },
};

const initialUserState = {
    patientView: true,
    doctorView: false,
    userSurvey: {},
};

const connectStore = (physicalExam = emptyPhysicalExam, isRich = false) => {
    const store = mockStore({
        additionalSurvey: initialAdditionalSurveyData,
        chiefComplaints: initialChiefComplaintsState,
        surgicalHistory: initialSurgicalHistoryState,
        userView: initialUserState,
    });

    return {
        store,
        wrapper: render(
            <Provider store={store}>
                <PhysicalExamNote physicalExam={physicalExam} isRich={isRich} />
            </Provider>
        ),
    };
};

describe('Physical Exam Note', () => {
    it('renders without crashing', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
    });
    it('matches snapshot', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toMatchSnapshot();
    });
    it('correctly renders when empty', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeDefined();
    });

    it('renders vitals correctly (non-rich)', () => {
        const { wrapper } = connectStore({
            ...emptyPhysicalExam,
            vitals: {
                ...emptyPhysicalExam.vitals,
                systolicBloodPressure: 0,
                diastolicBloodPressure: 30,
                heartRate: 1,
                RR: 2,
                temperature: 100,
                oxygenSaturation: 20,
            },
        });

        const vitalsBold = wrapper.getByText('Vitals:');
        const vitalInfo = wrapper.getByText(
            'Heart Rate: 1 BPM, RR: 2 BPM, Temperature: 100°C, Oxygen Saturation: 20 PaO₂'
        );
        expect(vitalsBold).toBeDefined();
        expect(vitalInfo).toBeDefined();
    });

    it('renders vitals correctly (rich)', () => {
        const { wrapper } = connectStore(
            {
                ...emptyPhysicalExam,
                vitals: {
                    ...emptyPhysicalExam.vitals,
                    systolicBloodPressure: 0,
                    diastolicBloodPressure: 30,
                    heartRate: 1,
                    RR: 2,
                    temperature: 100,
                    oxygenSaturation: 20,
                },
            },
            true
        );
        expect(wrapper.getByText('Vitals')).toBeDefined();
        expect(
            wrapper.getByText(
                'Heart Rate: 1 BPM, RR: 2 BPM, Temperature: 100°C, Oxygen Saturation: 20 PaO₂'
            )
        ).toBeDefined();
    });

    it('renders only non-empty vitals correctly (non-rich)', () => {
        const { wrapper } = connectStore({
            ...emptyPhysicalExam,
            vitals: {
                ...emptyPhysicalExam.vitals,
                systolicBloodPressure: 20,
                diastolicBloodPressure: 0,
                heartRate: 0,
                RR: 2,
                temperature: 100,
                oxygenSaturation: 0,
            },
        });
        expect(wrapper.getByText('Vitals:')).toBeDefined();
        expect(
            wrapper.getByText('RR: 2 BPM, Temperature: 100°C')
        ).toBeDefined();
    });

    it('renders only non-empty vitals (rich)', () => {
        const { wrapper } = connectStore(
            {
                ...emptyPhysicalExam,
                vitals: {
                    ...emptyPhysicalExam.vitals,
                    systolicBloodPressure: 20,
                    diastolicBloodPressure: 0,
                    heartRate: 0,
                    RR: 2,
                    temperature: 100,
                    oxygenSaturation: 0,
                },
            },
            true
        );
        expect(wrapper.getByText('Vitals')).toBeDefined();
        expect(
            wrapper.getByText('RR: 2 BPM, Temperature: 100°C')
        ).toBeDefined();
    });
    const cases = [true, false];

    test.each(cases)(
        'renders pulses widgets with notes correctly (rich=%p)',
        (isRich) => {
            const { wrapper } = connectStore(
                {
                    ...emptyPhysicalExam,
                    widgets: {
                        ...emptyPhysicalExam.widgets,
                        pulses: {
                            foo: {
                                location: PulseLocation.Brachial,
                                side: LeftRight.Left,
                                intensity: 4,
                            },
                            test: {
                                location: PulseLocation.Radial,
                                side: LeftRight.Right,
                                intensity: 2,
                            },
                        },
                    },
                    sections: {
                        pulses: {
                            findings: {
                                bar: true,
                                fake: false,
                            },
                            comments: 'COMMENT',
                        },
                    },
                },
                isRich
            );
            expect(wrapper.getByText(/pulses/)).toBeDefined();
            expect(
                wrapper.getByText(
                    'COMMENT. bar. 4+ bounding left brachial pulse, 2+ right radial pulse.'
                )
            ).toBeDefined();
        }
    );
    test.each(cases)(
        'renders abdomen widgets with notes correctly (rich=%p)',
        (isRich) => {
            const { wrapper } = connectStore(
                {
                    ...emptyPhysicalExam,
                    widgets: {
                        ...emptyPhysicalExam.widgets,
                        abdomen: {
                            ...emptyPhysicalExam.widgets.abdomen,
                            rightLowerQuadrant: {
                                tenderness: true,
                                rebound: false,
                                guarding: true,
                            },
                            leftLowerQuadrant: {
                                tenderness: true,
                                rebound: true,
                                guarding: false,
                            },
                        },
                    },
                    sections: {
                        gastrointestinal: {
                            findings: {
                                foo: {
                                    left: true,
                                    right: false,
                                    center: false,
                                },
                                bar: true,
                            },
                            comments: 'COMMENT',
                        },
                    },
                },
                isRich
            );
            expect(wrapper.getByText(/gastrointestinal/)).toBeDefined();
            expect(
                wrapper.getByText(
                    'COMMENT. bar. tenderness in the right lower quadrant and left lower quadrant, rebound in the left lower quadrant, guarding in the right lower quadrant.'
                )
            ).toBeDefined();
        }
    );

    test.each(cases)(
        'renders murmurs widgets with notes correctly (rich=%p)',
        (isRich) => {
            const { wrapper } = connectStore(
                {
                    ...emptyPhysicalExam,
                    widgets: {
                        ...emptyPhysicalExam.widgets,
                        murmurs: {
                            foo: {
                                phase: Phase.Systolic,
                                crescendo: true,
                                decrescendo: false,
                                bestHeardAt: MurmurLocation.LLSB,
                                intensity: 5,
                                pitch: MurmurPitch.Low,
                                quality: {
                                    blowing: true,
                                    harsh: false,
                                    rumbling: true,
                                    whooshing: true,
                                    rasping: false,
                                    musical: false,
                                },
                            },
                            bar: {
                                phase: Phase.Diastolic,
                                crescendo: false,
                                decrescendo: false,
                                bestHeardAt: '',
                                intensity: 1,
                                pitch: MurmurPitch.High,
                                quality: {
                                    blowing: false,
                                    harsh: true,
                                    rumbling: false,
                                    whooshing: true,
                                    rasping: false,
                                    musical: true,
                                },
                            },
                        },
                    },
                    sections: {
                        cardiac: {
                            findings: {
                                foo: {
                                    left: false,
                                    right: true,
                                    center: false,
                                },
                                bar: true,
                            },
                            comments: 'COMMENT',
                        },
                    },
                },
                isRich
            );
            expect(wrapper.getByText(/cardiac/)).toBeDefined();
            expect(
                wrapper.getByText(
                    'COMMENT. bar. Systolic crescendo murmur with a blowing, rumbling, whooshing quality heard best at LLSB. Intensity 5, low pitch, Diastolic crescendo murmur with a harsh, whooshing, musical quality. Intensity 1, high pitch.'
                )
            ).toBeDefined();
        }
    );
});

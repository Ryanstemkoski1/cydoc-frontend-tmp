// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import PhysicalExamNote from '../PhysicalExamNote';
// import { initialAbdomenWidgetState } from '@redux/reducers/widgetReducers/abdomenWidgetReducer';
// import { initialLungsWidgetState } from '@redux/reducers/widgetReducers/lungsWidgetReducer';
// import { PulseLocation } from '@redux/reducers/widgetReducers/pulsesWidgetReducer';
// //import { ReflexLocation } from '@redux/reducers/widgetReducers/reflexesWidgetReducer';
// import {
//     Phase,
//     MurmurLocation,
//     MurmurPitch,
// } from '@redux/reducers/widgetReducers/murmurswidgetReducer';
// import { LeftRight } from 'constants/enums';

// Enzyme.configure({ adapter: new Adapter() });

// const emptyPhysicalExam = {
//     vitals: {
//         systolicBloodPressure: 0,
//         diastolicBloodPressure: 0,
//         heartRate: 0,
//         RR: 0,
//         temperature: 0,
//         tempUnit: 0,
//         oxygenSaturation: 0,
//     },
//     sections: {},
//     widgets: {
//         lungs: initialLungsWidgetState,
//         abdomen: initialAbdomenWidgetState,
//         pulses: {},
//         reflexes: {},
//         murmurs: {},
//     },
// };

// const mountWithProps = (physicalExam = emptyPhysicalExam, isRich = false) => {
//     return mount(
//         <PhysicalExamNote physicalExam={physicalExam} isRich={isRich} />
//     );
// };

// describe('Physical Exam Note', () => {
//     it('renders without crashing', () => {
//         const wrapper = mountWithProps();
//         expect(wrapper).toBeTruthy();
//     });
//     it('matches snapshot', () => {
//         const wrapper = mountWithProps();
//         expect(wrapper.html()).toMatchSnapshot();
//     });
//     it('correctly renders when empty', () => {
//         const wrapper = mountWithProps();
//         expect(wrapper.text()).toContain('');
//     });
//     it('renders vitals correctly (non-rich)', () => {
//         const wrapper = mountWithProps({
//             ...emptyPhysicalExam,
//             vitals: {
//                 systolicBloodPressure: 0,
//                 diastolicBloodPressure: 30,
//                 heartRate: 1,
//                 RR: 2,
//                 temperature: 100,
//                 oxygenSaturation: 20,
//             },
//         });
//         const items = wrapper.find('li');
//         expect(items).toHaveLength(1);
//         expect(items.text()).toContain(
//             'Vitals: Heart Rate: 1 BPM, RR: 2 BPM, Temperature: 100°F, Oxygen Saturation: 20 PaO₂'
//         );
//     });
//     it('renders vitals correctly (rich)', () => {
//         const wrapper = mountWithProps(
//             {
//                 ...emptyPhysicalExam,
//                 vitals: {
//                     systolicBloodPressure: 0,
//                     diastolicBloodPressure: 30,
//                     heartRate: 1,
//                     RR: 2,
//                     temperature: 100,
//                     oxygenSaturation: 20,
//                 },
//             },
//             true
//         );
//         const row = wrapper.find('tr').at(1);
//         expect(row.text()).toContain('Vitals');
//         expect(row.text()).toContain(
//             'Heart Rate: 1 BPM, ' +
//                 'RR: 2 BPM, Temperature: 100°F, Oxygen Saturation: 20 PaO₂'
//         );
//     });
//     it('renders only non-empty vitals correctly (non-rich)', () => {
//         const wrapper = mountWithProps({
//             ...emptyPhysicalExam,
//             vitals: {
//                 systolicBloodPressure: 20,
//                 diastolicBloodPressure: 0,
//                 heartRate: 0,
//                 RR: 2,
//                 temperature: 100,
//                 oxygenSaturation: 0,
//             },
//         });
//         const items = wrapper.find('li');
//         expect(items).toHaveLength(1);
//         expect(items.text()).toContain('Vitals: RR: 2 BPM, Temperature: 100°F');
//     });
//     it('renders only non-empty vitals (rich)', () => {
//         const wrapper = mountWithProps(
//             {
//                 ...emptyPhysicalExam,
//                 vitals: {
//                     systolicBloodPressure: 20,
//                     diastolicBloodPressure: 0,
//                     heartRate: 0,
//                     RR: 2,
//                     temperature: 100,
//                     oxygenSaturation: 0,
//                 },
//             },
//             true
//         );
//         const row = wrapper.find('tr').at(1);
//         expect(row.text()).toContain('Vitals');
//         expect(row.text()).toContain('RR: 2 BPM, Temperature: 100°F');
//     });
//     const cases = [true, false];
//     //works correctly in app
//     //eslint-disable-next-line
//     /*test.each(cases)('renders lung widgets correctly (rich=%p)', (isRich) => {
//         const wrapper = mountWithProps(
//             {
//                 ...emptyPhysicalExam,
//                 widgets: {
//                     ...emptyPhysicalExam.widgets,
//                     lungs: {
//                         leftLowerLobe: {
//                             wheezes: true,
//                             rhonchi: true,
//                             vesicularBreathSounds: false,
//                         },
//                         rightLowerLobe: {
//                             wheezes: true,
//                             vesicularBreathSounds: false,
//                         },
//                         lingula: {
//                             wheezes: true,
//                             vesicularBreathSounds: true,
//                         },
//                     },
//                 },
//             },
//             isRich
//         );
//         expect(wrapper.text()).toContain('Pulmonary');
//         expect(wrapper.text()).toContain(
//             'wheezes in the left lower lobe, right lower lobe and lingula'
//         );
//         expect(wrapper.text()).toContain('rhonchi in the left lower lobe');
//         expect(wrapper.text()).toContain(
//             'vesicular breath sounds in the lingula'
//         );
//     });
//     test.each(cases)(
//         'renders lung widgets with notes correctly (rich=%p)',
//         (isRich) => {
//             const wrapper = mountWithProps(
//                 {
//                     ...emptyPhysicalExam,
//                     widgets: {
//                         ...emptyPhysicalExam.widgets,
//                         lungs: {
//                             leftLowerLobe: {
//                                 wheezes: true,
//                             },
//                             lingula: {
//                                 wheezes: true,
//                                 vesicularBreathSounds: true,
//                             },
//                         },
//                     },
//                     sections: {
//                         pulmonary: {
//                             findings: {
//                                 foo: {
//                                     left: true,
//                                     right: true,
//                                     center: true,
//                                 },
//                                 bar: true,
//                                 fake: false,
//                             },
//                             comments: 'COMMENT',
//                         },
//                     },
//                 },
//                 isRich
//             );
//             expect(wrapper.text()).toContain('pulmonary');
//             expect(wrapper.text()).toContain(
//                 'COMMENT. bilateral foo, bar. wheezes in the left lower lobe ' +
//                     'and lingula, vesicular breath sounds in the lingula.'
//             );
//         }
//     );*/
//     test.each(cases)(
//         'renders pulses widgets with notes correctly (rich=%p)',
//         (isRich) => {
//             const wrapper = mountWithProps(
//                 {
//                     ...emptyPhysicalExam,
//                     widgets: {
//                         ...emptyPhysicalExam.widgets,
//                         pulses: {
//                             foo: {
//                                 location: PulseLocation.Brachial,
//                                 side: LeftRight.Left,
//                                 intensity: 4,
//                             },
//                             test: {
//                                 location: PulseLocation.Radial,
//                                 side: LeftRight.Right,
//                                 intensity: 2,
//                             },
//                         },
//                     },
//                     sections: {
//                         pulses: {
//                             findings: {
//                                 bar: true,
//                                 fake: false,
//                             },
//                             comments: 'COMMENT',
//                         },
//                     },
//                 },
//                 isRich
//             );
//             expect(wrapper.text()).toContain('pulses');
//             expect(wrapper.text()).toContain(
//                 'COMMENT. bar. 4+ bounding left brachial pulse, 2+ right radial pulse.'
//             );
//         }
//     );
//     test.each(cases)(
//         'renders abdomen widgets with notes correctly (rich=%p)',
//         (isRich) => {
//             const wrapper = mountWithProps(
//                 {
//                     ...emptyPhysicalExam,
//                     widgets: {
//                         ...emptyPhysicalExam.widgets,
//                         abdomen: {
//                             rightLowerQuadrant: {
//                                 tenderness: true,
//                                 rebound: false,
//                                 guarding: true,
//                             },
//                             leftLowerQuadrant: {
//                                 tenderness: true,
//                                 rebound: true,
//                                 guarding: false,
//                             },
//                         },
//                     },
//                     sections: {
//                         gastrointestinal: {
//                             findings: {
//                                 foo: {
//                                     left: true,
//                                     right: false,
//                                     center: false,
//                                 },
//                                 bar: true,
//                             },
//                             comments: 'COMMENT',
//                         },
//                     },
//                 },
//                 isRich
//             );
//             expect(wrapper.text()).toContain('gastrointestinal');
//             expect(wrapper.text()).toContain(
//                 'COMMENT. bar. tenderness in the right lower quadrant and left lower quadrant, rebound in the left lower quadrant, guarding in the right lower quadrant.'
//             );
//         }
//     );
//     //eslint-disable-next-line
//     /*test.each(cases)(
//         'renders reflexes widgets with notes correctly (rich=%p)',
//         (isRich) => {
//             const wrapper = mountWithProps(
//                 {
//                     ...emptyPhysicalExam,
//                     widgets: {
//                         ...emptyPhysicalExam.widgets,
//                         reflexes: {
//                             foo: {
//                                 location: ReflexLocation.Biceps,
//                                 side: LeftRight.Right,
//                                 intensity: 3,
//                             },
//                             bar: {
//                                 location: ReflexLocation.Triceps,
//                                 side: LeftRight.Left,
//                                 intensity: 1,
//                             },
//                         },
//                     },
//                     sections: {
//                         tendonReflexes: {
//                             findings: {
//                                 bar: true,
//                             },
//                             comments: 'COMMENT',
//                         },
//                     },
//                 },
//                 isRich
//             );
//             expect(wrapper.text()).toContain('tendonReflexes');
//             expect(wrapper.text()).toContain(
//                 'COMMENT. bar. biceps RIGHT 3, triceps LEFT 1'
//             );
//         }
//     );*/
//     test.each(cases)(
//         'renders murmurs widgets with notes correctly (rich=%p)',
//         (isRich) => {
//             const wrapper = mountWithProps(
//                 {
//                     ...emptyPhysicalExam,
//                     widgets: {
//                         ...emptyPhysicalExam.widgets,
//                         murmurs: {
//                             foo: {
//                                 phase: Phase.Systolic,
//                                 crescendo: true,
//                                 decrescendo: false,
//                                 bestHeardAt: MurmurLocation.LLSB,
//                                 intensity: 5,
//                                 pitch: MurmurPitch.Low,
//                                 quality: {
//                                     blowing: true,
//                                     harsh: false,
//                                     rumbling: true,
//                                     whooshing: true,
//                                     rasping: false,
//                                     musical: false,
//                                 },
//                             },
//                             bar: {
//                                 phase: Phase.Diastolic,
//                                 crescendo: false,
//                                 decrescendo: false,
//                                 bestHeardAt: '',
//                                 intensity: 1,
//                                 pitch: MurmurPitch.High,
//                                 quality: {
//                                     blowing: false,
//                                     harsh: true,
//                                     rumbling: false,
//                                     whooshing: true,
//                                     rasping: false,
//                                     musical: true,
//                                 },
//                             },
//                         },
//                     },
//                     sections: {
//                         cardiac: {
//                             findings: {
//                                 foo: {
//                                     left: false,
//                                     right: true,
//                                     center: false,
//                                 },
//                                 bar: true,
//                             },
//                             comments: 'COMMENT',
//                         },
//                     },
//                 },
//                 isRich
//             );
//             expect(wrapper.text()).toContain('cardiac');
//             expect(wrapper.text()).toContain(
//                 'Systolic crescendo murmur with a blowing, rumbling, whooshing quality heard best at LLSB. Intensity 5, low pitch, Diastolic crescendo murmur with a harsh, whooshing, musical quality. Intensity 1, high pitch.'
//             );
//         }
//     );
// });

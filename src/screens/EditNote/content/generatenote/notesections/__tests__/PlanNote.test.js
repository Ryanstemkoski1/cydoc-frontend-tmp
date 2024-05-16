// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import {
//     initialPlan,
//     conditionId,
//     categoryId,
// } from 'screens/EditNote/content/discussionplan/util';
// import PlanNote, { EMPTY_NOTE_TEXT } from '../PlanNote';

// Enzyme.configure({ adapter: new Adapter() });

// const plan = {
//     conditions: {
//         [conditionId]: {
//             ...initialPlan.conditions[conditionId],
//             name: 'foo',
//         },
//     },
// };

// describe('Plan Generate Note', () => {
//     it('renders without crashing', () => {
//         const wrapper = mount(<PlanNote planState={plan} />);
//         expect(wrapper).toBeTruthy();
//     });

//     it('matches snapshot', () => {
//         const wrapper = mount(<PlanNote planState={plan} />);
//         expect(wrapper.html()).toMatchSnapshot();
//     });

//     it('renders filler text when plan empty', () => {
//         const wrapper = mount(<PlanNote planState={{ conditions: {} }} />);
//         expect(wrapper.text()).toContain(EMPTY_NOTE_TEXT);
//     });

//     it('renders correct number of sections with empty text', () => {
//         const wrapper = mount(
//             <PlanNote
//                 planState={{
//                     conditions: {
//                         ...plan.conditions,
//                         foo: {
//                             ...plan.conditions[conditionId],
//                             name: 'bar',
//                         },
//                     },
//                 }}
//             />
//         );

//         const findTypeByText = (wrapper, type, text) => {
//             return wrapper.findWhere(
//                 (n) => n.type() === type && n.text() === text
//             );
//         };
//         expect(wrapper.find('.plan-note')).toHaveLength(2);
//         [
//             'Differential Diagnosis',
//             'Prescriptions',
//             'Procedures and Services',
//             'Referrals',
//         ].forEach((text) => {
//             expect(findTypeByText(wrapper, 'b', text)).toHaveLength(0);
//         });
//     });

//     it('renders correct number of sections with one section', () => {
//         const wrapper = mount(
//             <PlanNote
//                 planState={{
//                     conditions: {
//                         ...plan.conditions,
//                         foo: {
//                             ...plan.conditions[conditionId],
//                             name: 'bar',
//                             prescriptions: {
//                                 [categoryId]: {
//                                     comments: '42',
//                                     dose: '24',
//                                     type: 'foo',
//                                     signature: 'bar',
//                                 },
//                             },
//                         },
//                     },
//                 }}
//             />
//         );

//         const findTypeByText = (wrapper, type, text) => {
//             return wrapper.findWhere(
//                 (n) => n.type() === type && n.text() === text
//             );
//         };
//         expect(wrapper.find('.plan-note')).toHaveLength(2);
//         [
//             'Differential Diagnosis',
//             'Procedures and Services',
//             'Referrals',
//         ].forEach((text) => {
//             expect(findTypeByText(wrapper, 'b', text)).toHaveLength(0);
//         });

//         expect(findTypeByText(wrapper, 'b', 'Prescriptions')).toHaveLength(1);
//     });

//     // // TODO: Fix below tests
//     // it('renders differential diagnoses content correctly', () => {
//     //     const wrapper = mount(
//     //         <PlanNote
//     //             planState={{
//     //                 conditions: {
//     //                     ...plan.conditions,
//     //                     foo: {
//     //                         ...plan.conditions[conditionId],
//     //                         name: 'bar',
//     //                         differentialDiagnoses: {
//     //                             [categoryId]: {
//     //                                 comments: 'foo',
//     //                                 diagnosis: 'bar',
//     //                             },
//     //                         },
//     //                     },
//     //                 },
//     //             }}
//     //         />
//     //     );
//     //     expect(wrapper.text()).toContain('foobarDifferential Diagnosis: foo');
//     // });

//     it('renders prescriptions content correctly', () => {
//         const wrapper = mount(
//             <PlanNote
//                 planState={{
//                     conditions: {
//                         ...plan.conditions,
//                         foo: {
//                             ...plan.conditions[conditionId],
//                             name: 'bar',
//                             prescriptions: {
//                                 [categoryId]: {
//                                     comments: '42',
//                                     dose: '24',
//                                     type: 'foo',
//                                     signature: 'bar',
//                                 },
//                             },
//                         },
//                     },
//                 }}
//             />
//         );
//         expect(wrapper.text()).toContain('foobarPrescriptionsfoo: 24. bar. 42');
//     });

//     // // TODO: Fix below tests
//     // it('renders procedures content correctly', () => {
//     //     const wrapper = mount(
//     //         <PlanNote
//     //             planState={{
//     //                 conditions: {
//     //                     ...plan.conditions,
//     //                     foo: {
//     //                         ...plan.conditions[conditionId],
//     //                         name: 'bar',
//     //                         proceduresAndServices: {
//     //                             [categoryId]: {
//     //                                 comments: '24',
//     //                                 procedure: '42',
//     //                                 when: 'foo',
//     //                             },
//     //                         },
//     //                     },
//     //                 },
//     //             }}
//     //         />
//     //     );
//     //     expect(wrapper.text()).toContain(
//     //         'foobarProcedures and Services foo. 24'
//     //     );
//     // });

//     it('renders referrals content correctly', () => {
//         const wrapper = mount(
//             <PlanNote
//                 planState={{
//                     conditions: {
//                         ...plan.conditions,
//                         foo: {
//                             ...plan.conditions[conditionId],
//                             name: 'bar',
//                             referrals: {
//                                 [categoryId]: {
//                                     comments: '24',
//                                     department: '42',
//                                     when: 'foo',
//                                 },
//                             },
//                         },
//                     },
//                 }}
//             />
//         );
//         expect(wrapper.text()).toContain(
//             'foobarReferralsReferred to see 42. foo. 24'
//         );
//     });
// });

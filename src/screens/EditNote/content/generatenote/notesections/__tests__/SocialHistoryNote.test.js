// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import SocialHistoryNote from '../SocialHistoryNote';
// import { initialSocialHistoryState } from '@redux/reducers/socialHistoryReducer';
// import { YesNoMaybeResponse, SubstanceUsageResponse } from 'constants/enums';
// import _ from 'lodash';

// Enzyme.configure({ adapter: new Adapter() });

// const mountWithState = (socialHistory = initialSocialHistoryState) => {
//     return mount(<SocialHistoryNote socialHistory={socialHistory} />);
// };

// describe('Social History Generate Note', () => {
//     it('renders without crashing', () => {
//         const wrapper = mountWithState();
//         expect(wrapper).toBeTruthy();
//     });

//     it('matches snapshot', () => {
//         const wrapper = mountWithState();
//         expect(wrapper.html()).toMatchSnapshot();
//     });

//     let cases = [
//         ['tobacco use'],
//         ['alcohol use'],
//         ['recreational drug use'],
//         ['living situation'],
//         ['employment'],
//         ['diet'],
//         ['exercise'],
//     ];
//     test.each(cases)('renders filler text for default %s', () => {
//         // initial social history contains all default values
//         const wrapper = mountWithState();
//         expect(wrapper.text()).toContain('');
//     });

//     // straight-forward key value pairs
//     cases = ['diet', 'employment', 'livingSituation', 'exercise'];
//     test.each(cases)('renders %s correctly', (type) => {
//         const value = 'foo';
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             [type]: value,
//         });
//         expect(wrapper.text()).toContain(`${_.startCase(type)}: ${value}`);
//     });

//     cases = [
//         // type, textRep, productsUsedField
//         ['tobacco', 'tobacco', 'productsUsed'],
//         ['alcohol', 'alcohol', 'drinksConsumed'],
//         ['recreationalDrugs', 'recreational drugs', 'drugsUsed'],
//     ];
//     test.each(cases)(
//         'renders %s usage, interestInQuitting, and triedToQuit and interest correctly when usage = Yes',
//         (type, textValue) => {
//             const wrapper = mountWithState({
//                 ...initialSocialHistoryState,
//                 [type]: {
//                     ...initialSocialHistoryState[type],
//                     usage: SubstanceUsageResponse.Yes,
//                     interestedInQuitting: YesNoMaybeResponse.Maybe,
//                     triedToQuit: YesNoMaybeResponse.No,
//                     quitYear: -1,
//                 },
//             });
//             expect(wrapper.text()).toContain(`Currently uses ${textValue}`);
//             expect(wrapper.text()).toContain(
//                 'Patient is maybe interested in quitting.'
//             );
//             expect(wrapper.text()).toContain(
//                 'Patient has never tried to quit before.'
//             );
//             // Do not render -1 quit year
//             expect(wrapper.text()).not.toContain('Quit Year:');
//         }
//     );

//     test.each(cases)(
//         'renders %s usage, interestInQuitting, and triedToQuit and interest correctly when usage = InThePast',
//         (type, textValue) => {
//             const wrapper = mountWithState({
//                 ...initialSocialHistoryState,
//                 [type]: {
//                     ...initialSocialHistoryState[type],
//                     usage: SubstanceUsageResponse.InThePast,
//                     interestedInQuitting: YesNoMaybeResponse.Yes,
//                     triedToQuit: YesNoMaybeResponse.Yes,
//                     quitYear: 2000,
//                 },
//             });
//             expect(wrapper.text()).toContain(
//                 `Used to use ${textValue} but does not anymore`
//             );
//             expect(wrapper.text()).toContain('Quit Year: 2000');
//             expect(wrapper.text()).toContain(
//                 'Patient is interested in quitting.'
//             );
//             expect(wrapper.text()).toContain(
//                 'Patient has tried to quit before.'
//             );
//         }
//     );

//     test.each(cases)(
//         'renders %s usage, interestInQuitting, and triedToQuit and interest correctly when usage = Never',
//         (type, _) => {
//             const wrapper = mountWithState({
//                 ...initialSocialHistoryState,
//                 [type]: {
//                     ...initialSocialHistoryState[type],
//                     usage: SubstanceUsageResponse.NeverUsed,
//                     interestedInQuitting: YesNoMaybeResponse.No,
//                     triedToQuit: YesNoMaybeResponse.Yes,
//                     quitYear: -1,
//                 },
//             });
//             expect(wrapper.text()).toContain(`Never used`);
//             expect(wrapper.text()).not.toContain('Quit Year:');
//             // Only render following fields when Yes || InThePast
//             expect(wrapper.text()).not.toContain('Interested in quitting?');
//             expect(wrapper.text()).not.toContain('Tried to quit?');
//         }
//     );

//     test.each(cases)('does not render %s comments when empty', (type, _) => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             [type]: {
//                 ...initialSocialHistoryState[type],
//                 usage: SubstanceUsageResponse.Yes,
//                 comments: '',
//             },
//         });
//         expect(wrapper.text()).not.toContain('Comments: ');
//     });

//     test.each(cases)('renders %s comments correctly', (type, _) => {
//         const value = 'foo';
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             [type]: {
//                 ...initialSocialHistoryState[type],
//                 usage: SubstanceUsageResponse.Yes,
//                 comments: value,
//             },
//         });
//         expect(wrapper.text()).toContain(`Comments: ${value}`);
//     });

//     test.each(cases)(
//         'does not render %s products used when empty',
//         (type, _, field) => {
//             const wrapper = mountWithState({
//                 ...initialSocialHistoryState,
//                 [type]: {
//                     ...initialSocialHistoryState[type],
//                     usage: SubstanceUsageResponse.Yes,
//                     [field]: [],
//                 },
//             });
//             expect(wrapper.text()).not.toContain(`Products used:`);
//         }
//     );

//     it('does not render tobacco pack years when default value', () => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             tobacco: {
//                 ...initialSocialHistoryState.tobacco,
//                 numberOfYears: -1,
//                 packsPerDay: 10,
//             },
//         });
//         // Both must be non-(-1) values
//         expect(wrapper.text()).not.toContain('pack years');
//     });

//     it('renders tobacco packYears correctly', () => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             tobacco: {
//                 ...initialSocialHistoryState.tobacco,
//                 usage: SubstanceUsageResponse.Yes,
//                 numberOfYears: 100,
//                 packsPerDay: 10,
//             },
//         });
//         // Use the product of the two values
//         expect(wrapper.text()).toContain('1000.0 pack years');
//     });

//     it('renders tobacco productsUsed correctly', () => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             tobacco: {
//                 ...initialSocialHistoryState.tobacco,
//                 usage: SubstanceUsageResponse.Yes,
//                 productsUsed: ['a', 'b', 'c'],
//             },
//         });
//         expect(wrapper.text()).toContain('Products used: a, b, c');
//     });

//     it('renders alcohol drinksConsumed correctly', () => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             alcohol: {
//                 ...initialSocialHistoryState.alcohol,
//                 usage: SubstanceUsageResponse.Yes,
//                 drinksConsumed: [
//                     { type: 'a', size: 's', numberPerWeek: 10 },
//                     { type: 'b', size: 't', numberPerWeek: 9 },
//                     { type: 'c', size: 't', numberPerWeek: 1 },
//                 ],
//             },
//         });
//         // Check different plurality of size
//         expect(wrapper.text()).toContain(
//             'Products used: a (10 ses per week), b (9 ts per week), c (1 t per week)'
//         );
//     });

//     it('renders recreationalDrugs drugsUsed correctly', () => {
//         const wrapper = mountWithState({
//             ...initialSocialHistoryState,
//             recreationalDrugs: {
//                 ...initialSocialHistoryState.recreationalDrugs,
//                 usage: SubstanceUsageResponse.Yes,
//                 drugsUsed: [
//                     {
//                         name: 'foo',
//                         modesOfDelivery: ['a', 'b'],
//                         numberPerWeek: 10,
//                     },
//                     { name: 'bar', modesOfDelivery: ['a'], numberPerWeek: 9 },
//                 ],
//             },
//         });
//         expect(wrapper.text()).toContain(
//             'Products used: foo (10 per week, a,b), bar (9 per week, a)'
//         );
//     });
// });

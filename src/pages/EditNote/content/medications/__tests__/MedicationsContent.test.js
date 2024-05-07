import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import MedicationsContent from '../MedicationsContent';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
// import { MEDICATIONS_ACTION } from '@redux/actions/actionTypes';
import { YesNoResponse } from 'constants/enums';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (initialMedications = {}, props = {}) => {
    const store = mockStore({ medications: initialMedications });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <MedicationsContent {...props} />
            </Provider>
        ),
    };
};

const initialMedications = {
    blank: {
        drugName: '',
        startYear: -1,
        isCurrentlyTaking: YesNoResponse.None,
        endYear: -1,
        schedule: '',
        dose: '',
        reasonForTaking: '',
        sideEffects: [],
        comments: '',
    },
    notCurrentlyTaking: {
        drugName: '',
        startYear: -1,
        isCurrentlyTaking: YesNoResponse.No,
        endYear: -1,
        schedule: '',
        dose: '',
        reasonForTaking: '',
        sideEffects: [],
        comments: '',
    },
};

// TODO: Add preview (isPreview = true) cases
const mountDesktop = () =>
    mountWithStore(initialMedications, { isPreview: false, mobile: false });
const mountMobile = () =>
    mountWithStore(initialMedications, { isPreview: false, mobile: true });

// /** Simulate opening and clicking of first dropdown option. */
// const simulateOptionClick = (wrapper, ariaLabel) => {
//     wrapper.find(`input[aria-label="${ariaLabel}"]`).first().simulate('focus');
//     wrapper
//         .find('.dropdown__control--is-focused')
//         .first()
//         .simulate('mousedown');
//     const option = wrapper.find('.option').first();
//     option.simulate('click');
//     return option;
// };

// /** Simulate adding new dropdown option. */
// const simulateAddOption = (wrapper, ariaLabel, value) => {
//     const input = wrapper.find(`input[aria-label="${ariaLabel}"]`).first();
//     input.instance().value = value;
//     input.simulate('change', { target: { value } });
//     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change
// };

describe('Medications Integration', () => {
    let cases = [
        ['Desktop', mountDesktop],
        ['Mobile', mountMobile],
    ];

    test.each(cases)(
        '%s view renders without crashing',
        (_type, mountMedicationsWithStore) => {
            const { wrapper } = mountMedicationsWithStore();
            expect(wrapper).toBeTruthy();
        }
    );

    test.each(cases)(
        '%s view matches snapshot',
        (_type, mountMedicationsWithStore) => {
            const { wrapper } = mountMedicationsWithStore();
            expect(wrapper.html()).toMatchSnapshot();
        }
    );

    // // TODO: Fix below tests
    // test.each(cases)(
    //     '%s view dispatches correct action when selecting medication from dropdown',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const option = simulateOptionClick(wrapper, 'Drug-Name-Dropdown');

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_DRUG_NAME,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newDrugName: option.prop('value'),
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when adding medication that is not a dropdown option',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'new Medication';
    //         simulateAddOption(wrapper, 'Drug-Name-Dropdown', value);

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_DRUG_NAME,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newDrugName: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when selecting reason for taking from dropdown',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const option = simulateOptionClick(
    //             wrapper,
    //             'Reason-For-Taking-Dropdown'
    //         );

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newReasonForTaking: option.prop('value'),
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when adding reason for taking that is not a dropdown option',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'new reason';
    //         simulateAddOption(wrapper, 'Reason-For-Taking-Dropdown', value);

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newReasonForTaking: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when selecting side effects from dropdown',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const option = simulateOptionClick(
    //             wrapper,
    //             'Side-Effects-Dropdown'
    //         );

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newSideEffects: [option.prop('value')],
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when adding side effect that is not a dropdown option',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'new side effect';
    //         simulateAddOption(wrapper, 'Side-Effects-Dropdown', value);

    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newSideEffects: [value],
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when clicking Currently Taking buttons',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         wrapper
    //             .find('button[aria-label="Currently-Taking-Yes-Button"]')
    //             .first()
    //             .simulate('click');
    //         let expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     optionSelected: YesNoResponse.Yes,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find('button[aria-label="Currently-Taking-No-Button"]')
    //             .first()
    //             .simulate('click');
    //         expectedActions.push({
    //             type: MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING,
    //             payload: {
    //                 index: Object.keys(initialMedications)[0],
    //                 optionSelected: YesNoResponse.No,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when updating dose',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'dose';
    //         wrapper
    //             .find('input[aria-label="Dose-Input"]')
    //             .first()
    //             .simulate('change', {
    //                 target: { value },
    //             });
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_DOSE,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newDose: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when updating schedule',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'schedule';
    //         wrapper
    //             .find('input[aria-label="Schedule-Input"]')
    //             .first()
    //             .simulate('change', {
    //                 target: { value },
    //             });
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_SCHEDULE,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newSchedule: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when updating start year',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = '2019';
    //         wrapper
    //             .find('input[aria-label="Start-Year-Input"]')
    //             .first()
    //             .simulate('change', {
    //                 target: { value },
    //             });
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_START_YEAR,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newStartYear: +value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when updating end year',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = '2020';

    //         wrapper
    //             .find('input[aria-label="End-Year-Input"]')
    //             .last()
    //             .simulate('change', {
    //                 target: { value },
    //             });
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_END_YEAR,
    //                 payload: {
    //                     index: 'notCurrentlyTaking',
    //                     newEndYear: +value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when updating comments',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         const value = 'comments';
    //         wrapper
    //             .find('input[aria-label="Comments-Input"]')
    //             .first()
    //             .simulate('change', {
    //                 target: { value },
    //             });
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.UPDATE_COMMENTS,
    //                 payload: {
    //                     index: Object.keys(initialMedications)[0],
    //                     newComments: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when deleting medication row',
    //     (_type, mountMedicationsWithStore) => {
    //         const { store, wrapper } = mountMedicationsWithStore();
    //         wrapper
    //             .find('button[aria-label="delete-medication"]')
    //             .first()
    //             .simulate('click');
    //         const expectedActions = [
    //             {
    //                 type: MEDICATIONS_ACTION.DELETE_MEDICATION,
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );
});

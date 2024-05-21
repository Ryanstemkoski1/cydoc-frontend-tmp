import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MEDICAL_HISTORY_ACTION } from '../../../../../redux/actions/actionTypes';
import MedicalHistoryContent from '../MedicalHistoryContent.tsx';
// import AddRowButton from '../../../../../components/tools/AddRowButton';
// import GridContent from '../../../../../components/tools/GridContent';
import ConditionInput from '../../../../../components/tools/ConditionInput/ConditionInput';
// import MedicalHistoryNoteItem from '../MedicalHistoryNoteItem';
import { YesNoMaybeResponse } from '../../../../../constants/enums.ts';
import MedicalHistoryNoteRow from '../MedicalHistoryNoteRow.tsx';
Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const initialState = {
    ['foo']: {
        condition: 'Type II Diabetes',
        hasBeenAfflicted: YesNoMaybeResponse.Yes,
        startYear: -1,
        hasConditionResolved: '',
        endYear: -1,
        comments: '',
    },
    ['bar']: {
        condition: 'Myocardial Infarction',
        hasBeenAfflicted: YesNoMaybeResponse.Yes,
        startYear: -1,
        hasConditionResolved: '',
        endYear: -1,
        comments: '',
    },
};

const connectStore = (state = initialState, props) => {
    const store = mockStore({ medicalHistory: state });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <MedicalHistoryContent {...props} />
            </Provider>
        ),
    };
};

const itemMount = (state = initialState) => {
    const store = mockStore({ medicalHistory: state });
    const conditionProps = {
        key: 0,
        isPreview: false,
        index: 'foo',
        category: 'medicalHistory',
        seenConditions: {},
        addSeenCondition: vi.fn(),
        condition: 'Type II Diabetes',
    };
    const props = {
        key: 0,
        index: 'foo',
        condition: <ConditionInput {...conditionProps} />,
        onset: -1,
        comments: '',
        onChange: (index, newYear) =>
            store.dispatch({
                type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
                payload: {
                    index: index,
                    newStartYear: newYear,
                },
            }),
        onResolvedToggleButtonClick: (index, optionSelected) =>
            store.dispatch({
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
                payload: {
                    index: index,
                    optionSelected: optionSelected,
                },
            }),
        onConditionToggleButtonClick: (index, optionSelected) =>
            store.dispatch({
                type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
                payload: {
                    index: index,
                    optionSelected: optionSelected,
                },
            }),
        yesActive: true,
        noActive: false,
        currentYear: 2021,
        isResolved: false,
        endYear: 2000,
        isPreview: false,
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <MedicalHistoryContent {...props} />
            </Provider>
        ),
    };
};

describe('MedicalHistoryContent', () => {
    test('render', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
    });

    // // TODO: Fix below tests
    // test('addRow', () => {
    //     const { wrapper, store } = connectStore();
    //     expect(wrapper).toBeTruthy();
    //     const addButton = wrapper
    //         .find(GridContent)
    //         .find(AddRowButton)
    //         .find(Button);
    //     addButton.simulate('click');
    //     const expectedAction = [{ type: MEDICAL_HISTORY_ACTION.ADD_CONDITION }];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing start year dispatches correct action', () => {
    //     const { store, wrapper } = connectStore();
    //     const input = wrapper
    //         .find(MedicalHistoryNoteRow)
    //         .find('textarea[placeholder="Onset"]')
    //         .first();
    //     input.simulate('change', {
    //         target: { value: 2000 },
    //     });
    //     const expectedAction = [
    //         {
    //             type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
    //             payload: {
    //                 newStartYear: 2000,
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('mobile start year', () => {
    //     const { store, wrapper } = itemMount();
    //     expect(wrapper).toBeTruthy();
    //     const input = wrapper.find('textarea[placeholder="Onset"]').first();
    //     expect(input).toHaveLength(1);
    //     input.simulate('change', {
    //         target: { value: 2000 },
    //     });
    //     const expectedAction = [
    //         {
    //             type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
    //             payload: {
    //                 newStartYear: 2000,
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing end year dispatches correct action', () => {
    //     const { store, wrapper } = connectStore();
    //     const input = wrapper
    //         .find(MedicalHistoryNoteRow)
    //         .find('textarea[placeholder="End Year"]')
    //         .first();
    //     input.simulate('change', {
    //         target: { value: 2001 },
    //     });
    //     const expectedAction = [
    //         {
    //             type: MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR,
    //             payload: {
    //                 newEndYear: 2001,
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    test('editing comments dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper
            .find(MedicalHistoryNoteRow)
            .find('textarea[placeholder="Comments"]')
            .first();
        input.simulate('change', {
            target: { value: 'foobar' },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_COMMENTS,
                payload: {
                    newComments: 'foobar',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('mobile comments', () => {
        const { store, wrapper } = itemMount();
        expect(wrapper).toBeTruthy();
        const input = wrapper.find('textarea[placeholder="Comments"]').first();
        expect(input).toHaveLength(1);
        input.simulate('change', {
            target: { value: 'Normal' },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_COMMENTS,
                payload: {
                    newComments: 'Normal',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('toggling condition button dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        wrapper
            .find(MedicalHistoryNoteRow)
            .find('button[title="Yes"]')
            .at(0)
            .simulate('click');
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
                payload: {
                    optionSelected: 'YES',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper.find('button[title="No"]').at(0).simulate('click');
        const expectedAction2 = [
            {
                type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
                payload: {
                    optionSelected: 'NO',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('mobile toggle', () => {
        const { store, wrapper } = itemMount();
        expect(wrapper).toBeTruthy();
        wrapper.find('button[title="Yes"]').at(0).simulate('click');

        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
                payload: {
                    optionSelected: 'YES',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper.find('button[title="No"]').first().simulate('click');
        const expectedAction2 = [
            {
                type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
                payload: {
                    optionSelected: 'NO',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('toggling resolved button dispatches correct action', () => {
        const { store, wrapper } = connectStore();

        wrapper.find('button[title="Yes"]').at(1).simulate('click');

        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
                payload: {
                    optionSelected: 'YES',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper
            .find(MedicalHistoryNoteRow)
            .find('button[title="No"]')
            .at(1)
            .simulate('click');

        const expectedAction2 = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
                payload: {
                    optionSelected: 'NO',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('mobile resolved', () => {
        const { store, wrapper } = itemMount();
        expect(wrapper).toBeTruthy();

        let togglebutton = wrapper.find('button[title="Yes"]').at(1);
        togglebutton.simulate('click');
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
                payload: {
                    optionSelected: 'YES',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper.find('button[title="No"]').at(1).simulate('click');
        const expectedAction2 = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
                payload: {
                    optionSelected: 'NO',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('changing condition dispatches correct action', () => {
        const { wrapper, store } = connectStore();
        const input = wrapper
            .find(MedicalHistoryNoteRow)
            .find(ConditionInput)
            .find('input[placeholder="Condition"]')
            .first();
        input.simulate('change', {
            target: { value: 'foobar' },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_NAME,
                payload: {
                    newName: 'foobar',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    // test('deleting dispatches correct action', () => {
    //     const { wrapper, store } = connectStore();
    //     const input = wrapper
    //         ?.find('button[aria-label="delete-conditon"]')
    //         ?.first();
    //     input.simulate('click');
    //     const expectedAction = [
    //         {
    //             type: MEDICAL_HISTORY_ACTION.DELETE_CONDITION,
    //             payload: {
    //                 conditionIndex: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // // TODO: Fix below tests
    // test('mobile condition', () => {
    //     const { wrapper, store } = connectStore(initialState, { mobile: true });
    //     const input = wrapper
    //         .find(MedicalHistoryNoteItem)
    //         .find(ConditionInput)
    //         .find('input[placeholder="Condition"]')
    //         .first();
    //     input.simulate('change', {
    //         target: { value: 'foobar' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_NAME,
    //             payload: {
    //                 newName: 'foobar',
    //                 conditionIndex: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('disease name is standardized with lowercase', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'Bar' },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('bar');
    //     makeStore.dispatch(deleteNote());
    // });

    // test('acronyms are not made lowercase', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'BAR' },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('BAR');
    //     makeStore.dispatch(deleteNote());
    // });

    // test('acronyms are not made lowercase when more than one word is present', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'BAR bar' },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('BAR bar');
    //     makeStore.dispatch(deleteNote());
    // });

    // test('roman numerals', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'bar ii foo' },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('bar 2 foo');
    //     makeStore.dispatch(deleteNote());
    // });

    // test('roman numerals at end of word not changed until after blur', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'bar ii' },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('bar ii');
    //     wrapper.find('input[placeholder="Condition"]').first().simulate('blur');
    //     expect(
    //         wrapper.find('input[placeholder="Condition"]').first().props().value
    //     ).toEqual('bar 2');
    //     makeStore.dispatch(deleteNote());
    // });

    // // TODO: Fix below tests
    // test('desktop year validation', () => {
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     expect(wrapper.findF(MedicalHistoryNoteRow)).toHaveLength(0);
    //     wrapper.find('button').simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find(MedicalHistoryNoteRow)).toHaveLength(1);
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(0);
    //     wrapper.find('textarea[placeholder="Onset"]').simulate('change', {
    //         target: { value: 0 },
    //     });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('textarea[placeholder="Onset"]').prop('value')
    //     ).toEqual('0');
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(1);
    //     makeStore.dispatch(deleteNote());
    // })

    // test('mobile year validation', () => {
    //     const props = {
    //         mobile: true,
    //     };
    //     const wrapper = mount(
    //         <Provider store={makeStore}>
    //             <MedicalHistoryContent {...props} />
    //         </Provider>
    //     );
    //     expect(wrapper.find(MedicalHistoryNoteItem)).toHaveLength(0);
    //     wrapper.find('button').simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find(MedicalHistoryNoteItem)).toHaveLength(1);
    //     wrapper.find('button[title="Yes"]').first().simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('textarea[placeholder="Onset"]')).toHaveLength(1);
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(0);
    //     wrapper.find('textarea[placeholder="Onset"]').simulate('change', {
    //         target: { value: 0 },
    //     });
    //     expect(
    //         wrapper.find('textarea[placeholder="Onset"]').prop('value')
    //     ).toEqual('0');
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(1);
    // });
});

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import MedicalHistoryContent from '../MedicalHistoryContent.tsx';
import { Button } from 'semantic-ui-react';
import { MEDICAL_HISTORY_ACTION } from 'redux/actions/actionTypes';
import AddRowButton from 'components/tools/AddRowButton';
import GridContent from 'components/tools/GridContent';
import ConditionInput from 'components/tools/ConditionInput';
import MedicalHistoryNoteItem from '../MedicalHistoryNoteItem';
import MedicalHistoryNoteRow from '../MedicalHistoryNoteRow';
import { currentNoteStore } from 'redux/store';
import { deleteNote } from 'redux/actions/currentNoteActions';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const initialState = {
    ['foo']: {
        condition: 'Type II Diabetes',
        hasBeenAfflicted: '',
        startYear: -1,
        hasConditionResolved: '',
        endYear: -1,
        comments: '',
    },
    ['bar']: {
        condition: 'Myocardial Infarction',
        hasBeenAfflicted: '',
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
        addSeenCondition: jest.fn(),
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

    test('editing start year dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper
            .find(MedicalHistoryNoteRow)
            .find('textarea[placeholder="Onset"]')
            .first();
        input.simulate('change', {
            target: { value: 2000 },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
                payload: {
                    newStartYear: 2000,
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('mobile start year', () => {
        const { store, wrapper } = itemMount();
        expect(wrapper).toBeTruthy();
        const input = wrapper.find('textarea[placeholder="Onset"]').first();
        expect(input).toHaveLength(1);
        input.simulate('change', {
            target: { value: 2000 },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
                payload: {
                    newStartYear: 2000,
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing end year dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper
            .find(MedicalHistoryNoteRow)
            .find('textarea[placeholder="End Year"]')
            .first();
        input.simulate('change', {
            target: { value: 2001 },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR,
                payload: {
                    newEndYear: 2001,
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('mobile end year', () => {
        const { store, wrapper } = itemMount();
        expect(wrapper).toBeTruthy();
        const input = wrapper.find('textarea[placeholder="End Year"]').first();
        expect(input).toHaveLength(1);
        input.simulate('change', {
            target: { value: 2001 },
        });
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR,
                payload: {
                    newEndYear: 2001,
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

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
        let togglebutton = wrapper
            .find(MedicalHistoryNoteRow)
            .find('ToggleButton[title="Yes"]')
            .first();
        let button = togglebutton.find(Button);
        button.simulate('click');
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
        togglebutton = wrapper.find('ToggleButton[title="No"]').first();
        button = togglebutton.find(Button);
        button.simulate('click');
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
        let togglebutton = wrapper.find('ToggleButton[title="Yes"]').first();
        let button = togglebutton.find(Button);
        expect(button).toHaveLength(1);
        button.simulate('click');
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
        togglebutton = wrapper.find('ToggleButton[title="No"]').first();
        button = togglebutton.find(Button);
        expect(button).toHaveLength(1);
        button.simulate('click');
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
        let togglebutton = wrapper
            .find(MedicalHistoryNoteRow)
            .find('ToggleButton[title="Yes"]')
            .at(1);
        let button = togglebutton.find(Button);
        button.simulate('click');
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
        togglebutton = wrapper
            .find(MedicalHistoryNoteRow)
            .find('ToggleButton[title="No"]')
            .at(1);
        button = togglebutton.find(Button);
        button.simulate('click');
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
        let togglebutton = wrapper.find('ToggleButton[title="Yes"]').at(1);
        let button = togglebutton.find(Button);
        expect(button).toHaveLength(1);
        button.simulate('click');
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
        togglebutton = wrapper.find('ToggleButton[title="No"]').at(1);
        button = togglebutton.find(Button);
        expect(button).toHaveLength(1);
        button.simulate('click');
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

    test('deleting dispatches correct action', () => {
        const { wrapper, store } = connectStore();
        const input = wrapper
            .find('button[aria-label="delete-condition"]')
            .first();
        input.simulate('click');
        const expectedAction = [
            {
                type: MEDICAL_HISTORY_ACTION.DELETE_CONDITION,
                payload: {
                    conditionIndex: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

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
    //         <Provider store={currentNoteStore}>
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('acronyms are not made lowercase', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('acronyms are not made lowercase when more than one word is present', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('roman numerals', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('roman numerals at end of word not changed until after blur', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    test('disease name is standardized with synonym', () => {
        const wrapper = mount(
            <Provider store={currentNoteStore}>
                <MedicalHistoryContent />
            </Provider>
        );
        wrapper
            .find('input[placeholder="Condition"]')
            .first()
            .simulate('change', {
                target: { value: 'heart attack' },
            });
        wrapper.update();
        expect(
            wrapper.find('input[placeholder="Condition"]').first().props().value
        ).toEqual('myocardial infarction');
        currentNoteStore.dispatch(deleteNote());
    });

    // // TODO: Fix below tests
    // test('desktop year validation', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
    //             <MedicalHistoryContent />
    //         </Provider>
    //     );
    //     expect(wrapper.find(MedicalHistoryNoteRow)).toHaveLength(0);
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
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('mobile year validation', () => {
    //     const props = {
    //         mobile: true,
    //     };
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
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

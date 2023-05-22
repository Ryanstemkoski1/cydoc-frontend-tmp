import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { YesNoResponse } from 'constants/enums';
import { FamilyOption } from 'constants/familyHistoryRelations';
import FamilyHistoryContent from '../FamilyHistoryContent';
import FamilyHistoryDropdown from '../FamilyHistoryDropdown';
import { FAMILY_HISTORY_ACTION } from 'redux/actions/actionTypes';
// import ConditionInput from 'components/tools/ConditionInput';
import FamilyHistoryBlock from '../FamilyHistoryBlock';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const initialState = {
    foo: {
        condition: 'Type II Diabetes',
        hasAfflictedFamilyMember: YesNoResponse.No,
        familyMembers: {
            foofoo: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
};

const connectStore = (state = initialState, props) => {
    const store = mockStore({ familyHistory: state });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <FamilyHistoryContent {...props} />
            </Provider>
        ),
    };
};

//These states allow some hidden buttons to be visible without simulating actions.
const activeState = {
    foo: {
        condition: 'Type II Diabetes',
        hasAfflictedFamilyMember: YesNoResponse.Yes,
        familyMembers: {
            foofoo: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
};

const activeState2 = {
    foo: {
        condition: 'Type II Diabetes',
        hasAfflictedFamilyMember: YesNoResponse.Yes,
        familyMembers: {
            foofoo: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.No,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
};

//These are used for mobile tests -- the mobile prop can't be passed down in
//the mounted component.
const connectBlock = (state = initialState) => {
    const store = mockStore({
        familyHistory: state,
        familyHistoryConditions: {
            condition: state.condition,
            hasAfflictedFamilyMember: state.hasAfflictedFamilyMember,
            familyMembers: [
                {
                    foofoo: {
                        member: FamilyOption.None,
                        causeOfDeath: YesNoResponse.None,
                        living: YesNoResponse.None,
                        comments: '',
                    },
                },
            ],
        },
        familyHistoryItem: {
            condition: state.condition,
            hasAfflictedFamilyMember: state.hasAfflictedFamilyMember,
            familyMembers: state.familyMembers,
        },
    });
    const blockProps = {
        index: 'foo',
        mobile: true,
        conditionInp: <div />,
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <FamilyHistoryBlock {...blockProps} />
            </Provider>
        ),
    };
};

const connectDropdown = (state = initialState) => {
    const store = mockStore({
        familyHistory: state,
        familyHistoryMember: state.foo.familyMembers.foofoo,
    });
    const props = {
        index: 'foo',
        family_index: 'foofoo',
        mobile: true,
        condition: 'bar',
        handleDelete: jest.fn(),
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <FamilyHistoryDropdown {...props} />
            </Provider>
        ),
    };
};

describe('FamilyHistoryContent', () => {
    test('render', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
    });

    /*
    Test must be changed using the addFhPopOption() is the reducer
    used rather than addCondition()
    */
    // test('addRow desktop', () => {
    //     const { wrapper, store } = connectStore();
    //     wrapper.find('.add-row button').simulate('click');
    //     const expectedAction = [
    //         {
    //             type: FAMILY_HISTORY_ACTION.ADD_CONDITION,
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
    // test('addRow mobile', () => {
    //     const { wrapper, store } = connectStore(initialState, { mobile: true });
    //     //expect mobile layout
    //     expect(wrapper.find(FamilyHistoryContent).prop('mobile')).toEqual(true);
    //     wrapper.find('.add-row button').simulate('click');
    //     const expectedAction = [
    //         {
    //             type: FAMILY_HISTORY_ACTION.ADD_CONDITION,
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('update condition', () => {
    //     const store = mockStore({ familyHistory: initialState });
    //     const props = {
    //         seenConditions: {},
    //         addSeenCondition: jest.fn,
    //         isPreview: false,
    //         condition: 'Type II Diabetes',
    //         key: '0',
    //         index: 'foo',
    //         category: 'Family History',
    //     };
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <ConditionInput {...props} />
    //         </Provider>
    //     );
    //     wrapper
    //         .find('input[placeholder="Condition"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'bar' },
    //         });
    //     const expectedAction = [
    //         {
    //             type: FAMILY_HISTORY_ACTION.UPDATE_CONDITION_NAME,
    //             payload: {
    //                 conditionIndex: 'foo',
    //                 newCondition: 'bar',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    test('toggle condition desktop', () => {
        const { wrapper, store } = connectStore();
        wrapper.find('button[title="Yes"]').first().simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper.find('button[title="No"]').first().simulate('click');
        const expectedAction2 = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    optionSelected: 'NO',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('toggle condition mobile', () => {
        const { wrapper, store } = connectBlock(initialState);
        //expect mobile layout
        expect(wrapper.find(FamilyHistoryBlock).prop('mobile')).toEqual(true);
        wrapper.find('button[title="Yes"]').first().simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
        store.clearActions();
        wrapper.find('button[title="No"]').first().simulate('click');
        const expectedAction2 = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    optionSelected: 'NO',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction2);
    });

    test('delete family member desktop', () => {
        const { wrapper, store } = connectStore(activeState);
        wrapper
            .find('button[aria-label="delete-button"]')
            .first()
            .simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.DELETE_FAMILY_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('delete family member mobile', () => {
        const { wrapper, store } = connectBlock(activeState);
        //expect mobile layout
        expect(wrapper.find(FamilyHistoryBlock).prop('mobile')).toEqual(true);
        wrapper
            .find('button[aria-label="delete-family-member"]')
            .first()
            .simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.DELETE_FAMILY_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('delete condition desktop', () => {
        const { wrapper, store } = connectStore(activeState);
        wrapper
            .find('button[aria-label="delete-condition"]')
            .first()
            .simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.DELETE_CONDITION,
                payload: {
                    conditionIndex: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('add family member desktop', () => {
        const { wrapper, store } = connectStore(activeState);
        wrapper.find('button .plus').first().simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.ADD_FAMILY_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('add family member mobile', () => {
        const { wrapper, store } = connectBlock(activeState);
        //expect mobile layout
        expect(wrapper.find(FamilyHistoryBlock).prop('mobile')).toEqual(true);
        wrapper.find('button .plus').first().simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.ADD_FAMILY_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update family member desktop', () => {
        const { wrapper, store } = connectStore(activeState);
        wrapper.find('.dropdown-inline').first().simulate('click');
        wrapper.find('[role="option"]').at(1).simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.UPDATE_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    newMember: 'mother',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update family member mobile', () => {
        const { wrapper, store } = connectDropdown(activeState, {
            mobile: true,
        });
        //expect mobile layout
        expect(
            wrapper.find(FamilyHistoryDropdown).first().prop('mobile')
        ).toEqual(true);
        wrapper.find('.dropdown-inline-mobile').first().simulate('click');
        wrapper.find('[role="option"]').at(1).simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.UPDATE_MEMBER,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    newMember: 'mother',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('cause of death toggle desktop', () => {
        const { wrapper, store } = connectStore(activeState);
        wrapper.find('button[title="Yes"]').at(1).simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CAUSE_OF_DEATH_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('cause of death toggle mobile', () => {
        const { wrapper, store } = connectDropdown(activeState);
        //expect mobile layout
        expect(
            wrapper.find(FamilyHistoryDropdown).first().prop('mobile')
        ).toEqual(true);
        wrapper.find('button[title="Yes"]').first().simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_CAUSE_OF_DEATH_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('living toggle desktop', () => {
        const { wrapper, store } = connectStore(activeState2);
        wrapper.find('button[title="Yes"]').at(2).simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_LIVING_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('living toggle mobile', () => {
        const { wrapper, store } = connectDropdown(activeState2);
        wrapper.find('button[title="Yes"]').at(1).simulate('click');
        const expectedAction = [
            {
                type: FAMILY_HISTORY_ACTION.TOGGLE_LIVING_OPTION,
                payload: {
                    conditionIndex: 'foo',
                    familyMemberIndex: 'foofoo',
                    optionSelected: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    // // TODO: Fix below tests
    // test('disease name is standardized with lowercase', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
    //             <FamilyHistoryContent />
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
    //             <FamilyHistoryContent />
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
    //             <FamilyHistoryContent />
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
    //             <FamilyHistoryContent />
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
    //             <FamilyHistoryContent />
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
});

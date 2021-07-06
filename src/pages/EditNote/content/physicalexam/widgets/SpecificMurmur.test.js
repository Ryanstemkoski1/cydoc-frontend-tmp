import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { createCurrentNoteStore } from 'redux/store';
import { MURMURS_WIDGET_ACTION } from 'redux/actions/actionTypes';
import HeartMurmurs from './HeartMurmurs';
import SpecificMurmurs from './SpecificMurmurs';
import { deleteNote } from 'redux/actions/currentNoteActions';

const mockStore = configureStore([]);

const mountWithMockStore = (
    murmurType = '',
    { ...props } = {
        id: 'foo',
    }
) => {
    const initStore = {
        physicalExam: {
            ...initialPhysicalExamState,
            widgets: {
                ...initialPhysicalExamState.widgets,
                murmurs: {
                    ['foo']: {
                        phase: murmurType,
                        //setting these to true because some buttons will trigger these actions
                        crescendo: true,
                        decrescendo: true,
                        bestHeardAt: '',
                        intensity: -1,
                        pitch: '',
                        quality: {
                            blowing: false,
                            harsh: false,
                            rumbling: false,
                            whooshing: false,
                            rasping: false,
                            musical: false,
                        },
                        specificMurmurInfo: {
                            specificMurmur: '',
                            radiationTo: {
                                carotids: false,
                                leftClavicle: false,
                                precordium: false,
                                RLSB: false,
                                LLSB: false,
                                LUSB: false,
                            },
                            additionalFeatures: {
                                increasedWithValsava: false,
                                palpableThrill: false,
                                systolicClick: false,
                                openingSnap: false,
                                early: false,
                                mid: false,
                            },
                        },
                    },
                },
            },
        },
    };
    const store = mockStore(initStore);
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <SpecificMurmurs {...props} />
            </Provider>
        ),
    };
};

const mountWithRealStore = () => {
    const store = createCurrentNoteStore();
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HeartMurmurs />
            </Provider>
        ),
    };
};

describe('Specific Murmurs Redux', () => {
    test('renders', () => {
        const { wrapper } = mountWithMockStore();
        expect(wrapper).toBeTruthy();
    });

    test('toggle specific murmur', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper.find('button').find('i.x').simulate('click');

        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.TOGGLE_SPECIFIC_MURMUR_INFO,
                payload: {
                    id: 'foo',
                    showSpecificMurmurs: false,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update specific murmur systolic', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'aortic stenosis')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.UPDATE_SPECIFIC_MURMUR,
                payload: {
                    id: 'foo',
                    newSpecificMurmur: 'aortic stenosis',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update best heard at systolic', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'best heard at LUSB')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT,
                payload: {
                    id: 'foo',
                    newBestHeardAt: 'LUSB',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('toggle radiation systolic', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'radiation to carotids')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.TOGGLE_RADIATION_TO,
                payload: {
                    id: 'foo',
                    field: 'carotids',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('toggle additional features systolic', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'palpable thrill')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.TOGGLE_ADDITIONAL_FEATURES,
                payload: {
                    id: 'foo',
                    field: 'palpableThrill',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update specific murmur diastolic', () => {
        const { wrapper, store } = mountWithMockStore('diastolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'mitral stenosis')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.UPDATE_SPECIFIC_MURMUR,
                payload: {
                    id: 'foo',
                    newSpecificMurmur: 'mitral stenosis',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('update best heard at diastolic', () => {
        const { wrapper, store } = mountWithMockStore('systolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'best heard at apex')
            .first()
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT,
                payload: {
                    id: 'foo',
                    newBestHeardAt: 'apex',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('toggle additional features diastolic', () => {
        const { wrapper, store } = mountWithMockStore('diastolic');

        wrapper
            .find('button')
            .filterWhere((button) => button.text() === 'mid')
            .simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.TOGGLE_ADDITIONAL_FEATURES,
                payload: {
                    id: 'foo',
                    field: 'mid',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });
});

describe('Specific Murmurs Component', () => {
    test.each([
        ['systolic', 'murmur info', 'aortic stenosis', 'mitral prolapse'],
        ['diastolic', 'murmur info', 'mitral stenosis', 'tricuspid stenosis'],
        [
            'systolic',
            'best heard at',
            'best heard at RUSB',
            'best heard at LUSB',
        ],
        [
            'diastolic',
            'best heard at',
            'best heard at RLSB',
            'best heard at apex',
        ],
    ])('%s %s is single select', (murmurType, testType, tester, comparer) => {
        const { wrapper, store } = mountWithRealStore();
        wrapper.find('button').simulate('click');
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == murmurType)
            .simulate('click');
        wrapper
            .find('button.circular')
            .find('i.plus')
            .first()
            .simulate('click');
        wrapper.update();
        expect(wrapper.find(SpecificMurmurs)).toHaveLength(1);

        //select tester
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == tester)
            .first()
            .simulate('click');
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == tester)
                .first()
                .hasClass('red')
        ).toEqual(true);

        //select comparer
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == comparer)
            .first()
            .simulate('click');

        //only comparer should be selected
        wrapper.update();
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == comparer)
                .first()
                .hasClass('red')
        ).toEqual(true);

        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == tester)
                .first()
                .hasClass('red')
        ).toEqual(false);

        store.dispatch(deleteNote());
    });

    test.each([
        [
            'systolic',
            'radiation',
            'radiation to carotids',
            'radiation to precordium',
        ],
        [
            'systolic',
            'additional features',
            'palpable thrill',
            'systolic click',
        ],
        ['diastolic', 'additional features', 'early', 'mid'],
    ])('%s %s is multiselect', (murmurType, testType, tester, comparer) => {
        const { wrapper, store } = mountWithRealStore();
        wrapper.find('button').simulate('click');
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == murmurType)
            .simulate('click');
        wrapper
            .find('button.circular')
            .find('i.plus')
            .first()
            .simulate('click');
        wrapper.update();
        expect(wrapper.find(SpecificMurmurs)).toHaveLength(1);

        //select tester
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == tester)
            .first()
            .simulate('click');
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == tester)
                .first()
                .hasClass('red')
        ).toEqual(true);

        //select comparer
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == comparer)
            .first()
            .simulate('click');

        //both should be selected
        wrapper.update();
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == comparer)
                .first()
                .hasClass('red')
        ).toEqual(true);

        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == tester)
                .first()
                .hasClass('red')
        ).toEqual(true);

        store.dispatch(deleteNote());
    });

    test('selecting best heard at in expanded widget also is in regular widget', () => {
        const { wrapper, store } = mountWithRealStore();
        wrapper.find('button').simulate('click');
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'systolic')
            .simulate('click');
        wrapper
            .find('button.circular')
            .find('i.plus')
            .first()
            .simulate('click');
        wrapper.update();

        //LLSB button in regular widget is deselected
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'LLSB')
                .hasClass('red')
        ).toBe(false);
        //select best heard at LLSB in expanded widget
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'best heard at LLSB')
            .first()
            .simulate('click');
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'best heard at LLSB')
            .map((button) => {
                expect(button.hasClass('red')).toBe(true);
            });
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'LLSB')
                .hasClass('red')
        ).toBe(true);

        //all other buttons should be inactive
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'LLSB')
            .simulate('click');
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'LLSB')
                .hasClass('red')
        ).toBe(false);
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'best heard at LLSB')
            .map((button) => {
                expect(button.hasClass('red')).toBe(false);
            });
        store.dispatch(deleteNote());
    });

    test('crescendo-decrescendo is triggered by selection of a cresc-decresc button', () => {
        const { wrapper } = mountWithRealStore();
        wrapper.find('button').simulate('click');
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'systolic')
            .simulate('click');
        wrapper
            .find('button.circular')
            .find('i.plus')
            .first()
            .simulate('click');
        wrapper.update();

        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'cresc-decresc')
                .hasClass('red')
        ).toBe(false);

        //find any button in cresc-decresc section
        wrapper
            .find('button')
            .filterWhere((button) => button.text() == 'aortic stenosis')
            .simulate('click');
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'aortic stenosis')
                .hasClass('red')
        ).toBe(true);
        expect(
            wrapper
                .find('button')
                .filterWhere((button) => button.text() == 'cresc-decresc')
                .hasClass('red')
        ).toBe(true);
    });
});

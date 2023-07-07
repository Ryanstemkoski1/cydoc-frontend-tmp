import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import Alcohol from '../Alcohol';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { SOCIAL_HISTORY_ACTION } from 'redux/actions/actionTypes';
import { initialSocialHistoryState } from 'redux/reducers/socialHistoryReducer';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import drinkTypes from 'constants/SocialHistory/drinkTypes';
import drinkSizes from 'constants/SocialHistory/drinkSizes';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    initialSocialHistory = initialSocialHistoryState,
    props = {}
) => {
    const store = mockStore({
        socialHistory: initialSocialHistory,
    });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <Alcohol {...props} />
            </Provider>
        ),
    };
};

const mountDesktop = (socialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: false });
const mountMobile = (socialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: true });

describe('Alcohol Integration', () => {
    let cases = [
        ['Desktop', mountDesktop],
        ['Mobile', mountMobile],
    ];

    test.each(cases)(
        '%s view renders without crashing',
        (_type, mountAlcoholWithStore) => {
            const { wrapper } = mountAlcoholWithStore();
            expect(wrapper).toBeTruthy();
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when clicking Usage buttons',
        (_type, mountAlcoholWithStore) => {
            const { store, wrapper } = mountAlcoholWithStore();
            wrapper
                .find('button[condition="Alcohol"][title="Yes"]')
                .first()
                .simulate('click');
            let expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                    payload: {
                        newUsage: SubstanceUsageResponse.Yes,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);

            wrapper
                .find('button[condition="Alcohol"][title="In the Past"]')
                .first()
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.InThePast,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper
                .find('button[condition="Alcohol"][title="Never Used"]')
                .first()
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.NeverUsed,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when adding alcohol consumption',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                },
            };
            const { store, wrapper } = mountAlcoholWithStore(alcoholState);
            wrapper
                .find('button[aria-label="Add-Alcohol-Consumption-Button"]')
                .simulate('click');

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.ADD_ALCOHOL_CONSUMPTION,
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating drink type',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                    drinksConsumed: [
                        {
                            type: '',
                            size: '',
                            numberPerWeek: -1,
                        },
                    ],
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);

            wrapper
                .find('[aria-label="Alcohol-Consumption-Type-Dropdown"] input')
                .first()
                .simulate('click');

            wrapper
                .find(
                    '[aria-label="Alcohol-Consumption-Type-Dropdown"] [role="option"]'
                )
                .first()
                .simulate('click');

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_TYPE,
                    payload: {
                        index: 0,
                        newType: drinkTypes[0].value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating drink size',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                    drinksConsumed: [
                        {
                            type: '',
                            size: '',
                            numberPerWeek: -1,
                        },
                    ],
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);

            wrapper
                .find('[aria-label="Alcohol-Consumption-Size-Dropdown"] input')
                .first()
                .simulate('click');

            wrapper
                .find(
                    '[aria-label="Alcohol-Consumption-Size-Dropdown"] [role="option"]'
                )
                .first()
                .simulate('click');

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_SIZE,
                    payload: {
                        index: 0,
                        newSize: drinkSizes[0].value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    // // TODO: Fix below tests
    // test.each(cases)(
    //     '%s view dispatches correct action when updating number of drinks consumed per week',
    //     (_type, mountAlcoholWithStore) => {
    //         const alcoholState = {
    //             ...initialSocialHistoryState,
    //             alcohol: {
    //                 ...initialSocialHistoryState.alcohol,
    //                 usage: SubstanceUsageResponse.Yes,
    //                 drinksConsumed: [
    //                     {
    //                         type: '',
    //                         size: '',
    //                         numberPerWeek: -1,
    //                     },
    //                 ],
    //             },
    //         };

    //         const { store, wrapper } = mountAlcoholWithStore(alcoholState);
    //         const value = 2;

    //         wrapper
    //             .find('[aria-label="Alcohol-Number-Per-Week-Input"] input')
    //             .first()
    //             .simulate('change', {
    //                 target: { value },
    //             });

    //         const expectedActions = [
    //             {
    //                 type:
    //                     SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_NUMBER_PER_WEEK,
    //                 payload: {
    //                     index: 0,
    //                     newNumberPerWeek: value,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    test.each(cases)(
        '%s view dispatches correct action when deleting row from alcohol consumption table',
        async (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                    drinksConsumed: [
                        {
                            type: '',
                            size: '',
                            numberPerWeek: -1,
                        },
                    ],
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);

            wrapper
                .find('button[id="btn-hpi-type-delete"]')
                .first()
                .simulate('click');

            wrapper.update();

            const expectedAction = {
                type: SOCIAL_HISTORY_ACTION.DELETE_ALCOHOL_CONSUMPTION,
                payload: {
                    index: 0,
                },
            };

            expect(store.getActions()).toContainEqual(expectedAction);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when clicking "Are you interested in quitting?" buttons',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);
            const expectedActions = [];

            wrapper
                .find(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="Yes"]'
                )
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper
                .find(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="Maybe"]'
                )
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Maybe,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper
                .find(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="No"]'
                )
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.No,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when clicking "Have you tried to quit before?" buttons',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);
            const expectedActions = [];

            wrapper
                .find(
                    '.tried-to-quit-buttons button[condition="Alcohol"][title="Yes"]'
                )
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper
                .find(
                    '.tried-to-quit-buttons button[condition="Alcohol"][title="No"]'
                )
                .simulate('click');
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.No,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating alcohol comments',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);
            const value = 'new comments';

            wrapper
                .find('textarea[field="Comments"][condition="Alcohol"]')
                .simulate('change', {
                    target: { value },
                });
            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_COMMENTS,
                    payload: {
                        newComments: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating quit year',
        (_type, mountAlcoholWithStore) => {
            const alcoholState = {
                ...initialSocialHistoryState,
                alcohol: {
                    ...initialSocialHistoryState.alcohol,
                    usage: SubstanceUsageResponse.InThePast,
                },
            };

            const { store, wrapper } = mountAlcoholWithStore(alcoholState);
            const value = 2020;

            wrapper
                .find('div[field="Quit Year"][condition="Alcohol"] input')
                .simulate('change', {
                    target: { value },
                });
            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_QUIT_YEAR,
                    payload: {
                        newQuitYear: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test('Desktop view properly handles cell click in consumption table', () => {
        const alcoholState = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                usage: SubstanceUsageResponse.Yes,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };

        const { wrapper } = mountWithStore(alcoholState, {
            mobile: false,
        });

        wrapper.find('td').first().simulate('click');

        expect(
            wrapper
                .find('td')
                .first()
                .find('div[role="listbox"][class="visible menu transition"]')
        ).toBeTruthy();
    });

    test('Mobile view properly handles title click in consumption acccordion', () => {
        const alcoholState = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                usage: SubstanceUsageResponse.Yes,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };

        const { wrapper } = mountWithStore(alcoholState, {
            mobile: true,
        });

        expect(
            wrapper.find(
                'div[aria-label="Alcohol-Consumption-Accordion"] div[class="active title"]'
            )
        ).toMatchObject({});
        expect(
            wrapper.find(
                'div[aria-label="Alcohol-Consumption-Accordion"] div[class="active content"]'
            )
        ).toMatchObject({});

        wrapper
            .find('div[aria-label="Alcohol-Consumption-Accordion"]')
            .first()
            .simulate('click');

        expect(
            wrapper
                .find(
                    'div[aria-label="Alcohol-Consumption-Accordion"] div[class="active title"]'
                )
                .first()
        ).toBeTruthy();
        expect(
            wrapper
                .find(
                    'div[aria-label="Alcohol-Consumption-Accordion"] div[class="active content"]'
                )
                .first()
        ).toBeTruthy();
    });
});

import React from 'react';
import Alcohol from '../Alcohol';

import drinkSizes from '../../../../../constants/SocialHistory/drinkSizes';
import drinkTypes from '../../../../../constants/SocialHistory/drinkTypes';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from '../../../../../constants/enums';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { SOCIAL_HISTORY_ACTION } from '../../../../../redux/actions/actionTypes';
import {
    SocialHistoryState,
    initialSocialHistoryState,
} from '../../../../../redux/reducers/socialHistoryReducer';
import { describe, expect, test } from 'vitest';
import { fireEvent, render, within } from '@testing-library/react';
import { Action } from 'redux';

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
        wrapper: render(
            <Provider store={store}>
                <Alcohol {...props} />
            </Provider>
        ),
    };
};

const mountDesktop = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: false });
const mountMobile = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: true });

describe('Alcohol Integration', () => {
    let cases: [
        string,
        (socialHistoryState?: SocialHistoryState) => {
            store: MockStoreEnhanced<unknown, {}>;
            wrapper: any;
        },
    ][] = [
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
            wrapper.container
                .querySelector('button[condition="Alcohol"][title="Yes"]')
                .click();
            let expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                    payload: {
                        newUsage: SubstanceUsageResponse.Yes,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);

            wrapper.container
                .querySelector(
                    'button[condition="Alcohol"][title="In the Past"]'
                )
                .click();
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.InThePast,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper.container
                .querySelector(
                    'button[condition="Alcohol"][title="Never Used"]'
                )
                .click();
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

            wrapper.container
                .querySelector(
                    '[aria-label="Alcohol-Consumption-Type-Dropdown"] input'
                )
                .click();

            wrapper.container
                .querySelector(
                    '[aria-label="Alcohol-Consumption-Type-Dropdown"] [role="option"]'
                )
                .click();

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

            wrapper.container
                .querySelector(
                    '[aria-label="Alcohol-Consumption-Size-Dropdown"] input'
                )
                .click();

            wrapper.container
                .querySelector(
                    '[aria-label="Alcohol-Consumption-Size-Dropdown"] [role="option"]'
                )
                .click();

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

            wrapper.container
                .querySelector('button[id="btn-hpi-type-delete"]')
                .click();

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
            const expectedActions: (Action & { payload: any })[] = [];

            wrapper.container
                .querySelector(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="Yes"]'
                )
                .click();
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper.container
                .querySelector(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="Maybe"]'
                )
                .click();
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Maybe,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper.container
                .querySelector(
                    '.interested-in-quitting-buttons button[condition="Alcohol"][title="No"]'
                )
                .click();
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
            const expectedActions: (Action & { payload: any })[] = [];

            wrapper.container
                .querySelector(
                    '.tried-to-quit-buttons button[condition="Alcohol"][title="Yes"]'
                )
                .click();
            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            wrapper.container
                .querySelector(
                    '.tried-to-quit-buttons button[condition="Alcohol"][title="No"]'
                )
                .click();
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

            fireEvent.change(
                wrapper.container.querySelector(
                    'textarea[field="Comments"][condition="Alcohol"]'
                ),
                {
                    target: { value },
                }
            );
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

            fireEvent.change(
                wrapper.container.querySelector(
                    'div[field="Quit Year"][condition="Alcohol"] input'
                ),
                {
                    target: { value },
                }
            );
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

        const cell = wrapper.container.querySelector(
            'td'
        ) as HTMLTableCellElement;

        cell.click();

        expect(within(cell).findByRole('listbox')).toBeTruthy();
    });
});

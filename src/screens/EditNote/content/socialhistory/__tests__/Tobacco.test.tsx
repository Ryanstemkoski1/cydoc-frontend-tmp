import React from 'react';
import Tobacco from '../Tobacco';

import tobaccoProducts from '../../../../../constants/SocialHistory/tobaccoProducts';
import { SubstanceUsageResponse } from '../../../../../constants/enums';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { SOCIAL_HISTORY_ACTION } from '../../../../../redux/actions/actionTypes';
import {
    SocialHistoryState,
    initialSocialHistoryState,
} from '../../../../../redux/reducers/socialHistoryReducer';
import { describe, expect, test } from 'vitest';
import {
    RenderResult,
    fireEvent,
    queries,
    render,
} from '@testing-library/react';

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
                <Tobacco {...props} />
            </Provider>
        ),
    };
};

const mountDesktop = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: false });
const mountMobile = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: true });

describe('Tobacco Integration', () => {
    let cases: [
        string,
        (socialHistoryState?: SocialHistoryState) => {
            store: MockStoreEnhanced<unknown, {}>;
            wrapper: RenderResult<typeof queries, HTMLElement, HTMLElement>;
        },
    ][] = [
        ['Desktop', mountDesktop],
        ['Mobile', mountMobile],
    ];

    test.each(cases)(
        '%s view renders without crashing',
        (_type, mountTobaccoWithStore) => {
            const { wrapper } = mountTobaccoWithStore();
            expect(wrapper).toBeTruthy();
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating number of packs per day',
        (_type, mountTobaccoWithStore) => {
            const tobaccoState = {
                ...initialSocialHistoryState,
                tobacco: {
                    ...initialSocialHistoryState.tobacco,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
            const value = '2';

            const input = wrapper.container.querySelector(
                'div[field="Packs/Day"][condition="Tobacco"] input'
            ) as HTMLInputElement;

            fireEvent.change(input, {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PACKS_PER_DAY,
                    payload: {
                        newPacksPerDay: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating number of years',
        (_type, mountTobaccoWithStore) => {
            const tobaccoState = {
                ...initialSocialHistoryState,
                tobacco: {
                    ...initialSocialHistoryState.tobacco,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
            const value = 2;

            const input = wrapper.container.querySelector(
                'div[field="Number of Years"][condition="Tobacco"] input'
            ) as HTMLInputElement;

            fireEvent.change(input, {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_NUMBER_OF_YEARS,
                    payload: {
                        newNumberOfYears: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating products used',
        (_type, mountTobaccoWithStore) => {
            const tobaccoState = {
                ...initialSocialHistoryState,
                tobacco: {
                    ...initialSocialHistoryState.tobacco,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountTobaccoWithStore(tobaccoState);

            fireEvent.click(wrapper.getByTestId('tobacco-products-dropdown'));

            (
                wrapper.container.querySelector(
                    '[aria-label="Tobacco-Products-Used-Dropdown"] input'
                ) as HTMLInputElement
            ).click();

            (
                wrapper.container.querySelector(
                    '[aria-label="Tobacco-Products-Used-Dropdown"] [role="option"]'
                ) as HTMLInputElement
            ).click();

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PRODUCTS_USED,
                    payload: {
                        newProductsUsed: [tobaccoProducts[0].value],
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating tobacco comments',
        (_type, mountTobaccoWithStore) => {
            const tobaccoState = {
                ...initialSocialHistoryState,
                tobacco: {
                    ...initialSocialHistoryState.tobacco,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
            const value = 'new comments';

            const input = wrapper.container.querySelector(
                'textarea[field="Comments"][condition="Tobacco"]'
            ) as HTMLInputElement;

            fireEvent.change(input, {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_COMMENTS,
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
        (_type, mountTobaccoWithStore) => {
            const tobaccoState = {
                ...initialSocialHistoryState,
                tobacco: {
                    ...initialSocialHistoryState.tobacco,
                    usage: SubstanceUsageResponse.InThePast,
                },
            };

            const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
            const value = 2020;

            const input = wrapper.container.querySelector(
                'div[field="Quit Year"][condition="Tobacco"] input'
            ) as HTMLInputElement;

            fireEvent.change(input, {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_QUIT_YEAR,
                    payload: {
                        newQuitYear: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );
});

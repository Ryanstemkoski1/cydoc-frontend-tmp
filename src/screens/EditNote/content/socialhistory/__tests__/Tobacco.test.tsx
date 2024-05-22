// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import Enzyme, { mount } from 'enzyme';
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

// Enzyme.configure({ adapter: new Adapter() });

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

    // test.each(cases)(
    //     '%s view dispatches correct action when clicking Usage buttons',
    //     (_type, mountTobaccoWithStore) => {
    //         const { store, wrapper } = mountTobaccoWithStore();
    //         wrapper
    //             .find('button[condition="Tobacco"][title="Yes"]')
    //             .first()
    //             .simulate('click');
    //         let expectedActions = [
    //             {
    //                 type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE,
    //                 payload: {
    //                     newUsage: SubstanceUsageResponse.Yes,
    //                 },
    //             },
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find('button[condition="Tobacco"][title="In the Past"]')
    //             .first()
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE,
    //             payload: {
    //                 newUsage: SubstanceUsageResponse.InThePast,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find('button[condition="Tobacco"][title="Never Used"]')
    //             .first()
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE,
    //             payload: {
    //                 newUsage: SubstanceUsageResponse.NeverUsed,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

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
            const value = 2;

            fireEvent.change(wrapper.getByTestId('tobacco-packs-input'), {
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

            fireEvent.change(wrapper.getByTestId('tobacco-years-input'), {
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

            // wrapper
            //     .find('[aria-label="Tobacco-Products-Used-Dropdown"] input')
            //     .first()
            //     .simulate('click');

            fireEvent.click(wrapper.getByRole('option'), {
                bubbles: false,
                cancelable: true,
            });

            // wrapper
            //     .find(
            //         '[aria-label="Tobacco-Products-Used-Dropdown"] [role="option"]'
            //     )
            //     .first()
            //     .simulate('click', {
            //         nativeEvent: { stopImmediatePropagation: () => {} },
            //     });

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

    // test.each(cases)(
    //     '%s view dispatches correct action when clicking "Are you interested in quitting?" buttons',
    //     (_type, mountTobaccoWithStore) => {
    //         const tobaccoState = {
    //             ...initialSocialHistoryState,
    //             tobacco: {
    //                 ...initialSocialHistoryState.tobacco,
    //                 usage: SubstanceUsageResponse.Yes,
    //             },
    //         };

    //         const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
    //         const expectedActions = [];

    //         wrapper
    //             .find(
    //                 '.interested-in-quitting-buttons button[condition="Tobacco"][title="Yes"]'
    //             )
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING,
    //             payload: {
    //                 newResponse: YesNoMaybeResponse.Yes,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find(
    //                 '.interested-in-quitting-buttons button[condition="Tobacco"][title="Maybe"]'
    //             )
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING,
    //             payload: {
    //                 newResponse: YesNoMaybeResponse.Maybe,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find(
    //                 '.interested-in-quitting-buttons button[condition="Tobacco"][title="No"]'
    //             )
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING,
    //             payload: {
    //                 newResponse: YesNoMaybeResponse.No,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

    // test.each(cases)(
    //     '%s view dispatches correct action when clicking "Have you tried to quit before?" buttons',
    //     (_type, mountTobaccoWithStore) => {
    //         const tobaccoState = {
    //             ...initialSocialHistoryState,
    //             tobacco: {
    //                 ...initialSocialHistoryState.tobacco,
    //                 usage: SubstanceUsageResponse.Yes,
    //             },
    //         };

    //         const { store, wrapper } = mountTobaccoWithStore(tobaccoState);
    //         const expectedActions = [];

    //         wrapper
    //             .find(
    //                 '.tried-to-quit-buttons button[condition="Tobacco"][title="Yes"]'
    //             )
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT,
    //             payload: {
    //                 newResponse: YesNoResponse.Yes,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);

    //         wrapper
    //             .find(
    //                 '.tried-to-quit-buttons button[condition="Tobacco"][title="No"]'
    //             )
    //             .simulate('click');
    //         expectedActions.push({
    //             type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT,
    //             payload: {
    //                 newResponse: YesNoResponse.No,
    //             },
    //         });
    //         expect(store.getActions()).toEqual(expectedActions);
    //     }
    // );

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

            fireEvent.change(wrapper.getByTestId('tobacco-comments-input'), {
                target: { value },
            });

            // wrapper
            //     .find('textarea[field="Comments"][condition="Tobacco"]')
            //     .simulate('change', {
            //         target: { value },
            //     });

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

            fireEvent.change(wrapper.getByTestId('tobacco-quit-year-input'), {
                target: { value },
            });

            // wrapper
            //     .find('div[field="Quit Year"][condition="Tobacco"] input')
            //     .simulate('change', {
            //         target: { value },
            //     });
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

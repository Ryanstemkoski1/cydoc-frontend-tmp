import React from 'react';
import RecreationalDrugs from '../RecreationalDrugs';

import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from '../../../../../constants/enums';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { SOCIAL_HISTORY_ACTION } from '../../../../../redux/actions/actionTypes';
import {
    SocialHistoryState,
    initialSocialHistoryState,
} from '../../../../../redux/reducers/socialHistoryReducer';
import { fireEvent, getByRole, render, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
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
                <RecreationalDrugs {...props} />
            </Provider>
        ),
    };
};

const mountDesktop = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: false });
const mountMobile = (socialHistoryState?: SocialHistoryState) =>
    mountWithStore(socialHistoryState, { mobile: true });

describe('Recreational Drugs Integration', () => {
    let cases: [string, typeof mountDesktop][] = [
        ['Desktop', mountDesktop],
        ['Mobile', mountMobile],
    ];

    test.each(cases)(
        '%s view renders without crashing',
        (_type, mountRecreationalDrugsWithStore) => {
            const { wrapper } = mountRecreationalDrugsWithStore();
            expect(wrapper).toBeTruthy();
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when deleting row from recreational drug consumption table',
        (_type, mountRecreationalDrugsWithStore) => {
            const recreationalDrugsState = {
                ...initialSocialHistoryState,
                recreationalDrugs: {
                    ...initialSocialHistoryState.recreationalDrugs,
                    usage: SubstanceUsageResponse.Yes,
                    drugsUsed: [
                        {
                            name: '',
                            modesOfDelivery: [],
                            numberPerWeek: -1,
                        },
                    ],
                },
            };

            const { store, wrapper } = mountRecreationalDrugsWithStore(
                recreationalDrugsState
            );

            wrapper.getByLabelText('remove').click();
            // .find('button[aria-label="remove"]')
            // .first()
            // .simulate('click');

            // wrapper.update();

            const expectedAction = {
                type: SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED,
                payload: {
                    index: 0,
                },
            };

            expect(store.getActions()).toContainEqual(expectedAction);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when clicking "Are you interested in quitting?" buttons',
        async (_type, mountRecreationalDrugsWithStore) => {
            const recreationalDrugsState = {
                ...initialSocialHistoryState,
                recreationalDrugs: {
                    ...initialSocialHistoryState.recreationalDrugs,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountRecreationalDrugsWithStore(
                recreationalDrugsState
            );
            const expectedActions: (Action & { payload: any })[] = [];

            const divParent = wrapper.getByText(
                'Are you interested in quitting?'
            ).parentElement as HTMLElement;

            within(divParent)
                .getByTestId(`toggle-button-Recreational Drugs-Yes`)
                .click();

            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            within(divParent)
                .getByTestId(`toggle-button-Recreational Drugs-Maybe`)
                .click();

            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Maybe,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            within(divParent)
                .getByTestId(`toggle-button-Recreational Drugs-No`)
                .click();

            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.No,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when clicking "Have you tried to quit before?" buttons',
        (_type, mountRecreationalDrugsWithStore) => {
            const recreationalDrugsState = {
                ...initialSocialHistoryState,
                recreationalDrugs: {
                    ...initialSocialHistoryState.recreationalDrugs,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountRecreationalDrugsWithStore(
                recreationalDrugsState
            );
            const expectedActions: (Action & { payload: any })[] = [];

            const divParent = wrapper.getByText(
                'Have you tried to quit before?'
            ).parentElement as HTMLElement;

            within(divParent)
                .getByTestId(`toggle-button-Recreational Drugs-Yes`)
                .click();

            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);

            within(divParent)
                .getByTestId(`toggle-button-Recreational Drugs-No`)
                .click();

            expectedActions.push({
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.No,
                },
            });
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test.each(cases)(
        '%s view dispatches correct action when updating recreational drugs comments',
        (_type, mountRecreationalDrugsWithStore) => {
            const recreationalDrugsState = {
                ...initialSocialHistoryState,
                recreationalDrugs: {
                    ...initialSocialHistoryState.recreationalDrugs,
                    usage: SubstanceUsageResponse.Yes,
                },
            };

            const { store, wrapper } = mountRecreationalDrugsWithStore(
                recreationalDrugsState
            );
            const value = 'new comments';

            fireEvent.change(getByRole(wrapper.baseElement, 'textbox'), {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS,
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
        (_type, mountRecreationalDrugsWithStore) => {
            const recreationalDrugsState = {
                ...initialSocialHistoryState,
                recreationalDrugs: {
                    ...initialSocialHistoryState.recreationalDrugs,
                    usage: SubstanceUsageResponse.InThePast,
                },
            };

            const { store, wrapper } = mountRecreationalDrugsWithStore(
                recreationalDrugsState
            );
            const value = 2020;

            const input = wrapper.container.querySelector(
                `div[field="Quit Year"][condition="Recreational Drugs"] input`
            ) as HTMLInputElement;

            fireEvent.change(input, {
                target: { value },
            });

            const expectedActions = [
                {
                    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR,
                    payload: {
                        newQuitYear: value,
                    },
                },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        }
    );

    test('Desktop view properly handles cell click in consumption table', () => {
        const recreationalDrugsState = {
            ...initialSocialHistoryState,
            recreationalDrugs: {
                ...initialSocialHistoryState.recreationalDrugs,
                usage: SubstanceUsageResponse.Yes,
                drugsUsed: [
                    {
                        name: '',
                        modesOfDelivery: [],
                        numberPerWeek: -1,
                    },
                ],
            },
        };

        const { wrapper } = mountWithStore(recreationalDrugsState, {
            mobile: false,
        });

        const cell = wrapper.container.querySelector(
            'td'
        ) as HTMLTableCellElement;

        cell.click();

        expect(within(cell).getByRole('listbox')).toBeTruthy();
    });
});

import {
    socialHistoryReducer,
    initialSocialHistoryState,
} from './socialHistoryReducer';
import { SOCIAL_HISTORY_ACTION } from 'redux/actions/actionTypes';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import drinkTypes from 'constants/SocialHistory/drinkTypes';
import drinkSizes from 'constants/SocialHistory/drinkSizes';
import tobaccoProducts from 'constants/SocialHistory/tobaccoProducts';
import drugNames from 'constants/SocialHistory/drugNames';
import modesOfDelivery from 'constants/SocialHistory/modesOfDelivery';

describe('social history reducers', () => {
    it('returns the initial state', () => {
        expect(socialHistoryReducer(undefined, {})).toEqual(
            initialSocialHistoryState
        );
    });
    it('updates alcohol usage', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('adds alcohol consumption', () => {
        const newSocialHistory = socialHistoryReducer(
            initialSocialHistoryState,
            {
                type: SOCIAL_HISTORY_ACTION.ADD_ALCOHOL_CONSUMPTION,
            }
        );
        expect(
            Object.keys(newSocialHistory.alcohol.drinksConsumed).length
        ).toEqual(1);
    });
    it('updates alcohol consumption type', () => {
        const socialHistoryStateWithAlcoholConsumption = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(socialHistoryStateWithAlcoholConsumption, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_TYPE,
                payload: {
                    index: 0,
                    newType: drinkTypes[0].value,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates alcohol consumption size', () => {
        const socialHistoryStateWithAlcoholConsumption = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(socialHistoryStateWithAlcoholConsumption, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_SIZE,
                payload: {
                    index: 0,
                    newSize: drinkSizes[0].value,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates alcohol consumption per week', () => {
        const socialHistoryStateWithAlcoholConsumption = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(socialHistoryStateWithAlcoholConsumption, {
                type:
                    SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_NUMBER_PER_WEEK,
                payload: {
                    index: 0,
                    newNumberPerWeek: 2,
                },
            })
        ).toMatchSnapshot();
    });
    it('deletes alcohol consumption entry', () => {
        const socialHistoryStateWithAlcoholConsumption = {
            ...initialSocialHistoryState,
            alcohol: {
                ...initialSocialHistoryState.alcohol,
                drinksConsumed: [
                    {
                        type: '',
                        size: '',
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        const newSocialHistory = socialHistoryReducer(
            socialHistoryStateWithAlcoholConsumption,
            {
                type: SOCIAL_HISTORY_ACTION.DELETE_ALCOHOL_CONSUMPTION,
                payload: {
                    index: 0,
                },
            }
        );
        expect(
            Object.keys(newSocialHistory.alcohol.drinksConsumed).length
        ).toEqual(0);
    });
    it('updates alcohol quit year', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_QUIT_YEAR,
                payload: {
                    newQuitYear: 2020,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates alcohol comments', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_COMMENTS,
                payload: {
                    newComments: 'new comments',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates alcohol interested in quitting', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type:
                    SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates alcohol tried to quit', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco usage', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco packs per day', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PACKS_PER_DAY,
                payload: {
                    newPacksPerDay: 2,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco number of years', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_NUMBER_OF_YEARS,
                payload: {
                    newNumberOfYears: 2,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco products used', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PRODUCTS_USED,
                payload: {
                    newProductsUsed: [tobaccoProducts[0].value],
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco quit year', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_QUIT_YEAR,
                payload: {
                    newQuitYear: 2020,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco comments', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_COMMENTS,
                payload: {
                    newComments: 'new comments',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco interested in quitting', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type:
                    SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates tobacco tried to quit', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates recreational drug usage', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE,
                payload: {
                    newUsage: SubstanceUsageResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('adds recreational drug consumption', () => {
        const newSocialHistory = socialHistoryReducer(
            initialSocialHistoryState,
            {
                type: SOCIAL_HISTORY_ACTION.ADD_RECREATIONAL_DRUG_USED,
            }
        );
        expect(
            Object.keys(newSocialHistory.recreationalDrugs.drugsUsed).length
        ).toEqual(1);
    });
    it('updates recreational drug consumption name', () => {
        const socialHistoryStateWithRecreationalDrugConsumption = {
            ...initialSocialHistoryState,
            recreationalDrugs: {
                ...initialSocialHistoryState.recreationalDrugs,
                drugsUsed: [
                    {
                        name: '',
                        modesOfDelivery: [],
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(
                socialHistoryStateWithRecreationalDrugConsumption,
                {
                    type:
                        SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NAME,
                    payload: {
                        index: 0,
                        newName: Object.values(drugNames)[0].value,
                    },
                }
            )
        ).toMatchSnapshot();
    });
    it('updates recreational drug consumption modes of delivery', () => {
        const socialHistoryStateWithRecreationalDrugConsumption = {
            ...initialSocialHistoryState,
            recreationalDrugs: {
                ...initialSocialHistoryState.recreationalDrugs,
                drugsUsed: [
                    {
                        name: '',
                        modesOfDelivery: [],
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(
                socialHistoryStateWithRecreationalDrugConsumption,
                {
                    type:
                        SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_MODES_OF_DELIVERY,
                    payload: {
                        index: 0,
                        newSize: modesOfDelivery[0].value,
                    },
                }
            )
        ).toMatchSnapshot();
    });
    it('updates recreational drug consumption per week', () => {
        const socialHistoryStateWithRecreationalDrugConsumption = {
            ...initialSocialHistoryState,
            recreationalDrugs: {
                ...initialSocialHistoryState.recreationalDrugs,
                drugsUsed: [
                    {
                        name: '',
                        modesOfDelivery: [],
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        expect(
            socialHistoryReducer(
                socialHistoryStateWithRecreationalDrugConsumption,
                {
                    type:
                        SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NUMBER_PER_WEEK,
                    payload: {
                        index: 0,
                        newNumberPerWeek: 2,
                    },
                }
            )
        ).toMatchSnapshot();
    });
    it('deletes recreational drug consumption entry', () => {
        const socialHistoryStateWithRecreationalDrugConsumption = {
            ...initialSocialHistoryState,
            recreationalDrugs: {
                ...initialSocialHistoryState.recreationalDrugs,
                drugsUsed: [
                    {
                        name: '',
                        modesOfDelivery: [],
                        numberPerWeek: -1,
                    },
                ],
            },
        };
        const newSocialHistory = socialHistoryReducer(
            socialHistoryStateWithRecreationalDrugConsumption,
            {
                type: SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED,
                payload: {
                    index: 0,
                },
            }
        );
        expect(
            Object.keys(newSocialHistory.recreationalDrugs.drugsUsed).length
        ).toEqual(0);
    });
    it('updates recreational drug quit year', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR,
                payload: {
                    newQuitYear: 2020,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates recreational drug comments', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS,
                payload: {
                    newComments: 'new comments',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates recreational drug interested in quitting', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type:
                    SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
                payload: {
                    newResponse: YesNoMaybeResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates recreational drug tried to quit', () => {
        expect(
            socialHistoryReducer(initialSocialHistoryState, {
                type:
                    SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
                payload: {
                    newResponse: YesNoResponse.Yes,
                },
            })
        ).toMatchSnapshot();
    });
});

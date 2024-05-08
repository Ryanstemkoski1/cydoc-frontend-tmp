import { SOCIAL_HISTORY_ACTION } from '@redux/actions/actionTypes';
import { SocialHistoryActionTypes } from '@redux/actions/socialHistoryActions';
import {
    YesNoResponse,
    YesNoMaybeResponse,
    SubstanceUsageResponse,
} from '@constants/enums';
import { DrinkSize } from 'constants/SocialHistory/drinkSizes';
import { DrinkType } from 'constants/SocialHistory/drinkTypes';
import { DrugName } from 'constants/SocialHistory/drugNames';
import { ModeOfDelivery } from 'constants/SocialHistory/modesOfDelivery';
import { TobaccoProduct } from 'constants/SocialHistory/tobaccoProducts';

export interface SocialHistoryState {
    alcohol: AlcoholState;
    tobacco: TobaccoState;
    recreationalDrugs: RecreationalDrugsState;
    livingSituation: string;
    employment: string;
    diet: string;
    exercise: string;
}

export interface AlcoholState {
    usage: SubstanceUsageResponse;
    drinksConsumed: AlcoholConsumption[];
    interestedInQuitting: YesNoMaybeResponse;
    triedToQuit: YesNoResponse;
    quitYear: number;
    comments: string;
}

export interface TobaccoState {
    usage: SubstanceUsageResponse;
    packsPerDay: number;
    numberOfYears: number;
    productsUsed: TobaccoProduct[];
    interestedInQuitting: YesNoMaybeResponse;
    triedToQuit: YesNoResponse;
    quitYear: number;
    comments: string;
}

export interface RecreationalDrugsState {
    usage: SubstanceUsageResponse;
    drugsUsed: DrugUsage[];
    interestedInQuitting: YesNoMaybeResponse;
    triedToQuit: YesNoResponse;
    quitYear: number;
    comments: string;
}

export interface AlcoholConsumption {
    type: DrinkType;
    size: DrinkSize;
    numberPerWeek: number;
}

export interface DrugUsage {
    name: DrugName;
    modesOfDelivery: ModeOfDelivery[];
    numberPerWeek: number;
}

export const initialSocialHistoryState: SocialHistoryState = {
    alcohol: {
        usage: SubstanceUsageResponse.None,
        drinksConsumed: [],
        interestedInQuitting: YesNoMaybeResponse.None,
        triedToQuit: YesNoResponse.None,
        quitYear: -1,
        comments: '',
    },
    tobacco: {
        usage: SubstanceUsageResponse.None,
        packsPerDay: -1,
        numberOfYears: -1,
        productsUsed: [],
        interestedInQuitting: YesNoMaybeResponse.None,
        triedToQuit: YesNoResponse.None,
        quitYear: -1,
        comments: '',
    },
    recreationalDrugs: {
        usage: SubstanceUsageResponse.None,
        drugsUsed: [],
        interestedInQuitting: YesNoMaybeResponse.None,
        triedToQuit: YesNoResponse.None,
        quitYear: -1,
        comments: '',
    },
    livingSituation: '',
    employment: '',
    diet: '',
    exercise: '',
};

export function socialHistoryReducer(
    state = initialSocialHistoryState,
    action: SocialHistoryActionTypes
): SocialHistoryState {
    switch (action.type) {
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE: {
            const { newUsage } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    usage:
                        newUsage === state.alcohol.usage
                            ? SubstanceUsageResponse.None
                            : newUsage,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.ADD_ALCOHOL_CONSUMPTION: {
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    drinksConsumed: [
                        ...state.alcohol.drinksConsumed,
                        {
                            type: DrinkType.None,
                            size: DrinkSize.None,
                            numberPerWeek: -1,
                        },
                    ],
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_TYPE: {
            const { index, newType } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    drinksConsumed: state.alcohol.drinksConsumed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                type: newType,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_SIZE: {
            const { index, newSize } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    drinksConsumed: state.alcohol.drinksConsumed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                size: newSize,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_NUMBER_PER_WEEK: {
            const { index, newNumberPerWeek } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    drinksConsumed: state.alcohol.drinksConsumed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                numberPerWeek: newNumberPerWeek,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.DELETE_ALCOHOL_CONSUMPTION: {
            const { index } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    drinksConsumed: state.alcohol.drinksConsumed.filter(
                        (_item, ind) => index !== ind
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_QUIT_YEAR: {
            const { newQuitYear } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    quitYear: newQuitYear,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_COMMENTS: {
            const { newComments } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    comments: newComments,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING: {
            const { newResponse } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    interestedInQuitting:
                        newResponse === state.alcohol.interestedInQuitting
                            ? YesNoMaybeResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT: {
            const { newResponse } = action.payload;
            return {
                ...state,
                alcohol: {
                    ...state.alcohol,
                    triedToQuit:
                        newResponse === state.alcohol.triedToQuit
                            ? YesNoResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE: {
            const { newUsage } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    usage:
                        newUsage === state.tobacco.usage
                            ? SubstanceUsageResponse.None
                            : newUsage,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PACKS_PER_DAY: {
            const { newPacksPerDay } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    packsPerDay: newPacksPerDay,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_NUMBER_OF_YEARS: {
            const { newNumberOfYears } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    numberOfYears: newNumberOfYears,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PRODUCTS_USED: {
            const { newProductsUsed } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    productsUsed: newProductsUsed,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_QUIT_YEAR: {
            const { newQuitYear } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    quitYear: newQuitYear,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_COMMENTS: {
            const { newComments } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    comments: newComments,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING: {
            const { newResponse } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    interestedInQuitting:
                        newResponse === state.tobacco.interestedInQuitting
                            ? YesNoMaybeResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT: {
            const { newResponse } = action.payload;
            return {
                ...state,
                tobacco: {
                    ...state.tobacco,
                    triedToQuit:
                        newResponse === state.tobacco.triedToQuit
                            ? YesNoResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE: {
            const { newUsage } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    usage:
                        newUsage === state.recreationalDrugs.usage
                            ? SubstanceUsageResponse.None
                            : newUsage,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.ADD_RECREATIONAL_DRUG_USED: {
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    drugsUsed: [
                        ...state.recreationalDrugs.drugsUsed,
                        {
                            name: DrugName.None,
                            modesOfDelivery: [],
                            numberPerWeek: -1,
                        },
                    ],
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NAME: {
            const { index, newName } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    drugsUsed: state.recreationalDrugs.drugsUsed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                name: newName,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_MODES_OF_DELIVERY: {
            const { index, newModesOfDelivery } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    drugsUsed: state.recreationalDrugs.drugsUsed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                modesOfDelivery: newModesOfDelivery,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NUMBER_PER_WEEK: {
            const { index, newNumberPerWeek } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    drugsUsed: state.recreationalDrugs.drugsUsed.map(
                        (item, ind) => {
                            if (ind !== index) {
                                return item;
                            }
                            return {
                                ...item,
                                numberPerWeek: newNumberPerWeek,
                            };
                        }
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED: {
            const { index } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    drugsUsed: state.recreationalDrugs.drugsUsed.filter(
                        (_item, ind) => index !== ind
                    ),
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR: {
            const { newQuitYear } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    quitYear: newQuitYear,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS: {
            const { newComments } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    comments: newComments,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING: {
            const { newResponse } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    interestedInQuitting:
                        newResponse ===
                        state.recreationalDrugs.interestedInQuitting
                            ? YesNoMaybeResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT: {
            const { newResponse } = action.payload;
            return {
                ...state,
                recreationalDrugs: {
                    ...state.recreationalDrugs,
                    triedToQuit:
                        newResponse === state.recreationalDrugs.triedToQuit
                            ? YesNoResponse.None
                            : newResponse,
                },
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_LIVING_SITUATION: {
            const { newLivingSituation } = action.payload;
            return {
                ...state,
                livingSituation: newLivingSituation,
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_EMPLOYMENT: {
            const { newEmployment } = action.payload;
            return {
                ...state,
                employment: newEmployment,
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_DIET: {
            const { newDiet } = action.payload;
            return {
                ...state,
                diet: newDiet,
            };
        }
        case SOCIAL_HISTORY_ACTION.UPDATE_EXERCISE: {
            const { newExercise } = action.payload;
            return {
                ...state,
                exercise: newExercise,
            };
        }
        default:
            return state;
    }
}

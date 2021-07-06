import { SOCIAL_HISTORY_ACTION } from './actionTypes';
import {
    YesNoResponse,
    SubstanceUsageResponse,
    YesNoMaybeResponse,
} from '../../constants/enums';
import { DrinkSize } from 'constants/SocialHistory/drinkSizes';
import { DrinkType } from 'constants/SocialHistory/drinkTypes';
import { DrugName } from 'constants/SocialHistory/drugNames';
import { ModeOfDelivery } from 'constants/SocialHistory/modesOfDelivery';
import { TobaccoProduct } from 'constants/SocialHistory/tobaccoProducts';

interface UpdateAlcoholUsageAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE;
    payload: {
        newUsage: SubstanceUsageResponse;
    };
}

export function updateAlcoholUsage(newUsage: SubstanceUsageResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_USAGE,
        payload: {
            newUsage,
        },
    };
}

interface AddAlcoholConsumptionAction {
    type: SOCIAL_HISTORY_ACTION.ADD_ALCOHOL_CONSUMPTION;
}

export function addAlcoholConsumption() {
    return {
        type: SOCIAL_HISTORY_ACTION.ADD_ALCOHOL_CONSUMPTION,
    };
}

interface UpdateAlcoholConsumptionTypeAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_TYPE;
    payload: {
        index: number;
        newType: DrinkType;
    };
}

export function updateAlcoholConsumptionType(
    index: number,
    newType: DrinkType
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_TYPE,
        payload: {
            index,
            newType,
        },
    };
}

interface UpdateAlcoholConsumptionSizeAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_SIZE;
    payload: {
        index: number;
        newSize: DrinkSize;
    };
}

export function updateAlcoholConsumptionSize(
    index: number,
    newSize: DrinkSize
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_SIZE,
        payload: {
            index,
            newSize,
        },
    };
}

interface UpdateAlcoholConsumptionPerWeekAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_NUMBER_PER_WEEK;
    payload: {
        index: number;
        newNumberPerWeek: number;
    };
}

export function updateAlcoholConsumptionPerWeek(
    index: number,
    newNumberPerWeek: number
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_CONSUMPTION_NUMBER_PER_WEEK,
        payload: {
            index,
            newNumberPerWeek,
        },
    };
}

interface DeleteAlcoholConsumptionAction {
    type: SOCIAL_HISTORY_ACTION.DELETE_ALCOHOL_CONSUMPTION;
    payload: {
        index: number;
    };
}

export function deleteAlcoholConsumption(index: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.DELETE_ALCOHOL_CONSUMPTION,
        payload: {
            index,
        },
    };
}

interface UpdateAlcoholQuitYearAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_QUIT_YEAR;
    payload: {
        newQuitYear: number;
    };
}

export function updateAlcoholQuitYear(newQuitYear: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_QUIT_YEAR,
        payload: {
            newQuitYear,
        },
    };
}

interface UpdateAlcoholCommentsAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_COMMENTS;
    payload: {
        newComments: string;
    };
}

export function updateAlcoholComments(newComments: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_COMMENTS,
        payload: {
            newComments,
        },
    };
}

interface UpdateAlcoholInterestedInQuittingAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING;
    payload: {
        newResponse: YesNoMaybeResponse;
    };
}

export function updateAlcoholInterestedInQuitting(
    newResponse: YesNoMaybeResponse
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_INTERESTED_IN_QUITTING,
        payload: {
            newResponse,
        },
    };
}

interface UpdateAlcoholTriedToQuitAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT;
    payload: {
        newResponse: YesNoResponse;
    };
}

export function updateAlcoholTriedToQuit(newResponse: YesNoResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_ALCOHOL_TRIED_TO_QUIT,
        payload: {
            newResponse,
        },
    };
}

interface UpdateTobaccoUsageAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE;
    payload: {
        newUsage: SubstanceUsageResponse;
    };
}

export function updateTobaccoUsage(newUsage: SubstanceUsageResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_USAGE,
        payload: {
            newUsage,
        },
    };
}

interface UpdateTobaccoPacksPerDayAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PACKS_PER_DAY;
    payload: {
        newPacksPerDay: number;
    };
}

export function updateTobaccoPacksPerDay(newPacksPerDay: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PACKS_PER_DAY,
        payload: {
            newPacksPerDay,
        },
    };
}

interface UpdateTobaccoNumberOfYearsAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_NUMBER_OF_YEARS;
    payload: {
        newNumberOfYears: number;
    };
}

export function updateTobaccoNumberOfYears(newNumberOfYears: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_NUMBER_OF_YEARS,
        payload: {
            newNumberOfYears,
        },
    };
}

interface UpdateTobaccoProductUsedAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PRODUCTS_USED;
    payload: {
        newProductsUsed: TobaccoProduct[];
    };
}

export function updateTobaccoProductUsed(newProductsUsed: TobaccoProduct[]) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_PRODUCTS_USED,
        payload: {
            newProductsUsed,
        },
    };
}

interface UpdateTobaccoQuitYearAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_QUIT_YEAR;
    payload: {
        newQuitYear: number;
    };
}

export function updateTobaccoQuitYear(newQuitYear: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_QUIT_YEAR,
        payload: {
            newQuitYear,
        },
    };
}

interface UpdateTobaccoCommentsAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_COMMENTS;
    payload: {
        newComments: string;
    };
}

export function updateTobaccoComments(newComments: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_COMMENTS,
        payload: {
            newComments,
        },
    };
}

interface UpdateTobaccoInterestedInQuittingAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING;
    payload: {
        newResponse: YesNoMaybeResponse;
    };
}

export function updateTobaccoInterestedInQuitting(
    newResponse: YesNoMaybeResponse
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_INTERESTED_IN_QUITTING,
        payload: {
            newResponse,
        },
    };
}

interface UpdateTobaccoTriedToQuitAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT;
    payload: {
        newResponse: YesNoResponse;
    };
}

export function updateTobaccoTriedToQuit(newResponse: YesNoResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_TOBACCO_TRIED_TO_QUIT,
        payload: {
            newResponse,
        },
    };
}

interface UpdateRecreationalDrugUsageAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE;
    payload: {
        newUsage: SubstanceUsageResponse;
    };
}

export function updateRecreationalDrugUsage(newUsage: SubstanceUsageResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE,
        payload: {
            newUsage,
        },
    };
}

interface AddRecreationalDrugUsedAction {
    type: SOCIAL_HISTORY_ACTION.ADD_RECREATIONAL_DRUG_USED;
}

export function addRecreationalDrugUsed() {
    return {
        type: SOCIAL_HISTORY_ACTION.ADD_RECREATIONAL_DRUG_USED,
    };
}

interface UpdateRecreationalDrugUsedNameAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NAME;
    payload: {
        index: number;
        newName: DrugName;
    };
}

export function updateRecreationalDrugUsedName(
    index: number,
    newName: DrugName
) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NAME,
        payload: {
            index,
            newName,
        },
    };
}

interface UpdateRecreationalDrugUsedModesOfDeliveryAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_MODES_OF_DELIVERY;
    payload: {
        index: number;
        newModesOfDelivery: ModeOfDelivery[];
    };
}

export function updateRecreationalDrugUsedModesOfDelivery(
    index: number,
    newModesOfDelivery: ModeOfDelivery[]
) {
    return {
        type:
            SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_MODES_OF_DELIVERY,
        payload: {
            index,
            newModesOfDelivery,
        },
    };
}

interface UpdateRecreationalDrugUsedPerWeekAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NUMBER_PER_WEEK;
    payload: {
        index: number;
        newNumberPerWeek: number;
    };
}

export function updateRecreationalDrugUsedPerWeek(
    index: number,
    newNumberPerWeek: number
) {
    return {
        type:
            SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NUMBER_PER_WEEK,
        payload: {
            index,
            newNumberPerWeek,
        },
    };
}

interface DeleteRecreationalDrugUsedAction {
    type: SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED;
    payload: {
        index: number;
    };
}

export function deleteRecreationalDrugUsed(index: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED,
        payload: {
            index,
        },
    };
}

interface UpdateRecreationalDrugQuitYearAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR;
    payload: {
        newQuitYear: number;
    };
}

export function updateRecreationalDrugQuitYear(newQuitYear: number) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR,
        payload: {
            newQuitYear,
        },
    };
}

interface UpdateRecreationalDrugCommentsAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS;
    payload: {
        newComments: string;
    };
}

export function updateRecreationalDrugComments(newComments: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS,
        payload: {
            newComments,
        },
    };
}

interface UpdateRecreationalDrugInterestedInQuittingAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING;
    payload: {
        newResponse: YesNoMaybeResponse;
    };
}

export function updateRecreationalDrugInterestedInQuitting(
    newResponse: YesNoMaybeResponse
) {
    return {
        type:
            SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
        payload: {
            newResponse,
        },
    };
}

interface UpdateRecreationalDrugTriedToQuitAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT;
    payload: {
        newResponse: YesNoResponse;
    };
}

export function updateRecreationalDrugTriedToQuit(newResponse: YesNoResponse) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
        payload: {
            newResponse,
        },
    };
}

interface UpdateLivingSituationAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_LIVING_SITUATION;
    payload: {
        newLivingSituation: string;
    };
}

export function updateLivingSituation(newLivingSituation: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_LIVING_SITUATION,
        payload: {
            newLivingSituation,
        },
    };
}

interface UpdateEmploymentAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_EMPLOYMENT;
    payload: {
        newEmployment: string;
    };
}

export function updateEmployment(newEmployment: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_EMPLOYMENT,
        payload: {
            newEmployment,
        },
    };
}

interface UpdateDietAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_DIET;
    payload: {
        newDiet: string;
    };
}

export function updateDiet(newDiet: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_DIET,
        payload: {
            newDiet,
        },
    };
}

interface UpdateExerciseAction {
    type: SOCIAL_HISTORY_ACTION.UPDATE_EXERCISE;
    payload: {
        newExercise: string;
    };
}

export function updateExercise(newExercise: string) {
    return {
        type: SOCIAL_HISTORY_ACTION.UPDATE_EXERCISE,
        payload: {
            newExercise,
        },
    };
}

export type SocialHistoryActionTypes =
    | UpdateAlcoholUsageAction
    | AddAlcoholConsumptionAction
    | UpdateAlcoholConsumptionTypeAction
    | UpdateAlcoholConsumptionSizeAction
    | UpdateAlcoholConsumptionPerWeekAction
    | DeleteAlcoholConsumptionAction
    | UpdateAlcoholQuitYearAction
    | UpdateAlcoholCommentsAction
    | UpdateAlcoholInterestedInQuittingAction
    | UpdateAlcoholTriedToQuitAction
    | UpdateTobaccoUsageAction
    | UpdateTobaccoPacksPerDayAction
    | UpdateTobaccoNumberOfYearsAction
    | UpdateTobaccoProductUsedAction
    | UpdateTobaccoQuitYearAction
    | UpdateTobaccoCommentsAction
    | UpdateTobaccoInterestedInQuittingAction
    | UpdateTobaccoTriedToQuitAction
    | UpdateRecreationalDrugUsageAction
    | AddRecreationalDrugUsedAction
    | UpdateRecreationalDrugUsedNameAction
    | UpdateRecreationalDrugUsedModesOfDeliveryAction
    | UpdateRecreationalDrugUsedPerWeekAction
    | DeleteRecreationalDrugUsedAction
    | UpdateRecreationalDrugQuitYearAction
    | UpdateRecreationalDrugCommentsAction
    | UpdateRecreationalDrugInterestedInQuittingAction
    | UpdateRecreationalDrugTriedToQuitAction
    | UpdateLivingSituationAction
    | UpdateEmploymentAction
    | UpdateDietAction
    | UpdateExerciseAction;

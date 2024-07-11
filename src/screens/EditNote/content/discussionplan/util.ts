/**
 * @fileoverview Miscellaneous helper functions and types/interfaces for the
 * discussion and plan page.
 */

import { PlanCondition } from '@redux/reducers/planReducer';
import { PlanActionTypes } from '@redux/actions/planActions';
import { WhenResponse, YesNoUncertainResponse } from '@constants/enums';

export interface DropdownOptions {
    value: string;
    label: string;
}

export type EventHandler = (_e: any, data: any) => void;

export type HandleOnAddItem = (_e: any, data: { [key: string]: any }) => void;

export type PlanAction = (
    conditionIndex: string,
    ...args: any[]
) => PlanActionTypes;

export type ConditionCategoryKey = keyof Omit<PlanCondition, 'name'>;

// Initial values with deterministic ids to allow for snapshot testing
export const conditionId = 'condition';
export const categoryId = 'category';
export const initialPlan = {
    conditions: {
        [conditionId]: {
            name: '',
            differentialDiagnoses: {
                [categoryId]: {
                    comments: '',
                    diagnosis: '',
                },
            },
            prescriptions: {
                [categoryId]: {
                    comments: '',
                    dose: '',
                    type: '',
                    signature: '',
                },
            },
            proceduresAndServices: {
                [categoryId]: {
                    comments: '',
                    procedure: '',
                    when: WhenResponse.None,
                },
            },
            referrals: {
                [categoryId]: {
                    comments: '',
                    department: '',
                    when: WhenResponse.None,
                },
            },
        },
    },
    survey: {
        admitToHospital: YesNoUncertainResponse.None,
        emergency: YesNoUncertainResponse.None,
        sicknessLevel: 0,
    },
};

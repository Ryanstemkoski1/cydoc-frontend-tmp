import { GetStripeSetupUrlResponse, SubscriptionInfo } from '@cydoc-ai/types';
import invariant from 'tiny-invariant';
import { getFromApi } from './api';
import { CognitoUser } from 'auth/cognito';

export const getSubscriptionInfo = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<SubscriptionInfo> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<SubscriptionInfo>(
        `/subscription`,
        'getSubscriptionInfo',
        cognitoUser
    ) as Promise<SubscriptionInfo>;
};
export const getStripeSetupUrl = (
    institutionId: string | undefined,
    cognitoUser: CognitoUser | null
): Promise<GetStripeSetupUrlResponse> => {
    invariant(institutionId, '[getStripePaymentSecret] missing institutionId');

    return getFromApi<GetStripeSetupUrlResponse>(
        `/subscription/${institutionId}/payment-setup-url`,
        'getStripePaymentSecret',
        cognitoUser
    ) as Promise<GetStripeSetupUrlResponse>;
};

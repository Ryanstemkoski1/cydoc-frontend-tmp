import React from 'react';

import Policy from '../../constants/Documents/policy';
import { TermsOrPolicyStep } from './TermsOrPolicyStep';

export function PrivacyPolicyStep() {
    return (
        <TermsOrPolicyStep
            fieldName='isPrivacyChecked'
            infoElement={<Policy title={false} />}
            title='Privacy Policy'
            label='Agree To Privacy Policy'
        />
    );
}

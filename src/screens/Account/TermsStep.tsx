import React from 'react';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
import TermsOrPolicyStep from './TermsOrPolicyStep';

export default function TermsStep() {
    return (
        <TermsOrPolicyStep
            fieldName='isTermsChecked'
            infoElement={<Terms_and_conditions title={true} />}
            title='Terms of Service'
            label='Agree To Terms of Service'
        />
    );
}

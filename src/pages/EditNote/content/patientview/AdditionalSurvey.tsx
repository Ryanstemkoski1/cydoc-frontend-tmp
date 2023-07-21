import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';

export interface AdditionalSurveyProps {
    legalFirstName: string;
    legalLastName: string;
    socialSecurityNumber: string;
    dateOfBirth: string;
    setTempAdditionalDetails: (
        tempLegalFirstName: string,
        tempLegalLastName: string,
        tempSocialSecurityNumber: string,
        tempDateOfBirth: string
    ) => void;
}

const AdditionalSurvey = ({
    legalFirstName,
    legalLastName,
    socialSecurityNumber,
    dateOfBirth,
    setTempAdditionalDetails,
}: AdditionalSurveyProps) => {
    const [additionalDetails, setAdditionalDetails] = React.useState({
        legalFirstName: legalFirstName,
        legalLastName: legalLastName,
        socialSecurityNumber: socialSecurityNumber,
        dateOfBirth: dateOfBirth,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdditionalDetails({
            ...additionalDetails,
            [name]: value,
        });
    };

    useEffect(() => {
        setTempAdditionalDetails(
            additionalDetails.legalFirstName,
            additionalDetails.legalLastName,
            additionalDetails.socialSecurityNumber,
            additionalDetails.dateOfBirth
        );
    }, [additionalDetails, setTempAdditionalDetails]);

    return (
        <div className='sixteen wide column'>
            <Form size='small'>
                <div className='equal width fields'>
                    <Form.Input
                        fluid
                        required
                        aria-label='First-Name'
                        label='Legal First Name'
                        name='legalFirstName'
                        placeholder='Legal First Name'
                        defaultValue={additionalDetails.legalFirstName}
                        onChange={handleChange}
                    />
                    <Form.Input
                        fluid
                        required
                        aria-label='last-Name'
                        label='Legal Last Name'
                        name='legalLastName'
                        placeholder='Legal Last Name'
                        defaultValue={additionalDetails.legalLastName}
                        onChange={handleChange}
                    />
                </div>

                <div className='equal width fields'>
                    <Form.Input
                        fluid
                        required
                        aria-label='Social-Security-Number'
                        label='Last 4 SSN'
                        name='socialSecurityNumber'
                        placeholder='Last 4 SSN'
                        minLength={4}
                        maxLength={4}
                        defaultValue={additionalDetails.socialSecurityNumber}
                        onChange={handleChange}
                    />
                    <Form.Input
                        type='date'
                        fluid
                        required
                        aria-label='Date-Of-Birth'
                        label='Date of Birth'
                        name='dateOfBirth'
                        placeholder='mm/dd/yyyy'
                        max={new Date().toJSON().slice(0, 10)}
                        defaultValue={additionalDetails.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
            </Form>
        </div>
    );
};

export default AdditionalSurvey;

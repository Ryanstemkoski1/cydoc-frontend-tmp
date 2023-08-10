import Input from 'components/Input/Input';
import React, { useEffect } from 'react';
import style from './AdditionalSurvey.module.scss';

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
        <div className={style.additionalSurvey}>
            <form className={`${style.additionalSurvey__row} flex-wrap`}>
                <div className={style.additionalSurvey__col}>
                    <Input
                        label='Legal First Name'
                        required={true}
                        aria-label='First-Name'
                        name='legalFirstName'
                        placeholder='Legal First Name'
                        defaultValue={additionalDetails.legalFirstName}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.additionalSurvey__col}>
                    <Input
                        required={true}
                        aria-label='last-Name'
                        label='Legal Last Name'
                        name='legalLastName'
                        placeholder='Legal Last Name'
                        defaultValue={additionalDetails.legalLastName}
                        onChange={handleChange}
                    />
                </div>

                <div className={style.additionalSurvey__col}>
                    <Input
                        required={true}
                        label='Last 4 SSN'
                        name='socialSecurityNumber'
                        placeholder='Last 4 SSN'
                        minLength={4}
                        maxLength={4}
                        defaultValue={additionalDetails.socialSecurityNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.additionalSurvey__col}>
                    <Input
                        required={true}
                        type='date'
                        label='Date of Birth'
                        name='dateOfBirth'
                        placeholder='mm/dd/yyyy'
                        max={new Date().toJSON().slice(0, 10)}
                        defaultValue={additionalDetails.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default AdditionalSurvey;

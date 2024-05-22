import { ProductType } from 'assets/enums/route.enums';
import Input from 'components/Input/Input';
import MobileDatePicker from 'components/Input/MobileDatePicker';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import style from './AdditionalSurvey.module.scss';

export interface AdditionalSurveyProps {
    legalFirstName: string;
    legalLastName: string;
    legalMiddleName: string;
    socialSecurityNumber: string;
    dateOfBirth: string;
    setTempAdditionalDetails: (
        tempLegalFirstName: string,
        tempLegalLastName: string,
        tempLegalMiddleName: string,
        tempSocialSecurityNumber: string,
        tempDateOfBirth: string
    ) => void;
}

const AdditionalSurvey = ({
    legalFirstName,
    legalLastName,
    legalMiddleName,
    socialSecurityNumber,
    dateOfBirth,
    setTempAdditionalDetails,
}: AdditionalSurveyProps) => {
    const [additionalDetails, setAdditionalDetails] = React.useState({
        legalFirstName: legalFirstName,
        legalLastName: legalLastName,
        legalMiddleName: legalMiddleName,
        socialSecurityNumber: socialSecurityNumber,
        dateOfBirth: dateOfBirth,
    });

    const isHPIPage = useLocation().pathname.includes(ProductType.HPI);
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

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
            additionalDetails.legalMiddleName,
            additionalDetails.socialSecurityNumber,
            additionalDetails.dateOfBirth
        );
    }, [additionalDetails, setTempAdditionalDetails]);

    return (
        <div className={style.additionalSurvey}>
            <form className={`${style.additionalSurvey__row} flex-wrap`}>
                <div
                    className={`${style.additionalSurvey__col} ${
                        isHPIPage && style.additionalSurvey__four
                    }`}
                >
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

                {isHPIPage && (
                    <div
                        className={`${style.additionalSurvey__col} ${style.additionalSurvey__four}`}
                    >
                        <Input
                            aria-label='middle-Name'
                            label='Legal Middle Name'
                            name='legalMiddleName'
                            placeholder='Legal Middle Name'
                            defaultValue={additionalDetails.legalMiddleName}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div
                    className={`${style.additionalSurvey__col} ${
                        isHPIPage && style.additionalSurvey__four
                    }`}
                >
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
                    {isMobile ? (
                        <>
                            <label>Date of Birth</label>
                            <MobileDatePicker
                                value={additionalDetails.dateOfBirth}
                                handleChange={(value) => {
                                    setAdditionalDetails({
                                        ...additionalDetails,
                                        dateOfBirth: value,
                                    });
                                }}
                            />
                        </>
                    ) : (
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
                    )}
                </div>
                {/* <div className={style.additionalSurvey__col}>
                    <Input
                        label='Last 4 SSN'
                        name='socialSecurityNumber'
                        placeholder='Last 4 SSN'
                        minLength={4}
                        maxLength={4}
                        defaultValue={additionalDetails.socialSecurityNumber}
                        onChange={handleChange}
                    />
                </div> */}
            </form>
        </div>
    );
};

export default AdditionalSurvey;

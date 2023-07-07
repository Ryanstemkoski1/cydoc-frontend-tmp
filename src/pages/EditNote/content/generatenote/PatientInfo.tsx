import React from 'react';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import './GenerateNote.css';

interface PatentInfoProps {
    isRichText: boolean;
    additionalSurveyState: additionalSurvey;
}
const PatientInfo = ({ additionalSurveyState }: PatentInfoProps) => {
    return (
        <div className='patientInfoWrapper'>
            <ul>
                <li>
                    <label>First Name:</label>{' '}
                    {additionalSurveyState.legalFirstName || '-'}
                </li>
                <li>
                    <label>Last Name:</label>{' '}
                    {additionalSurveyState.legalLastName || '-'}
                </li>
                <li>
                    <label>Last 4 SSN: </label>
                    {additionalSurveyState.socialSecurityNumber || '-'}
                </li>
                <li>
                    <label>Date of Birth:</label>{' '}
                    {additionalSurveyState.dateOfBirth || '-'}
                </li>

                <li>
                    <label>Phone Number:</label>{' '}
                    {additionalSurveyState.userInfo.cellPhoneNumber || '-'}
                </li>

                <li>
                    <label>Email Address:</label>{' '}
                    {additionalSurveyState.userInfo.email || '-'}
                </li>

                <li>
                    <label>Address Line 1: </label>{' '}
                    {additionalSurveyState?.userInfo?.address?.addressLine1 ||
                        '-'}
                </li>
                <li>
                    <label>Address Line 1: </label>{' '}
                    {additionalSurveyState?.userInfo?.address?.addressLine2 ||
                        '-'}
                </li>
                <li>
                    <label>City: </label>{' '}
                    {additionalSurveyState.userInfo.address.city || '-'}
                </li>
                <li>
                    <label>State: </label>{' '}
                    {additionalSurveyState.userInfo.address.state || '-'}
                </li>
                <li>
                    <label>Zip Code: </label>{' '}
                    {additionalSurveyState.userInfo.address.zipCode || '-'}
                </li>

                <li>
                    <label>Race: </label>{' '}
                    {additionalSurveyState.userInfo.race.length
                        ? (additionalSurveyState.userInfo.race || []).map(
                              (el) => el + ' '
                          )
                        : '-'}
                </li>

                <li>
                    <label>Gender Identity: </label>{' '}
                    {additionalSurveyState.userInfo.genderIdentity.length
                        ? (
                              additionalSurveyState.userInfo.genderIdentity ||
                              []
                          ).map((el) => el + ' ')
                        : '-'}
                </li>

                <li>
                    <label>Ethnicity: </label>{' '}
                    {additionalSurveyState.userInfo.ethnicity || '-'}
                </li>

                <li>
                    <label>Sex assigned at birth: </label>{' '}
                    {additionalSurveyState.userInfo.sex || '-'}
                </li>
                <li>
                    <label>Preferred pronouns: </label>{' '}
                    {additionalSurveyState.userInfo.preferredPronouns || '-'}
                </li>
                <li>
                    <label>Title: </label>{' '}
                    {additionalSurveyState.userInfo.title || '-'}
                </li>

                <li>
                    <label>Are you insured:</label>{' '}
                    {additionalSurveyState.userInfo.isInsured ? 'YES' : 'No'}
                </li>
                {additionalSurveyState.userInfo.isInsured && (
                    <>
                        <li>
                            <label>Insurance company:</label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .insuranceCompanyName || ''}
                        </li>
                        <li>
                            <label>Insurance company Phone number: </label>{' '}
                            {additionalSurveyState?.userInfo?.insuranceInfo
                                ?.insuranceCompanyPhoneNumber || '-'}
                        </li>
                        <li>
                            <label>Policy holders name: </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderName || ''}
                        </li>
                        <li>
                            <label>
                                Policy holders relationship to patient:
                            </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderRelationship || ''}
                        </li>
                        <li>
                            <label>Policy holders DOB: </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderDOB || ''}
                        </li>

                        <li>
                            <label>Is Policy holder Employed: </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderEmployed
                                ? 'YES'
                                : 'NO'}
                        </li>

                        {additionalSurveyState.userInfo.insuranceInfo
                            .policyHolderEmployed && (
                            <li>
                                <label>Policy holders employer: </label>{' '}
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderEmployer || ''}
                            </li>
                        )}

                        <li>
                            <label>Policy holders SSN: </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderSSN || '-'}
                        </li>
                        <li>
                            <label>Policy holders ID: </label>{' '}
                            {additionalSurveyState.userInfo.insuranceInfo
                                .policyHolderID || ''}
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};
export default PatientInfo;

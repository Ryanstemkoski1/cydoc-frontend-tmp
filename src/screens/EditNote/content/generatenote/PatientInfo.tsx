import React from 'react';
import { AdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import './GenerateNote.css';

interface PatentInfoProps {
    isRichText: boolean;
    additionalSurveyState: AdditionalSurvey;
}
const PatientInfo = ({ additionalSurveyState }: PatentInfoProps) => {
    return (
        <div className='patientInfoWrapper'>
            <ul>
                <li>
                    <label>First Name</label>
                    <p>{additionalSurveyState.legalFirstName || '-'}</p>
                </li>
                <li>
                    <label>Last Name</label>
                    <p>{additionalSurveyState.legalLastName || '-'}</p>
                </li>
                <li>
                    <label>Last 4 SSN</label>
                    <p>{additionalSurveyState.socialSecurityNumber || '-'}</p>
                </li>
                <li>
                    <label>Date of Birth</label>
                    <p>{additionalSurveyState.dateOfBirth || '-'}</p>
                </li>

                <li>
                    <label>Phone Number</label>
                    <p>
                        {additionalSurveyState.userInfo.cellPhoneNumber || '-'}
                    </p>
                </li>

                <li>
                    <label>Email Address</label>
                    <p>{additionalSurveyState.userInfo.email || '-'}</p>
                </li>

                <li>
                    <label>Address Line 1</label>
                    <p>
                        {additionalSurveyState?.userInfo?.address
                            ?.addressLine1 || '-'}
                    </p>
                </li>
                <li>
                    <label>Address Line 1</label>
                    <p>
                        {additionalSurveyState?.userInfo?.address
                            ?.addressLine2 || '-'}
                    </p>
                </li>
                <li>
                    <label>City</label>
                    <p>{additionalSurveyState.userInfo.address.city || '-'}</p>
                </li>
                <li>
                    <label>State</label>
                    <p>{additionalSurveyState.userInfo.address.state || '-'}</p>
                </li>
                <li>
                    <label>Zip Code</label>
                    <p>
                        {additionalSurveyState.userInfo.address.zipCode || '-'}
                    </p>
                </li>

                <li>
                    <label>Race</label>
                    <p>
                        {additionalSurveyState.userInfo.race.length
                            ? (additionalSurveyState.userInfo.race || []).map(
                                  (el) => el + ' '
                              )
                            : '-'}
                    </p>
                </li>

                <li>
                    <label>Gender Identity</label>
                    <p>
                        {additionalSurveyState.userInfo.genderIdentity.length
                            ? (
                                  additionalSurveyState.userInfo
                                      .genderIdentity || []
                              ).map((el) => el + ' ')
                            : '-'}
                    </p>
                </li>

                <li>
                    <label>Ethnicity</label>
                    <p>{additionalSurveyState.userInfo.ethnicity || '-'}</p>
                </li>

                <li>
                    <label>Sex Assigned At Birth</label>
                    <p>{additionalSurveyState.userInfo.sex || '-'}</p>
                </li>
                <li>
                    <label>Preferred Pronouns</label>
                    <p>
                        {additionalSurveyState.userInfo.preferredPronouns ||
                            '-'}
                    </p>
                </li>
                <li>
                    <label>Title</label>
                    <p>{additionalSurveyState.userInfo.title || '-'}</p>
                </li>

                <li>
                    <label>Insured</label>
                    <p>
                        {additionalSurveyState.userInfo.isInsured
                            ? 'YES'
                            : 'No'}
                    </p>
                </li>
                {additionalSurveyState.userInfo.isInsured && (
                    <>
                        <li>
                            <label>Insurance Company</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .insuranceCompanyName || ''}
                            </p>
                        </li>
                        <li>
                            <label>Insurance Company Phone</label>
                            <p>
                                {additionalSurveyState?.userInfo?.insuranceInfo
                                    ?.insuranceCompanyPhoneNumber || '-'}
                            </p>
                        </li>
                        <li>
                            <label>Policy Holder&apos;s name</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderName || ''}
                            </p>
                        </li>
                        <li>
                            <label>
                                Policy Holder&apos;s Relationship to Patient
                            </label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderRelationship || ''}
                            </p>
                        </li>
                        <li>
                            <label>Policy Holder&apos;s DOB</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderDOB || ''}
                            </p>
                        </li>

                        <li>
                            <label>Policy Holder Employed</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderEmployed
                                    ? 'YES'
                                    : 'NO'}
                            </p>
                        </li>

                        {additionalSurveyState.userInfo.insuranceInfo
                            .policyHolderEmployed && (
                            <li>
                                <label>Policy Holder&apos;s Employer</label>
                                <p>
                                    {additionalSurveyState.userInfo
                                        .insuranceInfo.policyHolderEmployer ||
                                        ''}
                                </p>
                            </li>
                        )}

                        <li>
                            <label>Policy Holder&apos;s SSN#</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderSSN || '-'}
                            </p>
                        </li>
                        <li>
                            <label>Policy Holder&apos;s ID</label>
                            <p>
                                {additionalSurveyState.userInfo.insuranceInfo
                                    .policyHolderID || ''}
                            </p>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};
export default PatientInfo;

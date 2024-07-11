import React, { Component } from 'react';
import { PlanCondition, PlanState } from '@redux/reducers/planReducer';

interface Props {
    planState: PlanState;
}

interface EmptyPlan {
    differentialDiagnoses: boolean;
    proceduresAndServices: boolean;
    name: boolean;
    referrals: boolean;
    prescriptions: boolean;
}

export const EMPTY_NOTE_TEXT = '';

export class PlanNote extends Component<Props> {
    checkEmpty = (condition: PlanCondition): EmptyPlan => {
        const diffDiagKey = Object.keys(condition.differentialDiagnoses)[0];
        const prescriptionKey = Object.keys(condition.prescriptions)[0];
        const procServKey = Object.keys(condition.proceduresAndServices)[0];
        const refKey = Object.keys(condition.referrals)[0];

        const diffDiagEmpty =
            condition.differentialDiagnoses[diffDiagKey].comments === '' &&
            condition.differentialDiagnoses[diffDiagKey].diagnosis === '';
        const procServEmpty =
            condition.proceduresAndServices[procServKey].comments === '' &&
            condition.proceduresAndServices[procServKey].procedure === '' &&
            condition.proceduresAndServices[procServKey].when === '';
        const prescriptionEmpty =
            condition.prescriptions[prescriptionKey].comments === '' &&
            condition.prescriptions[prescriptionKey].dose === '' &&
            condition.prescriptions[prescriptionKey].signature === '' &&
            condition.prescriptions[prescriptionKey].type === '';
        const refEmpty =
            condition.referrals[refKey].comments === '' &&
            condition.referrals[refKey].department === '' &&
            condition.referrals[refKey].when === '';
        return {
            differentialDiagnoses: diffDiagEmpty,
            proceduresAndServices: procServEmpty,
            prescriptions: prescriptionEmpty,
            referrals: refEmpty,
            name: condition.name === '',
        };
    };

    trimDiseaseName = (procedure: string) => {
        return procedure;
    };

    editWhen = (when: string) => {
        return when.toLowerCase().split('_').join(' ');
    };

    render(): React.ReactNode {
        const plan = this.props.planState;
        return Object.values(plan.conditions).map((condition, i) => {
            const empty = this.checkEmpty(condition);
            if (
                empty.differentialDiagnoses &&
                empty.proceduresAndServices &&
                empty.prescriptions &&
                empty.name &&
                empty.referrals
            ) {
                return <div key={i}>{EMPTY_NOTE_TEXT}</div>;
            }
            return (
                <div className='plan-note' key={i}>
                    {!empty.name ? <h4>{condition.name}</h4> : null}

                    {!empty.differentialDiagnoses ? (
                        <>
                            <b>Diagnosis</b>
                            <ol>
                                {Object.values(
                                    condition.differentialDiagnoses
                                ).map((diagnoses, i) => (
                                    <li key={i}>
                                        {diagnoses.diagnosis ? (
                                            <b>
                                                {this.trimDiseaseName(
                                                    diagnoses.diagnosis
                                                )}
                                            </b>
                                        ) : null}
                                        {diagnoses.comments
                                            ? ': ' + diagnoses.comments
                                            : null}
                                    </li>
                                ))}
                            </ol>
                        </>
                    ) : null}

                    {!empty.prescriptions ? (
                        <>
                            <b>Prescriptions</b>
                            <ul>
                                {Object.values(condition.prescriptions).map(
                                    (prescription, i) => (
                                        <li key={i}>
                                            {prescription.type ? (
                                                <b>{prescription.type}: </b>
                                            ) : (
                                                ''
                                            )}
                                            {prescription.dose === ''
                                                ? null
                                                : `${prescription.dose}. `}
                                            {prescription.signature === ''
                                                ? null
                                                : `${prescription.signature}. `}
                                            {prescription.comments}
                                        </li>
                                    )
                                )}
                            </ul>
                        </>
                    ) : null}

                    {!empty.proceduresAndServices ? (
                        <>
                            <b>Procedures and Services</b>
                            <ul>
                                {Object.values(
                                    condition.proceduresAndServices
                                ).map((procedure, i) => (
                                    <li key={i}>
                                        <b>{`${this.trimDiseaseName(
                                            procedure.procedure
                                        )} `}</b>
                                        {`${this.editWhen(procedure.when)}${
                                            procedure.when ? '.' : ''
                                        } ${procedure.comments}`}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}

                    {!empty.referrals ? (
                        <>
                            <b>Referrals</b>
                            <ul>
                                {Object.values(condition.referrals).map(
                                    (referral, i) => (
                                        <li key={i}>
                                            <b>
                                                {referral.department
                                                    ? `Referred to see ${referral.department}. `
                                                    : ''}
                                            </b>
                                            {`${this.editWhen(referral.when)}${
                                                referral.when ||
                                                referral.department
                                                    ? '.'
                                                    : ''
                                            } ${referral.comments}`}
                                        </li>
                                    )
                                )}
                            </ul>
                        </>
                    ) : null}
                </div>
            );
        });
    }
}

export default PlanNote;

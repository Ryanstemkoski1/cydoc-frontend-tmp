import React, { Component } from 'react';
import { PlanState } from 'redux/reducers/planReducer';

interface PlanProps {
    planState: PlanState;
}

export const EMPTY_NOTE_TEXT = 'No plan reported.';

export class PlanNote extends Component<PlanProps> {
    checkEmpty = (): boolean => {
        const conditions = Object.values(this.props.planState.conditions);
        return conditions.length === 0 || conditions[0].name.length === 0;
    };

    render(): React.ReactNode {
        const plan = this.props.planState;

        if (this.checkEmpty()) {
            return <div>{EMPTY_NOTE_TEXT}</div>;
        } else {
            return Object.values(plan.conditions).map((condition, i) => (
                <div className='plan-note' key={i}>
                    <h4>{condition.name}</h4>

                    <b>Differential Diagnosis</b>
                    <ol>
                        {Object.values(condition.differentialDiagnoses).map(
                            (diagnoses, i) => (
                                <li key={i}>
                                    <b>{diagnoses.diagnosis}: </b>
                                    {diagnoses.comments
                                        ? diagnoses.comments
                                        : null}
                                </li>
                            )
                        )}
                    </ol>

                    <b>Prescriptions</b>
                    <ul>
                        {Object.values(condition.prescriptions).map(
                            (prescription, i) => (
                                <li key={i}>
                                    <b>{prescription.type}: </b>
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

                    <b>Procedures and Services</b>
                    <ul>
                        {Object.values(condition.proceduresAndServices).map(
                            (procedure, i) => (
                                <li key={i}>
                                    <b>{`${procedure.procedure} `}</b>
                                    {`${procedure.when}. ${procedure.comments}`}
                                </li>
                            )
                        )}
                    </ul>

                    <b>Referrals</b>
                    <ul>
                        {Object.values(condition.referrals).map(
                            (referral, i) => (
                                <li key={i}>
                                    <b>
                                        {`Referred to see ${referral.department} `}
                                    </b>
                                    {`${referral.when}. ${referral.comments}`}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            ));
        }
    }
}

export default PlanNote;

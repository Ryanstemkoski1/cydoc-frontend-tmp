import React from 'react';

class PlanNote extends React.Component {

    render() {
        const plan = this.props.plan;
        const conditions = plan.conditions;

        if (conditions.length === 0) {
            return (
                <div>No plan reported.</div>
            );
        }

        return (
            Object.keys(conditions).map(key => (
                <div>
                    <h4>{conditions[key].name}</h4>
                    
                    <b>Differential Diagnosis</b>
                    <ol>
                        {Object.keys(conditions[key].differential_diagnosis).map(condition => (
                            <li key={key}>
                                <b>{conditions[key].differential_diagnosis[condition].diagnosis}: </b>
                                {conditions[key].differential_diagnosis[condition].comment ? conditions[key].differential_diagnosis[condition].comment : null}
                            </li>
                        ))}
                    </ol>
                    
                    <b>Prescriptions</b>
                    <ul>
                        {Object.keys(conditions[key].prescriptions).map(prescription => (
                            <li key={key}>
                                <b>{conditions[key].prescriptions[prescription].recipe_type} </b>    
                                {conditions[key].prescriptions[prescription].recipe_amount === "" ? null : `${conditions[key].prescriptions[prescription].recipe_amount}. `} 
                                {conditions[key].prescriptions[prescription].signatura === "" ? null : `${conditions[key].prescriptions[prescription].signatura}. `}
                                {conditions[key].prescriptions[prescription].comment} 
                            </li>
                        ))}
                    </ul>

                    <b>Procedures and Services</b>
                    <ul>
                        {Object.keys(conditions[key].procedures_and_services).map(procedure => (
                            <li key={key}>
                                {`${conditions[key].procedures_and_services[procedure].procedure} ${conditions[key].procedures_and_services[procedure].when}. ${conditions[key].procedures_and_services[procedure].comment}`}
                            </li>
                        ))}
                    </ul>

                    <b>Referrals</b>
                    <ul>
                        {Object.keys(conditions[key].referrals).map(referral => (
                            <li key={key}>
                                {`Referred to see ${conditions[key].referrals[referral].department} ${conditions[key].referrals[referral].when}. ${conditions[key].referrals[referral].comment}`}
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        )
    }
}

export default PlanNote;
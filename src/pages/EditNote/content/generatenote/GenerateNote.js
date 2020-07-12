import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';

class GenerateNote extends React.Component {

    static contextType = HPIContext

    reviewOfSystems() {
        const review = this.context["Review of Systems"];

        // EXAMPLE:
        // Review of Systems
        //   - General
        //      - Positive: ..., ..., ..., ...
        //      - Negative: ..., ..., ..., ...
        var components = [];
        for (var key in review) {
            var positives = "";
            var negatives = "";
            // console.log(key);
            // console.log(review[key]);
            for (var question in review[key]) {
                // console.log(question);
                // console.log(review[key][question])
                if (review[key][question] === 'y') {
                    positives += question + ", ";
                } else if (review[key][question] === 'n') {
                    negatives += question + ", ";
                }
            }
            positives = positives.slice(0, positives.length - 2)
            negatives = negatives.slice(0, negatives.length - 2)
            // console.log(positives);
            // console.log(negatives);
            components[key] = {
                positives: positives,
                negatives: negatives
            }
        }
        // console.log(components);

        return (
            <div>
                {Object.keys(components).map(key => (
                    <div>
                        <h4> {key} </h4>
                        <li> Positive for: {components[key].positives} </li>
                        <li> Negative for: {components[key].negatives} </li>
                    </div>
                ))}
            </div>
        )
    }

    // TODO: look more into this class -- do an extensive testing of all buttons/sections
    // unclear if this 100% works because of how the data is stored but it's definitely close
    // probably should look more into widgets 
    physicalExam() {
        const physical = this.context["Physical Exam"];
        console.log(physical);
        
        var components = [];
        for (var key in physical) {
            var active = "";
            for (var question in physical[key]) {
                // console.log(question);
                // console.log(physical[key][question]);
                if (typeof physical[key][question] === 'object') {
                    // console.log(question);
                    if (physical[key][question].active === true) {
                        if (physical[key][question].left === true) {
                            active += question + ' (left), '
                        }
                        if (physical[key][question].right === true) {
                            active += question + ' (right), '
                        }
                    }
                }
                else if (physical[key][question] === true) {
                    active += question + ', ';
                }
                else if (physical[key][question] !== "" && physical[key][question] !== false) {
                    active += question + ': ' + physical[key][question] + ', ';
                }
            }
            active = active.slice(0, active.length - 2);
            components[key] = {
                active: active
            }
        }

        return (
            <div>
                {Object.keys(components).map(key => (
                    <li key={key}>
                        {key}: {components[key].active}
                    </li>
                ))}
            </div>
        )
    }

    plan() {
        const plan = this.context.plan;
        const conditions = plan.conditions;
        // console.log(plan);
        // console.log(plan.conditions);

        return (
            <div>
                {Object.keys(conditions).map(key => (
                    <div>
                        <h4> {conditions[key].name} </h4>
                        
                        <h5> Differential Diagnosis </h5>
                        <ul>
                            {Object.keys(conditions[key].differential_diagnosis).map(condition => (
                                <li key={key}>
                                    {conditions[key].differential_diagnosis[condition].diagnosis}
                                    <ul>
                                        <li> Comment: {conditions[key].differential_diagnosis[condition].comment} </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        
                        <h5> Prescriptions </h5>
                        <ul>
                            {Object.keys(conditions[key].prescriptions).map(prescription => (
                                <li key={key}>
                                    {conditions[key].prescriptions[prescription].recipe_type}
                                    <ul>
                                        <li> 
                                            <b> Amount: </b> 
                                            {conditions[key].prescriptions[prescription].recipe_amount} 
                                        </li>
                                        <li> 
                                            <b> Signatura: </b> 
                                            {conditions[key].prescriptions[prescription].signatura}
                                        </li>
                                        <li> 
                                            <b> Comment: </b>
                                            {conditions[key].prescriptions[prescription].comment} 
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>

                        <h5> Procedures and Services </h5>
                        <ul>
                            {Object.keys(conditions[key].procedures_and_services).map(procedure => (
                                <li key={key}>
                                    {conditions[key].procedures_and_services[procedure].procedure}
                                    <ul>
                                        <li> When: {conditions[key].procedures_and_services[procedure].when} </li>
                                        <li> Comment: {conditions[key].procedures_and_services[procedure].comment} </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>

                        <h5> Referrals </h5>
                        <ul>
                            {Object.keys(conditions[key].referrals).map(referral => (
                                <li key={key}>
                                    {conditions[key].referrals[referral].department}
                                    <ul>
                                        <li> When: {conditions[key].referrals[referral].when} </li>
                                        <li> Comment: {conditions[key].referrals[referral].comment} </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>

                    </div>
                ))}
            </div>
        )
    }

    render() {
        return (
            <div>
                <h1> {this.context.title} </h1>
                <h3> History of Present Illness </h3>
                <h3> Patient History </h3>
                    <h4> Medical History </h4>
                    <h4> Surgical History </h4>
                    <h4> Medications </h4>
                    <h4> Allergies </h4>
                    <h4> Social History </h4>
                    <h4> Family History </h4>
                <h3> Review of Systems </h3>
                {this.reviewOfSystems()}
                <h3> Physical Exam </h3>
                {this.physicalExam()}
                <h3> Plan </h3>
                {this.plan()}
            </div>
        )
    }
}

export default GenerateNote;
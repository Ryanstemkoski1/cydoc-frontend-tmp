import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';
import { Button, Segment, Table, Label } from 'semantic-ui-react'

// TODO: look into <li> keys -- throws a warning if duplicats, not a huge deal but probably fix
// TODO: remove all console.log (currently commented out)
let rich = true;
class GenerateNote extends React.Component {

    static contextType = HPIContext;

    medicalHistory() {
        const medicalHistory = this.context["Medical History"];
        //console.log(medicalHistory);

        const conditions = [];
        for (var condition in medicalHistory) {
            if (medicalHistory[condition].Yes === true) {
                conditions.push(medicalHistory[condition]);
            }
        }

        if (rich) {
            return (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Condition</Table.HeaderCell>
                            <Table.HeaderCell>Onset</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                            {Object.keys(conditions).map(key => (
                                <Table.Row>
                                    <Table.Cell>{conditions[key].Condition}</Table.Cell>
                                    <Table.Cell>{conditions[key].Onset ? conditions[key].Onset : null}</Table.Cell>
                                    <Table.Cell>{conditions[key].Comments ? conditions[key].Comments : null}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            )
        }
        
        return (
            <div>
                {Object.keys(conditions).map(key => (
                    <div>
                       <h4> {conditions[key].Condition} </h4> 
                       <ul>
                           {conditions[key].Onset ? <li key={key}>Onset: {conditions[key].Onset}</li> : null}
                           {conditions[key].Comments ? <li key={key}>Comments: {conditions[key].Comments}</li> : null}
                       </ul>
                    </div>
                ))}
            </div>
        )
    }

    // TODO: if one of the three procuedures is not filled out it makes an empty line
    // must be getting saved, but also could just add a conditional
    surgicalHistory() {
        const surgicalHistory = this.context["Surgical History"];
        // console.log(surgicalHistory);

        if (rich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Procedure</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {Object.keys(surgicalHistory).map(key => (
                        <Table.Row>
                            <Table.Cell>{surgicalHistory[key].Procedure}</Table.Cell>
                            <Table.Cell>{surgicalHistory[key].Date ? surgicalHistory[key].Date : null}</Table.Cell>
                            <Table.Cell>{surgicalHistory[key].Comments ? surgicalHistory[key].Comments : null}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <div>
                {Object.keys(surgicalHistory).map(key => (
                    <div>
                        <h4> {surgicalHistory[key].Procedure} </h4>
                        <ul>
                            {surgicalHistory[key].Date ? <li key={key}>Date: {surgicalHistory[key].Date}</li> : null}
                            {surgicalHistory[key].Comments ? <li key={key}>Comments: {surgicalHistory[key].Comments}</li> : null}
                        </ul>
                    </div>
                ))}
            </div>
        )
    }

    medications() {
        const medications = this.context["Medications"];
        // console.log(medications);

        if (rich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Drug Name</Table.HeaderCell>
                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            <Table.HeaderCell>Schedule</Table.HeaderCell>
                            <Table.HeaderCell>Dose</Table.HeaderCell>
                            <Table.HeaderCell>Reason for Taking</Table.HeaderCell>
                            <Table.HeaderCell>Side Effects</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(medications).map(key => (
                            medications[key]['Drug Name'] ?
                            <Table.Row>
                                {medications[key]['Drug Name'] ? <Table.Cell>{medications[key]['Drug Name']}</Table.Cell> : null}
                                {medications[key]['Start Date'] ? <Table.Cell>{medications[key]['Start Date']}</Table.Cell> : null}
                                {medications[key]['Schedule'] ? <Table.Cell>{medications[key]['Schedule']}</Table.Cell> : null}
                                {medications[key]['Dose'] ? <Table.Cell>{medications[key]['Dose']}</Table.Cell> : null}
                                {medications[key]['Reason for Taking'] ? <Table.Cell>{medications[key]['Reason for Taking']}</Table.Cell> : null}
                                {medications[key]['Side Effects'] ? <Table.Cell>{medications[key]['Side Effects']}</Table.Cell> : null}
                                {medications[key]['Comments'] ? <Table.Cell>{medications[key]['Comments']}</Table.Cell> : null}
                            </Table.Row> : null
                        ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <div>
                {Object.keys(medications).map(key => (
                    medications[key]['Drug Name'] ?
                    <div>
                        <h4> {medications[key]['Drug Name']} </h4>
                        <ul>
                            {medications[key]['Start Date'] ? <li key={key}>Start Date: {medications[key]['Start Date']}</li> : null}
                            {medications[key]['Schedule'] ? <li key={key}>Schedule: {medications[key]['Schedule']}</li> : null}
                            {medications[key]['Dose'] ? <li key={key}>Dose: {medications[key]['Dose']}</li> : null}
                            {medications[key]['Reason for Taking'] ? <li key={key}>Reason for Taking: {medications[key]['Reason for Taking']}</li> : null}
                            {medications[key]['Side Effects'].length > 0 ? <li key={key}>Side Effects: {medications[key]['Side Effects'].join(', ')}</li> : null}
                            {medications[key]['Comments'] ? <li key={key}>Comments: {medications[key]['Comments']}</li> : null}
                        </ul>
                    </div> : null
                ))}
            </div>
        )
    }

    allergies() {
        const allergies = this.context["Allergies"];
        // console.log(allergies);

        if (rich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Inciting Agent</Table.HeaderCell>
                            <Table.HeaderCell>Reaction</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(allergies).map(key => (
                            <Table.Row>
                                {allergies[key]['Inciting Agent'] ? <Table.Cell>{allergies[key]['Inciting Agent']}</Table.Cell> : null}
                                {allergies[key]['Reaction'] ? <Table.Cell>{allergies[key]['Reaction']}</Table.Cell> : null}
                                {allergies[key]['Comments'] ? <Table.Cell>{allergies[key]['Comments']}</Table.Cell> : null}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <div>
                {Object.keys(allergies).map(key => (
                    <div>
                        <h4> {allergies[key]['Inciting Agent']} </h4>
                        <ul>
                            {allergies[key]['Reaction'] ? <li key={key}> Reaction: {allergies[key]['Reaction']} </li> : null}
                            {allergies[key]['Comments'] ? <li key={key}> Comments: {allergies[key]['Comments']} </li> : null}
                        </ul>
                    </div>
                ))}
            </div>
        )
    }

    socialHistory() {
        const socialHistory = this.context["Social History"];
        // console.log(socialHistory);

        return (
            <div>
                <div>
                    <b>Tobacco</b>
                    <ul>
                        {socialHistory.Tobacco.Yes === true ? <li> Currently uses tobacco </li> : <li> Never used </li>}
                        {socialHistory.Tobacco['In the Past'] === true ? <li> Used to use tobacco but does not anymore </li> : null}
                        {socialHistory.Tobacco['Packs/Day'] && socialHistory.Tobacco['Number of Years'] ? <li> {socialHistory.Tobacco['Number of Years']*socialHistory.Tobacco['Packs/Day']} pack years </li> : null}
                        {socialHistory.Tobacco.Comments ? <li> Comments: {socialHistory.Tobacco.Comments} </li> : null}
                    </ul>
                </div>
                
                <div>
                    <b>Alcohol</b>
                    <ul>
                        {socialHistory.Alcohol.Yes === true ? <li> Currently uses alcohol </li> : <li> Never used </li>}
                        {socialHistory.Alcohol['In the Past'] === true ? <li> Used to use alcohol but does not anymore </li> : null}
                        {socialHistory.Alcohol['What kind of drinks?'] ? <li> Drinks: {socialHistory.Alcohol['What kind of drinks?']} </li> : null}
                        {socialHistory.Alcohol.Comments ? <li> Comments: {socialHistory.Alcohol.Comments} </li> : null}
                    </ul>
                </div>
                
                {/* TODO: make this better organized by drug used (aka don't say uses substances, put the actuall drug) */}
                <div>
                    <b>Substance Abuse</b>
                    <ul>
                        {socialHistory['Substance Abuse'].Yes === true ? <li> Currently uses substances </li> : <li> Never used </li>}
                        {socialHistory['Substance Abuse']['In the Past'] === true ? <li> Used to use substances but does not anymore </li> : null}
                        {socialHistory['Substance Abuse'].Comments ? <li> Comments: {socialHistory['Substance Abuse'].Comments} </li> : null}
                    </ul>
                </div>
                
                <div> <b>Living Situation: </b> {socialHistory['Living Situation']} </div>
                <div> <b>Employment: </b> {socialHistory.Employment} </div>
                <div> <b>Diet: </b> {socialHistory.Diet} </div>
                <div> <b> Exercise: </b> {socialHistory.Exercise} </div>
            </div>
        )
    }

    familyHistory() {
        const familyHistory = this.context["Family History"];
        // console.log(familyHistory);

        var components = [];
        for (var condition in familyHistory) {
            if (familyHistory[condition].Yes === true) {
                components.push(familyHistory[condition]);
            }
        }

        return (
            <div>
                {Object.keys(components).map(key => (
                    <div>
                        <h4> {components[key]['Condition']} </h4>
                        {Object.keys(components[key]['Family Member']).map(member => (
                            <ul>
                                {components[key]['Family Member'][member] ? <li> Family Member: {components[key]['Family Member'][member]} </li> : null}
                                {components[key]['Cause of Death'][member] ? <li> Cause of Death: {components[key]['Cause of Death'][member] ? 'yes' : 'no'} </li> : null}
                                {components[key]['Comments'] ? <li> Comments: {components[key]['Comments']} </li> : null}
                            </ul>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    reviewOfSystems() {
        const review = this.context["Review of Systems"];
        // console.log(review);

        var components = [];
        for (var key in review) {
            var positives = [];
            var negatives = [];
            // console.log(key);
            // console.log(review[key]);
            for (var question in review[key]) {
                // console.log(question);
                // console.log(review[key][question])
                if (review[key][question] === 'y') {
                    positives.push(question);
                } else if (review[key][question] === 'n') {
                    negatives.push(question);
                }
            }
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
                        <ul>
                            {components[key].positives.length > 0 ? <li key={key}> Positive for: {components[key].positives.join(', ')} </li> : null}
                            {components[key].negatives.length > 0 ? <li key={key}> Negative for: {components[key].negatives.join(', ')} </li> : null}
                        </ul>
                    </div>
                ))}
            </div>
        )
    }

    // TODO: look more into this class
    //       do an extensive testing of all buttons/sections and reformat as needed
    //       display units for things like vitals
    // unclear if this 100% works because of how the data is stored but it's definitely close
    // probably should look more into widgets 
    physicalExam() {
        const physical = this.context["Physical Exam"];
        // console.log(physical);
        
        var components = [];
        for (var key in physical) {
            var active = [];
            var comments = "";
            for (var question in physical[key]) {
                // console.log(question);
                // console.log(physical[key][question]);
                if (typeof physical[key][question] === 'object') {
                    // console.log(question);
                    if (physical[key][question].active === true) {
                        if (physical[key][question].left === true) {
                            active.push(question + ' (left)');
                        }
                        if (physical[key][question].right === true) {
                            active.push(question + ' (right)');
                        }
                    }
                }
                else if (typeof physical[key][question] === 'string' && physical[key] !== 'Vitals') {
                    comments = physical[key][question];
                }
                else if (physical[key][question] === true) {
                    active.push(question);
                }
                else if (physical[key][question] !== "" && physical[key][question] !== false) {
                    active.push(question + ': ' + physical[key][question]);
                }
            }
            components[key] = {
                active: active,
                comments: comments
            }
        }

        return (
            <div>
                <ul>
                {Object.keys(components).map(key => (
                    components[key].active.length > 0 ? <li> <b> {key} </b>: {components[key].active.join(', ')} <ul> {components[key].comments !== "" ? <li> Comments: {components[key].comments} </li> : null} </ul> </li> : null
                ))}
                </ul>
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
                        <h3> {conditions[key].name} </h3>
                        
                        <h5> Differential Diagnosis </h5>
                        <ul>
                            {Object.keys(conditions[key].differential_diagnosis).map(condition => (
                                <li key={key}>
                                    {conditions[key].differential_diagnosis[condition].diagnosis}
                                    <ul>
                                        {conditions[key].differential_diagnosis[condition].comment ? <li key={condition}> Comments: {conditions[key].differential_diagnosis[condition].comment} </li> : null}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        
                        {/* TODO: not show anything if these fields are null */}
                        <h5> Prescriptions </h5>
                        <ul>
                            {Object.keys(conditions[key].prescriptions).map(prescription => (
                                <li key={key}>
                                    {conditions[key].prescriptions[prescription].recipe_type}
                                    <ul>
                                        <li key={prescription}> 
                                            <b> Amount: </b> 
                                            {conditions[key].prescriptions[prescription].recipe_amount} 
                                        </li>
                                        <li key={prescription}> 
                                            <b> Signatura: </b> 
                                            {conditions[key].prescriptions[prescription].signatura}
                                        </li>
                                        <li key={prescription}> 
                                            <b> Comments: </b>
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
                                        <li key={procedure}> When: {conditions[key].procedures_and_services[procedure].when} </li>
                                        <li key={procedure}> Comments: {conditions[key].procedures_and_services[procedure].comment} </li>
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
                                        <li key={referral}> When: {conditions[key].referrals[referral].when} </li>
                                        <li key={referral}> Comments: {conditions[key].referrals[referral].comment} </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        )
    }

    // TODO: make this re-render page 
    changeTextFormat() {
        rich = !rich;
    }

    render() {
        return (
            <div>
                <Button.Group>
                    <Button onClick={this.changeTextFormat}>Plain Text </Button>
                    <Button.Or />
                    <Button onClick={this.changeTextFormat}>Rich Text</Button>
                </Button.Group>
                <Segment>
                    <h1> {this.context.title} </h1>
                    <h2> History of Present Illness </h2>
                    <h2> Patient History </h2>
                        <h3> Medical History </h3>
                        {this.medicalHistory()}
                        <h3> Surgical History </h3>
                        {this.surgicalHistory()}
                        <h3> Medications </h3>
                        {this.medications()}
                        <h3> Allergies </h3>
                        {this.allergies()}
                        <h3> Social History </h3>
                        {this.socialHistory()}
                        <h3> Family History </h3>
                        {this.familyHistory()}
                    <h2> Review of Systems </h2>
                    {this.reviewOfSystems()}
                    <h2> Physical Exam </h2>
                    {this.physicalExam()}
                    <h2> Plan </h2>
                    {this.plan()}
                </Segment>
            </div>
        )
    }
}

export default GenerateNote;
import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';
import { Button, Segment, Table } from 'semantic-ui-react';
import constants from '../../../../constants/physical-exam-constants';

import MedicalHistoryNote from './notesections/MedicalHistoryNote';
import SurgicalHistoryNote from './notesections/SurgicalHistoryNote';
import MedicationsNote from './notesections/MedicationsNote';
import AllergiesNote from './notesections/AllergiesNote';

// TODO: look into <li> keys -- throws a warning if duplicats, not a huge deal but probably fix
class GenerateNote extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rich: false
        }
    }

    static contextType = HPIContext;

    alcoholProductsUsed(socialHistory) {
        const productsUsed = [];
        const alcohol = socialHistory.Alcohol['fields'];
        Object.keys(alcohol).map(key => {
            const product = `${alcohol[key]['Drink Type']} (${alcohol[key]['# Per Week']} ${alcohol[key]['Drink Size']}${parseInt(alcohol[key]['# Per Week']) !== 1 ? 's' : ''} per week)`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    }

    recreationalDrugsProductsUsed(socialHistory) {
        const productsUsed = [];
        const recreationalDrugs = socialHistory['Recreational Drugs']['fields'];
        Object.keys(recreationalDrugs).map(key => {
            const product = `${recreationalDrugs[key]['Drug Name']} (${recreationalDrugs[key]['# Per Week']} per week, ${recreationalDrugs[key]['Mode of Delivery'].join(', ')})`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    }

    interestedInQuitting(socialHistorySection) {
        let str;
        socialHistorySection['InterestedInQuitting']['Yes'] === true ? str = 'Interested in quitting? Yes' :
            socialHistorySection['InterestedInQuitting']['Maybe'] === true ? str = 'Interested in quitting? Maybe' :
            socialHistorySection['InterestedInQuitting']['No'] === true ? str = 'Interested in quitting? No' : str = null;
        return str;
    }

    triedToQuit(socialHistorySection) {
        let str;
        if (socialHistorySection['TriedToQuit']['Yes'] === true) {
            str = 'Tried to quit? Yes';
        } else if (socialHistorySection['TriedToQuit']['No'] === true) {
            str = 'Tried to quit? No';
        }
        return str;
    }

    socialHistory() {
        const socialHistory = this.context["Social History"];
        // console.log(socialHistory);

        return (
            <div>
                <div>
                    <b>Tobacco</b>
                    <ul>
                        {socialHistory.Tobacco['Yes'] === true ? <li>Currently uses tobacco</li> : null}
                        {socialHistory.Tobacco['In the Past'] === true ? <li>Used to use tobacco but does not anymore</li> : null}
                        {socialHistory.Tobacco['Quit Year'] ? <li>Quit Year: {socialHistory.Tobacco['Quit Year']}</li> : null}
                        {socialHistory.Tobacco['Never Used'] === true ? <li>Never used</li> : null}
                        {socialHistory.Tobacco['Packs/Day'] && socialHistory.Tobacco['Number of Years'] ? <li>{socialHistory.Tobacco['Number of Years']*socialHistory.Tobacco['Packs/Day']} pack years</li> : null}
                        {socialHistory.Tobacco['Products Used'] ? <li>Products used: {socialHistory.Tobacco['Products Used'].join(', ')}</li> : null}
                        {socialHistory.Tobacco['Yes'] === true || socialHistory.Tobacco['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory.Tobacco)}</li> : null}
                        {socialHistory.Tobacco['Yes'] === true || socialHistory.Tobacco['In the Past'] === true ? <li>{this.triedToQuit(socialHistory.Tobacco)}</li> : null}
                        {socialHistory.Tobacco['Comments'] ? <li>Comments: {socialHistory.Tobacco['Comments']}</li> : null}
                    </ul>
                </div>
                
                <div>
                    <b>Alcohol</b>
                    <ul>
                        {socialHistory.Alcohol['Yes'] === true ? <li>Currently uses alcohol</li> : null}
                        {socialHistory.Alcohol['In the Past'] === true ? <li>Used to use alcohol but does not anymore</li> : null}
                        {socialHistory.Alcohol['Quit Year'] ? <li>Quit Year: {socialHistory.Alcohol['Quit Year']}</li> : null}
                        {socialHistory.Alcohol['Never Used'] === true ? <li>Never used</li> : null}
                        {socialHistory.Alcohol['fields'][0]['Drink Type'] !== "" ? <li>Products used: {this.alcoholProductsUsed(socialHistory)}</li> : null}
                        {socialHistory.Alcohol['Yes'] === true || socialHistory.Alcohol['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory.Alcohol)}</li> : null}
                        {socialHistory.Alcohol['Yes'] === true || socialHistory.Alcohol['In the Past'] === true ? <li>{this.triedToQuit(socialHistory.Alcohol)}</li> : null}
                        {socialHistory.Alcohol['Comments'] ? <li>Comments: {socialHistory.Alcohol['Comments']}</li> : null}
                    </ul>
                </div>
                
                <div>
                    <b>Recreational Drugs</b>
                    <ul>
                        {socialHistory['Recreational Drugs']['Yes'] === true ? <li>Currently uses substances</li> : null}
                        {socialHistory['Recreational Drugs']['In the Past'] === true ? <li>Used to use substances but does not anymore</li> : null}
                        {socialHistory['Recreational Drugs']['Quit Year'] ? <li>Quit Year: {socialHistory['Recreational Drugs']['Quit Year']}</li> : null}
                        {socialHistory['Recreational Drugs']['Never'] === true ? <li>Never used</li> : null}
                        {socialHistory['Recreational Drugs']['fields'][0]['Drug Name'] !== "" ? <li>Products used: {this.recreationalDrugsProductsUsed(socialHistory)}</li> : null}
                        {socialHistory['Recreational Drugs']['Yes'] === true || socialHistory['Recreational Drugs']['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory['Recreational Drugs'])}</li> : null}
                        {socialHistory['Recreational Drugs']['Yes'] === true || socialHistory['Recreational Drugs']['In the Past'] === true ? <li>{this.triedToQuit(socialHistory['Recreational Drugs'])}</li> : null}
                        {socialHistory['Recreational Drugs']['Comments'] ? <li>Comments: {socialHistory['Recreational Drugs']['Comments']}</li> : null}
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

        let components = [];
        for (var condition in familyHistory) {
            let familyMembers = [];
            if (familyHistory[condition].Yes === true) {
                if (familyHistory[condition]['Family Member']) {
                    for (var member in familyHistory[condition]['Family Member']) {
                        if (familyHistory[condition]['Cause of Death'][member]) {
                            familyMembers.push(`${familyHistory[condition]['Family Member'][member]} (cause of death)`);
                        }
                        else {
                            familyMembers.push(familyHistory[condition]['Family Member'][member]);
                        }
                    }
                }
                components[condition] = {
                    condition: familyHistory[condition]['Condition'],
                    family: familyMembers,
                    comments: familyHistory[condition]['Comments']
                }
            }
        }

        return (
            <ul>
                {Object.keys(components).map(key => (
                    <li>
                        <b>{components[key].condition}: </b>
                        {components[key].family.length > 0 ? `${components[key].family.join(', ')}. ` : null} 
                        {components[key].comments}
                    </li>
                ))}
            </ul>
        )
    }

    reviewOfSystems() {
        const review = this.context["Review of Systems"];
        // console.log(review);

        let components = [];
        for (var key in review) {
            let positives = [];
            let negatives = [];
            for (var question in review[key]) {
                if (review[key][question] === 'y') {
                    positives.push(question.toLowerCase());
                } else if (review[key][question] === 'n') {
                    negatives.push(question.toLowerCase());
                }
            }
            components[key] = {
                positives: positives,
                negatives: negatives
            }
        }
        return (
            <ul>
                {Object.keys(components).map(key => (
                    components[key].positives.length > 0 || components[key].negatives.length > 0 ?
                        <li>
                            <b>{key}: </b>
                            {components[key].positives.length > 0 ? `Positive for ${components[key].positives.join(', ')}. `: null}
                            {components[key].negatives.length > 0 ? `Negative for ${components[key].negatives.join(', ')}. ` : null}
                        </li>
                    : null
                ))}
            </ul>
        )
    }

    physicalExam() {
        const physical = this.context["Physical Exam"];
        console.log(physical);
        const vitalUnits = {'Heart Rate': ' bpm', 'Temperature': ' °C', 'RR': ' bpm', 'Oxygen Saturation': ' PaO₂'};
        let vitals = [];
        let widgets = {'Pulses': [], 'Gastrointestinal': [], 'Pulmonary': [], 'Tendon Reflexes': [], 'Cardiac': [], 'expandMurmurs': []};
        let components = [];
        for (var key in physical) {
            let active = [];
            let comments = "";
            let keyObject = constants.sections.find(o => o.name === key); // finds section in constants in order to access normal/abnormal info later
            // specific to vitals section
            if (key === 'Vitals') {
                if (physical[key]['Systolic Blood Pressure'] != 0 || physical[key]['Diastolic Blood Pressure'] !== 0) {
                    vitals.push(physical[key]['Systolic Blood Pressure'] + '/' + physical[key]['Diastolic Blood Pressure'] + ' mmHg');
                }
                for (var vital in physical[key]) {
                    if (vital !== 'Systolic Blood Pressure' && vital !== 'Diastolic Blood Pressure' && physical[key][vital] !== 0) {
                        vitals.push(vital + ': ' + physical[key][vital] + (vitalUnits[vital] ? vitalUnits[vital] : ""));
                    }
                }
            // specific to widgets
            } else if (key === 'widgets') {
                const physicalWidgets = physical['widgets'];
                for (var widget in physicalWidgets) {
                    if (widget === 'Pulses') {
                        for (var pulse in physicalWidgets[widget]) {
                           var abnormalPulse = physicalWidgets[widget][pulse];
                           widgets['Pulses'].push(abnormalPulse[2] + ' ' + abnormalPulse[1] + ' ' + abnormalPulse[0]); 
                        }
                    } else if (widget === 'Abdomen') {
                        let findings = {};
                        for (var quadrant in physicalWidgets[widget]) {
                            var quadrantInfo = physicalWidgets[widget][quadrant];
                            for (var info in quadrantInfo) {
                                if (quadrantInfo[info]) { 
                                    if (!(info in findings)) {
                                        findings[info] = [];
                                    }
                                    findings[info].push(quadrant.toLowerCase())
                                }
                            }
                        }
                        console.log(findings);
                        for (var key in findings) {
                            widgets['Gastrointestinal'].push(key + ' in the ' + findings[key].join(', ').replace(/, ([^,]*)$/, ' and $1'));
                        }
                    } else if (widget === 'Lungs') {
                        let findings = {};
                        for (var lobe in physicalWidgets[widget]) {
                            var lobeInfo = physicalWidgets[widget][lobe];
                            for (var finding in lobeInfo) {
                                if (lobeInfo[finding]) {
                                    if (!(finding in findings)) {
                                        findings[finding] = [];
                                    }
                                    findings[finding].push(lobe.toLowerCase());
                                }
                            }
                        }
                        for (var key in findings) {
                            widgets['Pulmonary'].push(key + ' in the ' + findings[key].join(', ').replace(/, ([^,]*)$/, ' and $1'));
                        }
                    } else if (widget === 'Reflexes') {
                        for (var reflex in physicalWidgets[widget]) {
                            var reflexInfo = physicalWidgets[widget][reflex];
                            widgets['Tendon Reflexes'].push(reflexInfo[2] + ' ' + reflexInfo[1] + ' ' + reflexInfo[0]);
                        }
                    } else if (widget === 'Murmurs') {
                        for (var murmur in physicalWidgets[widget]) {
                            var murmurInfo = physicalWidgets[widget][murmur];
                            var crescDecres = murmurInfo['cresdecres'] === 'cresc-decresc' ? 'crescendo-decrescendo' : murmurInfo['cresdecres'];
                            var quality = murmurInfo['quality'] !== "" ? ' with a ' + murmurInfo['quality'].join(', ') + ' quality' : null;
                            var heardBest = murmurInfo['heardbest'] !== "" ? ' heard best at ' + murmurInfo['heardbest']: null;
                            let finding = murmurInfo['systdiast'].substring(0, 1).toUpperCase() + murmurInfo['systdiast'].substring(1) + ' ' + crescDecres + ' murmur' + quality + heardBest + '. Intensity ' + murmurInfo['intensity'] + ', ' + murmurInfo['pitch'] + ' pitch.';
                            widgets['Cardiac'].push(finding);
                        }
                    } else if (widget === 'ExpandMurmurs') {
                        for (var expand in physicalWidgets[widget]) {
                            let findings = [];
                            var expandInfo = physicalWidgets[widget][expand];
                        }
                    }
                }
            // everything else in physical exam 
            } else {
                for (var question in physical[key]) {
                    // deals with findings that have a left or right option
                    if (typeof physical[key][question] === 'object' && keyObject) {
                        let isNormal = true;
                        for (var i = 0; i < keyObject.rows.length; i++) {
                            if (keyObject.rows[i].findings.includes(question)) {
                                keyObject.rows[i].normalOrAbnormal === "normal" ? isNormal = true : isNormal = false;
                            }
                        }
                        if (isNormal) {
                            if (physical[key][question].active === true) {
                                if (physical[key][question].right === true && physical[key][question].left === true) {
                                    active.push(question + ' (bilateral)');
                                }
                                else if (physical[key][question].left === true) {
                                    active.push(question + ' (left)');
                                }
                                else if (physical[key][question].right === true) {
                                    active.push(question + ' (right)');
                                }
                            }
                        } else {
                            if (physical[key][question].active === true) {
                                if (physical[key][question].right === true && physical[key][question].left === true) {
                                    active.push('bilateral ' + question);
                                }
                                else if (physical[key][question].left === true) {
                                    active.push('left ' + question);
                                }
                                else if (physical[key][question].right === true) {
                                    active.push('right ' + question);
                                }
                            }
                        }
                    }
                    // gets comments section of physical exam 
                    else if (typeof physical[key][question] === 'string' && physical[key] !== 'Vitals') {
                        comments = physical[key][question];
                    }
                    // grabs findings that don't have a left/right component 
                    else if (physical[key][question] === true) {
                        active.push(question);
                    }
                }
                components[key] = {
                    active: active,
                    comments: comments
                }
            }
        }
        // add comments to the observations 
        if (this.state.rich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Section</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {vitals.length > 0 ? 
                            <Table.Row>
                                <Table.Cell singleLine>Vitals</Table.Cell>
                                <Table.Cell>{vitals.join(', ')}</Table.Cell>
                            </Table.Row>
                        : null}
                        {Object.keys(components).map(key => (
                            key in widgets && (components[key].active.length > 0 || widgets[key].length > 0) ?
                                <Table.Row>
                                    <Table.Cell singleLine>{key}</Table.Cell>
                                    <Table.Cell>{components[key].active.join(', ') + '. ' + widgets[key].join(', ') + '. ' + components[key].comments}</Table.Cell>
                                </Table.Row>
                            : !(key in widgets) && components[key].active.length > 0 ?
                                <Table.Row>
                                    <Table.Cell singleLine>{key}</Table.Cell>
                                    <Table.Cell>{components[key].active.join(', ') + '. ' + components[key].comments}</Table.Cell>
                                </Table.Row> 
                            : null
                        ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <ul>
                {vitals.length > 0 ? <li><b>Vitals: </b>{vitals.join(', ')}</li> : null}
                {Object.keys(components).map(key => (
                    key in widgets && (components[key].active.length > 0 && widgets[key].length > 0) ? 
                        <li>
                            <b>{key}: </b>
                            {components[key].active.join(', ') + '. ' + widgets[key].join(', ') + '. ' + components[key].comments}
                        </li>
                    : (key in widgets && (!(components[key].active.length > 0) && widgets[key].length > 0)) ? 
                        <li>
                            <b>{key}: </b>
                            {widgets[key].join(', ') + '. ' + components[key].comments}
                        </li>
                    : !(key in widgets) && components[key].active.length > 0 ? 
                        <li>
                            <b>{key}: </b>
                            {components[key].active.join(', ') + '. ' + components[key].comments}
                        </li> 
                    : null
                ))}
            </ul>
        )
    }

    plan() {
        const plan = this.context.plan;
        const conditions = plan.conditions;
        // console.log(plan);
        // console.log(plan.conditions);

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
                    
                    {/* TODO: not show anything if these fields are null? Or just remove periods? */}
                    <b>Prescriptions</b>
                    <ul>
                        {Object.keys(conditions[key].prescriptions).map(prescription => (
                            <li key={key}>
                                <b>{conditions[key].prescriptions[prescription].recipe_type} </b>    
                                {`${conditions[key].prescriptions[prescription].recipe_amount}. `} 
                                {`${conditions[key].prescriptions[prescription].signatura}. `}
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

    render() {
        return (
            <div>
                <Button.Group>
                    <Button onClick={() => this.setState({rich : false})}>Plain Text </Button>
                    <Button.Or />
                    <Button onClick={() => this.setState({rich : true})}>Rich Text</Button>
                </Button.Group>
                <Segment>
                    <h1> {this.context.title} </h1>
                    <h3> History of Present Illness </h3>
                    <h3> Patient History </h3>
                        <h4> Medical History </h4>
                        <MedicalHistoryNote isRich={this.state.rich} medicalHistory={this.context["Medical History"]} />
                        <h4> Surgical History </h4>
                        <SurgicalHistoryNote isRich={this.state.rich} surgicalHistory={this.context["Surgical History"]} />
                        <h4> Medications </h4>
                        <MedicationsNote isRich={this.state.rich} medications={this.context["Medications"]} />
                        <h4> Allergies </h4>
                        <AllergiesNote isRich={this.state.rich} allergies={this.context["Allergies"]} />
                        <h4> Social History </h4>
                        {this.socialHistory()}
                        <h4> Family History </h4>
                        {this.familyHistory()}
                    <h3> Review of Systems </h3>
                    {this.reviewOfSystems()}
                    <h3> Physical Exam </h3>
                    {this.physicalExam()}
                    <h3> Plan </h3>
                    {this.plan()}
                </Segment>
            </div>
        )
    }
}

export default GenerateNote;
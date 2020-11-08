import React from 'react';
import { Table } from 'semantic-ui-react';
import constants from '../../../../../constants/physical-exam-constants';

class PhysicalExamNote extends React.Component {
    render() {
        const physical = this.props.physicalExam;

        const vitalUnits = {'Heart Rate': ' bpm', 'Temperature': ' °C', 'RR': ' bpm', 'Oxygen Saturation': ' PaO₂'};
        
        let vitals = [];
        let widgets = {'Pulses': [], 'Gastrointestinal': [], 'Pulmonary': [], 'Tendon Reflexes': [], 'Cardiac': [], 'expandMurmurs': []};
        let components = [];
        
        for (var key in physical) {
            let active = [];
            let comments = "";

            // finds section in constants in order to access normal/abnormal info later
            let keyObject = constants.sections.find(o => o.name === key); 
            
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
        if (this.props.isRich) {
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
}

export default PhysicalExamNote;
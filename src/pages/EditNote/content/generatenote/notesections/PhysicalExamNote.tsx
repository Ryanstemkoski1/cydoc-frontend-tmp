import React, { Component } from 'react';
import {
    VitalsFields,
    PhysicalExamSectionState,
    PhysicalExamState,
} from 'redux/reducers/physicalExamReducer';
import { Table } from 'semantic-ui-react';
import { WidgetsState } from 'redux/reducers/widgetReducers';

interface PhysicalExamProps {
    isRich: boolean;
    physicalExam: PhysicalExamState;
    physicalExamSections?: PhysicalExamSectionState;
}

export class PhysicalExamNote extends Component<PhysicalExamProps> {
    widgets: {
        [index: string]: string[];
    } = {
        pulses: [],
        gastrointestinal: [],
        pulmonary: [],
        /* eslint-disable-next-line */
        tendon_reflexes: [],
        cardiac: [],
        /* eslint-disable-next-line */
        expand_murmurs: [],
    };

    components: {
        [category: string]: {
            active: string[];
            comments: string;
        };
    } = {};

    isEmpty = true;

    displayComments = (comments: string) => {
        if (comments === '') {
            return '';
        }
        if (comments.endsWith('.')) {
            return comments + ' ';
        }
        return comments + '. ';
    };

    displayVitals = () => {
        const vitals: string[] = [];
        const vitalUnits: {
            [index: string]: string;
        } = {
            'Heart Rate': ' bpm',
            Temperature: ' °C',
            RR: ' bpm',
            'Oxygen Saturation': ' PaO₂',
        };

        if (
            !(
                this.props.physicalExam.vitals.systolicBloodPressure !== 0 &&
                this.props.physicalExam.vitals.diastolicBloodPressure !== 0
            )
        ) {
            vitals.push(
                'Blood Pressure: ' +
                    this.props.physicalExam.vitals.systolicBloodPressure +
                    '/' +
                    this.props.physicalExam.vitals.diastolicBloodPressure +
                    ' mmHg'
            );
        }

        let vital: VitalsFields;
        for (vital in this.props.physicalExam.vitals) {
            if (this.props.physicalExam.vitals[vital] !== 0) {
                vitals.push(
                    vital +
                        ': ' +
                        this.props.physicalExam.vitals[vital] +
                        (vitalUnits[vital] ? vitalUnits[vital] : '')
                );
            }
        }

        if (this.props.isRich) {
            return vitals.length > 0 ? (
                <Table.Row>
                    <Table.Cell singleLine>Vitals</Table.Cell>
                    <Table.Cell>{vitals.join(', ')}</Table.Cell>
                </Table.Row>
            ) : null;
        } else {
            return vitals.length > 0 ? (
                <li>
                    <b>Vitals: </b>
                    {vitals.join(', ')}
                </li>
            ) : null;
        }
    };

    displayWidgets = () => {
        const physicalWidgets = this.props.physicalExam.widgets;
        for (const widget in physicalWidgets) {
            if (widget === 'pulses') {
                for (const pulse in physicalWidgets[widget]) {
                    const abnormalPulse = physicalWidgets[widget][pulse];
                    this.widgets.pulses.push(
                        abnormalPulse.location +
                            ' ' +
                            abnormalPulse.side +
                            ' ' +
                            abnormalPulse.intensity
                    );
                }
            } else if (widget === 'abdomen') {
                const findings: {
                    [index: string]: string[];
                } = {};
                let quadrant: keyof WidgetsState['abdomen'];
                for (quadrant in physicalWidgets[widget]) {
                    const quadrantInfo = physicalWidgets[widget][quadrant];

                    let info: keyof typeof quadrantInfo;
                    for (info in quadrantInfo) {
                        if (quadrantInfo[info]) {
                            findings[info].push(quadrant.toLowerCase());
                        }
                    }
                    for (const key in findings) {
                        this.widgets.gastrointestinal.push(
                            key +
                                ' in the ' +
                                findings[key]
                                    .join(', ')
                                    .replace(/, ([^,]*)$/, ' and $1')
                        );
                    }
                }
            } else if (widget === 'lungs') {
                const findings: {
                    [index: string]: string[];
                } = {};
                let lobe: keyof WidgetsState['lungs'];
                for (lobe in physicalWidgets[widget]) {
                    const lobeInfo = physicalWidgets[widget][lobe];

                    let finding: keyof typeof lobeInfo;
                    for (finding in lobeInfo) {
                        if (lobeInfo[finding]) {
                            if (!(finding in findings)) {
                                findings[finding] = [];
                            }
                            findings[finding].push(lobe.toLowerCase());
                        }
                    }
                }
                for (const key in findings) {
                    this.widgets.pulmonary.push(
                        key +
                            ' in the ' +
                            findings[key]
                                .join(', ')
                                .replace(/, ([^,]*)$/, ' and $1')
                    );
                }
            } else if (widget === 'reflexes') {
                let reflex: keyof WidgetsState['reflexes'];
                for (reflex in physicalWidgets[widget]) {
                    const reflexInfo = physicalWidgets[widget][reflex];
                    this.widgets.tendon_reflexes.push(
                        reflexInfo.location +
                            ' ' +
                            reflexInfo.side +
                            ' ' +
                            reflexInfo.intensity
                    );
                }
            } else if (widget === 'murmurs') {
                let murmur: keyof WidgetsState['murmurs'];
                for (murmur in physicalWidgets[widget]) {
                    const murmurInfo = physicalWidgets[widget][murmur];

                    let crescDecres = '';
                    if (murmurInfo.crescendo) {
                        crescDecres = 'crescendo';
                    } else if (murmurInfo.decrescendo) {
                        crescDecres = 'decrescendo';
                    }

                    let qualityValues: keyof typeof murmurInfo.quality;
                    const murmurQuality: string[] = [];
                    for (qualityValues in murmurInfo.quality) {
                        if (qualityValues) {
                            murmurQuality.push(qualityValues);
                        }
                    }
                    const quality = murmurInfo.quality
                        ? ' with a ' +
                          Object.keys(murmurInfo.quality).join(', ') +
                          ' quality'
                        : null;

                    const heardBest = murmurInfo.bestHeardAt
                        ? ' heard best at ' + murmurInfo.bestHeardAt
                        : null;

                    const finding =
                        murmurInfo.phase.substring(0, 1).toUpperCase() +
                        murmurInfo.phase.substring(1) +
                        ' ' +
                        crescDecres +
                        ' murmur' +
                        quality +
                        heardBest +
                        '. Intensity ' +
                        murmurInfo.intensity +
                        ', ' +
                        murmurInfo.pitch +
                        ' pitch.';
                    this.widgets.cardiac.push(finding);
                }
            }
        }
        return this.widgets;
    };

    displaySections = () => {
        const active: string[] = [];
        let comments = '';
        const sections = this.props.physicalExamSections;

        // sections that have left/right buttons
        for (const category in sections) {
            const sectionFindings = sections[category].findings;
            if (typeof sectionFindings === 'object') {
                if (sectionFindings.center) {
                    active.push('bilateral ' + category);
                } else if (sections[category].findings.left) {
                    active.push('left ' + category);
                } else if (sections[category].findings.right) {
                    active.push('right ' + category);
                }
            }

            // sections that have normal buttons
            else if (typeof sectionFindings === 'boolean') {
                active.push(category);
            }
            // gets comments section of physical exam
            if (sections[category].comments) {
                comments = sections[category].comments;
            }

            this.components[category] = {
                active: active,
                comments: comments,
            };
        }
        for (const component in this.components) {
            if (
                this.components[component].active.length !== 0 &&
                this.components[component].comments !== ''
            ) {
                this.isEmpty = false;
            }
        }

        this.displayWidgets();
        if (this.props.isRich) {
            return Object.keys(this.components).map((key) => {
                return key in this.widgets &&
                    (this.components[key].active.length > 0 ||
                        this.widgets[key].length > 0) ? (
                    <Table.Row>
                        <Table.Cell singleLine>{key}</Table.Cell>
                        <Table.Cell>
                            {this.displayComments(
                                this.components[key].comments
                            ) +
                                this.components[key].active.join(', ') +
                                '. ' +
                                this.widgets[key].join(', ') +
                                '.'}
                        </Table.Cell>
                    </Table.Row>
                ) : !(key in this.widgets) &&
                  this.components[key].active.length > 0 ? (
                    <Table.Row>
                        <Table.Cell singleLine>{key}</Table.Cell>
                        <Table.Cell>
                            {this.displayComments(
                                this.components[key].comments
                            ) +
                                this.components[key].active.join(', ') +
                                '.'}
                        </Table.Cell>
                    </Table.Row>
                ) : null;
            });
        } else {
            return Object.keys(this.components).map((key) =>
                key in this.widgets &&
                this.components[key].active.length > 0 &&
                this.widgets[key].length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.components[key].active.join(', ') +
                            '. ' +
                            this.widgets[key].join(', ') +
                            '.'}
                    </li>
                ) : key in this.widgets &&
                  !(this.components[key].active.length > 0) &&
                  this.widgets[key].length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.widgets[key].join(', ') +
                            '.'}
                    </li>
                ) : !(key in this.widgets) &&
                  this.components[key].active.length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.components[key].active.join(', ') +
                            '.'}
                    </li>
                ) : null
            );
        }
    };

    render() {
        const { isRich } = this.props;

        if (this.isEmpty) {
            return <div>No physical exam reported.</div>;
        } else if (isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Section</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.displayVitals}
                        {this.displaySections}
                    </Table.Body>
                </Table>
            );
        } else {
            return (
                <ul>
                    {this.displayVitals}
                    {this.displaySections}
                </ul>
            );
        }
    }
}

export default PhysicalExamNote;

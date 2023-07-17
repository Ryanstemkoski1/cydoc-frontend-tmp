import React, { Component } from 'react';
import {
    VitalsFields,
    PhysicalExamSectionState,
    PhysicalExamState,
} from 'redux/reducers/physicalExamReducer';
import { Table } from 'semantic-ui-react';
import { WidgetsState } from 'redux/reducers/widgetReducers';
import {
    MurmurRadiation,
    MurmurAdditionalFeature,
    Phase,
} from 'redux/reducers/widgetReducers/murmurswidgetReducer';
import { PulsesWidgetItemState } from 'redux/reducers/widgetReducers/pulsesWidgetReducer';
import { ReflexesWidgetItemState } from 'redux/reducers/widgetReducers/reflexesWidgetReducer';
import { LeftRight } from 'constants/enums';
import { currentNoteStore } from 'redux/store';

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

    emptyMurmur = {
        specificMurmur: '',
        radiationTo: {
            carotids: false,
            leftClavicle: false,
            precordium: false,
            RLSB: false,
            LLSB: false,
            LUSB: false,
        },
        additionalFeatures: {
            increasedWithValsava: false,
            palpableThrill: false,
            systolicClick: false,
            openingSnap: false,
            early: false,
            mid: false,
        },
    };

    components: {
        [category: string]: {
            active: string[];
            comments: string;
        };
    } = {};

    isEmpty = true;

    convertSectionKeytoWidgetKey = (sectionKey: string) => {
        return sectionKey.toLowerCase().replace(' ', '_');
    };

    convertButtonTextToNoteText = (buttonText: string) => {
        return buttonText
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase();
    };

    displayComments = (comments: string) => {
        if (comments === '') {
            return '';
        }
        if (comments.endsWith('.')) {
            return comments + ' ';
        }
        return comments + '. ';
    };

    calculateAgeInYears = (dateOfBirth: string) => {
        const dobObj = new Date(dateOfBirth);
        const timeDiff = Math.abs(Date.now() - dobObj.getTime());
        const ageInYears = timeDiff / (1000 * 60 * 60 * 24 * 365.25);
        return ageInYears;
    };

    isPediatric() {
        if (
            currentNoteStore.getState().additionalSurvey.dateOfBirth ===
                undefined ||
            currentNoteStore.getState().additionalSurvey.dateOfBirth === null ||
            currentNoteStore.getState().additionalSurvey.dateOfBirth === ''
        ) {
            return +false;
        }

        const patientAge = this.calculateAgeInYears(
            currentNoteStore.getState().additionalSurvey.dateOfBirth
        );
        return +(patientAge <= 2);
    }

    displayVitals = () => {
        const vitals: string[] = [];
        // const vitalUnits: {
        //     [index: string]: string;
        // } = {
        //     'Heart Rate': ' bpm',
        //     Temperature: ' °C',
        //     RR: ' bpm',
        //     'Oxygen Saturation': ' PaO₂',
        // };

        const displayH = this.isPediatric() ? 'Length' : 'Height';

        if (
            this.props.physicalExam.vitals.systolicBloodPressure !== 0 &&
            this.props.physicalExam.vitals.diastolicBloodPressure !== 0 &&
            this.props.physicalExam.vitals.systolicBloodPressure !== null &&
            this.props.physicalExam.vitals.diastolicBloodPressure !== null
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
            if (
                vital != 'systolicBloodPressure' &&
                vital != 'diastolicBloodPressure'
            ) {
                if (
                    this.props.physicalExam.vitals[vital] !== 0 &&
                    this.props.physicalExam.vitals[vital] !== null
                ) {
                    if (vital == 'heartRate') {
                        vitals.push(
                            'Heart Rate: ' +
                                this.props.physicalExam.vitals.heartRate +
                                ' BPM'
                        );
                    } else if (vital == 'RR') {
                        vitals.push(
                            'RR: ' + this.props.physicalExam.vitals.RR + ' BPM'
                        );
                    } else if (vital == 'temperature') {
                        vitals.push(
                            'Temperature: ' +
                                this.props.physicalExam.vitals.temperature +
                                '°C'
                        );
                    } else if (vital == 'oxygenSaturation') {
                        vitals.push(
                            'Oxygen Saturation: ' +
                                this.props.physicalExam.vitals
                                    .oxygenSaturation +
                                ' PaO₂'
                        );
                    } else if (vital == 'weight') {
                        vitals.push(
                            'Weight: ' +
                                this.props.physicalExam.vitals.weight +
                                ' pounds'
                        );
                    } else if (vital == 'height') {
                        vitals.push(
                            `${displayH}: ${this.props.physicalExam.vitals.height} inches`
                        );
                    } else if (
                        vital == 'headCircumference' &&
                        this.isPediatric()
                    ) {
                        vitals.push(
                            'Head Circumference: ' +
                                this.props.physicalExam.vitals
                                    .headCircumference +
                                ' inches'
                        );
                    }
                    // vitals.push(
                    //     vital +
                    //         ': ' +
                    //         this.props.physicalExam.vitals[vital] +
                    //         (vitalUnits[vital] ? vitalUnits[vital] : '')
                    // );
                }
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
        //prevents findings from being re-pushed after re-rendering
        this.widgets = {
            pulses: [],
            gastrointestinal: [],
            pulmonary: [],
            /* eslint-disable-next-line */
            tendon_reflexes: [],
            cardiac: [],
            /* eslint-disable-next-line */
            expand_murmurs: [],
        };
        for (const widget in physicalWidgets) {
            if (widget === 'pulses') {
                const pulseIntensityButtonText = [
                    'absent',
                    '1+ weak',
                    '2+',
                    '3+ normal',
                    '4+ bounding',
                ];
                for (const pulse in physicalWidgets[widget]) {
                    const abnormalPulse: PulsesWidgetItemState =
                        physicalWidgets[widget][pulse];
                    const abnormalPulseNoteText =
                        (abnormalPulse.intensity in pulseIntensityButtonText
                            ? pulseIntensityButtonText[
                                  abnormalPulse.intensity
                              ] + ' '
                            : '') +
                        (abnormalPulse.side !== ''
                            ? (abnormalPulse.side == LeftRight.Left
                                  ? 'left'
                                  : 'right') + ' '
                            : '') +
                        (abnormalPulse.location !== ''
                            ? abnormalPulse.location + ' '
                            : '') +
                        (abnormalPulse.intensity ||
                        abnormalPulse.side ||
                        abnormalPulse.location
                            ? 'pulse'
                            : '');
                    if (abnormalPulseNoteText !== '') {
                        this.widgets.pulses.push(abnormalPulseNoteText.trim());
                    }
                }
            } else if (widget === 'abdomen') {
                const findings: {
                    [index: string]: string[];
                } = {
                    tenderness: [],
                    rebound: [],
                    guarding: [],
                };
                let quadrant: keyof WidgetsState['abdomen'];
                for (quadrant in physicalWidgets[widget]) {
                    const quadrantInfo = physicalWidgets[widget][quadrant];
                    let info: keyof typeof quadrantInfo;
                    for (info in quadrantInfo) {
                        if (quadrantInfo[info]) {
                            findings[info].push(
                                this.convertButtonTextToNoteText(quadrant)
                            );
                        }
                    }
                }
                for (const key in findings) {
                    if (findings[key].length > 0) {
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
                    const lobeInfo: any = physicalWidgets[widget][lobe];
                    let finding: keyof typeof lobeInfo;
                    for (finding in lobeInfo) {
                        if (lobeInfo[finding]) {
                            if (!(finding in findings)) {
                                findings[finding] = [];
                            }
                            findings[finding].push(
                                this.convertButtonTextToNoteText(lobe)
                            );
                        }
                    }
                }
                for (const key in findings) {
                    if (findings[key].length > 0) {
                        this.widgets.pulmonary.push(
                            this.convertButtonTextToNoteText(key) +
                                ' in the ' +
                                findings[key]
                                    .join(', ')
                                    .replace(/, ([^,]*)$/, ' and $1')
                        );
                    }
                }
            } else if (widget === 'reflexes') {
                let reflex: keyof WidgetsState['reflexes'];
                const reflexIntensityButtonText = [
                    'absent',
                    '1+ slight',
                    '2+ normal',
                    '3+ very brisk',
                    '4+ clonus',
                ];
                for (reflex in physicalWidgets[widget]) {
                    const reflexInfo: ReflexesWidgetItemState =
                        physicalWidgets[widget][reflex];
                    const reflexNoteText =
                        (reflexInfo.intensity in reflexIntensityButtonText
                            ? reflexIntensityButtonText[reflexInfo.intensity] +
                              ' '
                            : '') +
                        (reflexInfo.side !== ''
                            ? reflexInfo.side === LeftRight.Left
                                ? 'left '
                                : 'right '
                            : '') +
                        (reflexInfo.location !== ''
                            ? reflexInfo.location
                            : '') +
                        ' reflex';
                    if (reflexNoteText !== '') {
                        this.widgets.tendon_reflexes.push(
                            reflexNoteText.trim()
                        );
                    }
                }
            } else if (widget === 'murmurs') {
                let murmur: keyof WidgetsState['murmurs'];
                for (murmur in physicalWidgets[widget]) {
                    const murmurInfo = physicalWidgets[widget][murmur];

                    const heardBest = murmurInfo.bestHeardAt
                        ? ' heard best at ' + murmurInfo.bestHeardAt
                        : '';

                    const specificMurmurInfo = murmurInfo.specificMurmurInfo;
                    if (
                        specificMurmurInfo &&
                        specificMurmurInfo !== this.emptyMurmur &&
                        specificMurmurInfo?.specificMurmur !== ''
                    ) {
                        const specificMurmurName =
                            specificMurmurInfo.specificMurmur;
                        const pansystolicMurmurs = [
                            'mitral regurgitation',
                            'tricuspid regurgitation',
                            'ventricular septal defect',
                            'mitral prolapse',
                            'physiologic',
                        ];
                        let expandedCrescDecresc = '';
                        if (murmurInfo.phase === Phase.Systolic) {
                            if (
                                pansystolicMurmurs.includes(
                                    specificMurmurInfo.specificMurmur
                                )
                            ) {
                                expandedCrescDecresc = 'pansystolic';
                            } else {
                                expandedCrescDecresc = 'crescendo-decrescendo';
                            }
                        } else if (murmurInfo.phase === Phase.Diastolic) {
                            expandedCrescDecresc = 'decrescendo';
                        }

                        const specificMurmurRadiation = [];
                        let specificMurmurAdditionalFeatures = '';
                        let specificMurmurTime = '';

                        let radKey: MurmurRadiation;
                        for (radKey in specificMurmurInfo.radiationTo) {
                            if (specificMurmurInfo.radiationTo[radKey]) {
                                specificMurmurRadiation.push(
                                    this.convertButtonTextToNoteText(radKey)
                                );
                            }
                        }

                        let featureKey: MurmurAdditionalFeature;
                        for (featureKey in specificMurmurInfo.additionalFeatures) {
                            if (
                                specificMurmurInfo.additionalFeatures[
                                    featureKey
                                ]
                            ) {
                                if (
                                    (murmurInfo.phase === Phase.Diastolic &&
                                        featureKey === 'early') ||
                                    featureKey === 'mid'
                                ) {
                                    specificMurmurTime =
                                        this.convertButtonTextToNoteText(
                                            featureKey
                                        );
                                } else {
                                    specificMurmurAdditionalFeatures =
                                        this.convertButtonTextToNoteText(
                                            featureKey
                                        );
                                }
                            }
                        }

                        const expandedFinding =
                            specificMurmurTime +
                            (specificMurmurTime !== '' ? ' ' : '') +
                            (specificMurmurName === 'physiologic'
                                ? 'physiologic'
                                : '') +
                            (expandedCrescDecresc !== 'pansystolic'
                                ? murmurInfo.phase
                                : '') +
                            (expandedCrescDecresc === 'pansystolic'
                                ? ''
                                : ' ') +
                            expandedCrescDecresc +
                            ' murmur' +
                            (specificMurmurAdditionalFeatures !== '' &&
                            specificMurmurAdditionalFeatures !==
                                'increased with valsava'
                                ? ' with ' + specificMurmurAdditionalFeatures
                                : '') +
                            heardBest +
                            (specificMurmurRadiation.length > 0
                                ? ', with radiation to ' +
                                  Object.values(specificMurmurRadiation).join(
                                      ', '
                                  )
                                : '') +
                            (specificMurmurAdditionalFeatures ===
                            'increased with valsava'
                                ? ', which increases with the Valsalva maneuver'
                                : '') +
                            (specificMurmurName !== 'physiologic'
                                ? ', likely ' + specificMurmurName
                                : '');
                        this.widgets.cardiac.push(
                            expandedFinding.substring(0, 1).toUpperCase() +
                                expandedFinding.substring(1)
                        );
                    } else {
                        let crescDecres = '';
                        if (murmurInfo.crescendo && murmurInfo.decrescendo) {
                            crescDecres = 'crescendo-descrescendo';
                        } else if (murmurInfo.decrescendo) {
                            crescDecres = 'decrescendo';
                        } else {
                            crescDecres = 'crescendo';
                        }

                        let qualityValues: keyof typeof murmurInfo.quality;
                        const murmurQuality: string[] = [];
                        for (qualityValues in murmurInfo.quality) {
                            if (murmurInfo.quality[qualityValues]) {
                                murmurQuality.push(qualityValues);
                            }
                        }
                        const quality =
                            murmurQuality.length > 0
                                ? ' with a ' +
                                  Object.values(murmurQuality).join(', ') +
                                  ' quality'
                                : '';

                        const unexpandedFinding =
                            (murmurInfo.phase !== ''
                                ? murmurInfo.phase
                                      .substring(0, 1)
                                      .toUpperCase() +
                                  murmurInfo.phase.substring(1) +
                                  ' '
                                : '') +
                            (crescDecres !== '' ? crescDecres : '') +
                            (murmurInfo.phase !== '' || crescDecres !== ''
                                ? ' murmur'
                                : '') +
                            quality +
                            heardBest +
                            (murmurInfo.phase !== '' ||
                            crescDecres !== '' ||
                            quality !== '' ||
                            heardBest !== ''
                                ? '. '
                                : '') +
                            (murmurInfo.intensity !== -1
                                ? 'Intensity ' + murmurInfo.intensity
                                : '') +
                            (murmurInfo.intensity !== -1 &&
                            murmurInfo.pitch !== ''
                                ? ', '
                                : '') +
                            (murmurInfo.pitch !== ''
                                ? (murmurInfo.intensity == -1
                                      ? murmurInfo.pitch
                                            .substring(0, 1)
                                            .toUpperCase() +
                                        murmurInfo.pitch.substring(1)
                                      : murmurInfo.pitch) + ' pitch'
                                : '');
                        this.widgets.cardiac.push(unexpandedFinding.trim());
                    }
                }
            }
        }
        return this.widgets;
    };

    displaySections = () => {
        let active: string[] = [];
        let comments = '';
        const sections = this.props.physicalExam.sections;

        // sections that have left/right buttons
        for (const category in sections) {
            active = [];
            comments = '';
            const sectionFindings = sections[category].findings;
            for (const findingName in sectionFindings) {
                const finding = sectionFindings[findingName];
                if (typeof finding === 'object') {
                    if (finding.center) {
                        if (finding.left && finding.right) {
                            active.push('bilateral ' + findingName);
                        } else if (finding.left) {
                            active.push('left ' + findingName);
                        } else if (finding.right) {
                            active.push('right ' + findingName);
                        } else {
                            active.push(findingName);
                        }
                    }
                }

                // sections that have normal buttons
                else if (typeof finding === 'boolean' && finding) {
                    active.push(findingName);
                }

                // gets comments section of physical exam
                if (sections[category].comments) {
                    comments = sections[category].comments;
                }
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
                const widgetKey = this.convertSectionKeytoWidgetKey(key);
                return widgetKey in this.widgets &&
                    (this.components[key].active.length > 0 ||
                        this.widgets[widgetKey].length > 0) ? (
                    <Table.Row>
                        <Table.Cell singleLine>{key}</Table.Cell>
                        <Table.Cell>
                            {this.displayComments(
                                this.components[key].comments
                            ) +
                                this.components[key].active.join(', ') +
                                '. ' +
                                this.widgets[widgetKey].join(', ') +
                                '.'}
                        </Table.Cell>
                    </Table.Row>
                ) : !(widgetKey in this.widgets) &&
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
            return Object.keys(this.components).map((key) => {
                const widgetKey = this.convertSectionKeytoWidgetKey(key);
                return widgetKey in this.widgets &&
                    this.components[key].active.length > 0 &&
                    this.widgets[widgetKey].length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.components[key].active.join(', ') +
                            '. ' +
                            this.widgets[widgetKey].join(', ') +
                            '.'}
                    </li>
                ) : widgetKey in this.widgets &&
                  this.components[key].active.length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.components[key].active.join(', ') +
                            '.'}
                    </li>
                ) : widgetKey in this.widgets &&
                  !(this.components[key].active.length > 0) &&
                  this.widgets[widgetKey].length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.widgets[widgetKey].join(', ') +
                            '.'}
                    </li>
                ) : !(widgetKey in this.widgets) &&
                  this.components[key].active.length > 0 ? (
                    <li>
                        <b>{key}: </b>
                        {this.displayComments(this.components[key].comments) +
                            this.components[key].active.join(', ') +
                            '.'}
                    </li>
                ) : null;
            });
        }
    };

    render() {
        const { isRich } = this.props;

        if (!this.isEmpty) {
            return <div />;
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
                        {this.displayVitals()}
                        {this.displaySections()}
                    </Table.Body>
                </Table>
            );
        } else {
            return (
                <ul>
                    {this.displayVitals()}
                    {this.displaySections()}
                </ul>
            );
        }
    }
}

export default PhysicalExamNote;

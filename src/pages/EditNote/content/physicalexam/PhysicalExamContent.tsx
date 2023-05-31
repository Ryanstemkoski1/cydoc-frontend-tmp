import React from 'react';
import {
    Accordion,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Button,
    InputOnChangeData,
} from 'semantic-ui-react';
import PhysicalExamGroup from './PhysicalExamGroup';
import exampleSchema from 'constants/PhysicalExam/exampleSchema.json';
import { PHYSICAL_EXAM_MOBILE_BP } from 'constants/breakpoints.js';
import './PhysicalExam.css';
import { updateVitals } from 'redux/actions/physicalExamActions';
import { connect } from 'react-redux';
import { selectVitals } from 'redux/selectors/physicalExamSelectors';
import { Vitals, VitalsFields } from 'redux/reducers/physicalExamReducer';
import { PhysicalExamSchemaItem } from 'constants/PhysicalExam/physicalExamSchema';
import { CurrentNoteState } from 'redux/reducers';
import ButtonGroupTemparature from './InputSelectableTemparature';

//Component that manages content for the Physical Exam tab
class PhysicalExamContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            weightKg: 0,
            heightM: 0,
            bmi: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData
    ) => {
        const numeric = +e.target.value;
        this.props.updateVitals(data.name, +numeric.toFixed(1));

        if (data.name === 'weight' || data.name === 'height') {
            this.calculateBmi(data.name, numeric);
        }
    };
    calculateBmi = (name: string, val: number) => {
        let weightInPl: number;
        let heightInInch: number;
        let weightInKg: number;
        let valueInM: number;
        let bmi: number;
        // if
        if (name === 'weight') {
            weightInPl = val;
            weightInKg = weightInPl * 0.45359237;
            if (this.state.heightM) {
                bmi = weightInKg / (this.state.heightM * this.state.heightM);
                this.setState({ bmi: +bmi.toFixed(1) });
            }
            this.setState({ weightKg: weightInKg });
        } else if (name === 'height') {
            heightInInch = val;
            valueInM = heightInInch * 0.0254;
            if (this.state.weightKg) {
                bmi = this.state.weightKg / (valueInM * valueInM);
                this.setState({ bmi: +bmi.toFixed(1) });
            }
            this.setState({ heightM: valueInM });
        }
    };
    handleChangeTemparature = (val: string, data: InputOnChangeData) => {
        const num = +val;
        this.props.updateVitals(data.name, +num.toFixed(1));
    };

    generateNumericInput = (
        name: VitalsFields,
        label: string | null,
        labelPosition: any
    ) => {
        const { vitals } = this.props;
        vitals[name] = vitals[name] == 0 ? null! : vitals[name];
        return (
            <Input
                type='number'
                label={label}
                labelPosition={labelPosition}
                className='pe-input'
                name={name}
                value={vitals[name]}
                onChange={(e, data) => this.handleChange(e, data)}
                placeholder='0'
            />
        );
    };

    renderPanels = (groups: PhysicalExamSchemaItem[] | ExampleSchema[]) => {
        const itemGroups = groups as PhysicalExamSchemaItem[];
        const isMobileView = this.state.windowWidth <= PHYSICAL_EXAM_MOBILE_BP;
        const panels = [
            {
                key: 'Vitals',
                title: {
                    className: 'ui dropdown-title',
                    content: 'Vitals',
                    icon: 'dropdown',
                    onClick: () => {
                        void 0;
                    },
                },
                content: {
                    content: (
                        <Form>
                            <Grid stackable columns='3'>
                                <Grid.Column>
                                    <Header
                                        as='h5'
                                        content='Blood Pressure (mmHg)'
                                    />
                                    <Form.Field>
                                        {this.generateNumericInput(
                                            'systolicBloodPressure',
                                            'systolic',
                                            'right'
                                        )}
                                    </Form.Field>
                                    <Form.Field>
                                        {this.generateNumericInput(
                                            'diastolicBloodPressure',
                                            'diastolic',
                                            'right'
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content='Heart Rate'
                                            />
                                        </label>
                                        {this.generateNumericInput(
                                            'heartRate',
                                            'bpm',
                                            'right'
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5' content='RR' />
                                        </label>
                                        {this.generateNumericInput(
                                            'RR',
                                            null,
                                            null
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content='Temperature'
                                            />
                                        </label>
                                        <ButtonGroupTemparature
                                            handleChange={
                                                this.handleChangeTemparature
                                            }
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content='Oxygen Saturation'
                                            />
                                        </label>
                                        {this.generateNumericInput(
                                            'oxygenSaturation',
                                            null,
                                            null
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>{''}</Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5' content='Weight' />
                                        </label>
                                        {this.generateNumericInput(
                                            'weight',
                                            'pounds',
                                            'right'
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5' content='Height' />
                                        </label>
                                        {this.generateNumericInput(
                                            'height',
                                            'inches',
                                            'right'
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5' content='BMI' />
                                        </label>
                                        <p className='bmi-text'>
                                            {this.state.bmi
                                                ? this.state.bmi
                                                : 'N/A'}
                                        </p>
                                    </Form.Field>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    ),
                },
            },
        ];
        const mobileScrollMappings: { [key: string]: any } = {
            '1': 40,
            '2': 65,
            '3': 90,
            '4': 110,
            '5': 135,
            '6': 160,
            '7': 185,
            '8': 205,
            '9': 725,
            '10': 250,
            '11': 275,
            '12': 300,
            '13': 725,
            '14': 725,
            '15': 725,
            '16': 400,
        };
        const mobileOpened: { [key: string]: boolean } = {
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false,
            '6': false,
            '7': false,
            '8': false,
            '9': false,
            '10': false,
            '11': false,
            '12': false,
            '13': false,
            '14': false,
            '15': false,
            '16': false,
        };

        for (let i = 1; i < itemGroups.length + 1; i++) {
            panels.push({
                key: itemGroups[i - 1].name,
                title: {
                    className: 'ui dropdown-title',
                    content: itemGroups[i - 1].name,
                    icon: 'dropdown',
                    onClick: () => {
                        if (isMobileView && !mobileOpened[i.toString()]) {
                            for (let j = 1; j < 17; j++) {
                                if (
                                    mobileOpened[j.toString()] == true &&
                                    j != i
                                ) {
                                    mobileOpened[j.toString()] = false;
                                }
                            }
                            setTimeout(() => {
                                window.scrollTo(
                                    0,
                                    mobileScrollMappings[i.toString()]
                                );
                            }, 10);
                            mobileOpened[i.toString()] = true;
                        } else {
                            mobileOpened[i.toString()] = false;
                        }
                    },
                },
                content: {
                    content: (
                        <PhysicalExamGroup
                            name={itemGroups[i - 1].name}
                            rows={itemGroups[i - 1].rows}
                        />
                    ),
                },
            });
        }
        return panels;
    };

    render() {
        return (
            <>
                <Accordion
                    styled
                    fluid
                    panels={this.renderPanels(exampleSchema.sections)}
                />

                <Button
                    icon
                    floated='left'
                    onClick={this.props.previousFormClick}
                    className='small-physical-previous-button'
                >
                    <Icon name='arrow left' />
                </Button>
                <Button
                    icon
                    labelPosition='left'
                    floated='left'
                    onClick={this.props.previousFormClick}
                    className='physical-previous-button'
                >
                    Prev
                    <Icon name='arrow left' />
                </Button>

                <Button
                    icon
                    floated='right'
                    onClick={this.props.nextFormClick}
                    className='small-physical-next-button'
                >
                    <Icon name='arrow right' />
                </Button>
                <Button
                    icon
                    labelPosition='right'
                    floated='right'
                    onClick={this.props.nextFormClick}
                    className='physical-next-button'
                >
                    Next
                    <Icon name='arrow right' />
                </Button>
            </>
        );
    }
}

interface ExampleSchema {
    rows: (
        | {
              normalOrAbnormal: string;
              needsRightLeft: boolean;
              display: string;
              includeSelectAll: boolean;
              findings: string[];
              widget?: undefined;
          }
        | {
              normalOrAbnormal: string;
              needsRightLeft: boolean;
              display: string;
              widget: string;
              includeSelectAll: boolean;
              findings: never[];
          }
    )[];
}

interface ContentProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
}

interface DispatchProps {
    updateVitals: (vitalsField: VitalsFields, newValue: number) => void;
    vitals: Vitals;
}

interface State {
    windowWidth: number;
    windowHeight: number;
    weightKg: number;
    heightM: number;
    bmi: number;
}

type Props = DispatchProps & ContentProps;

const mapStatetoProps = (state: CurrentNoteState) => {
    return {
        vitals: selectVitals(state),
    };
};

const mapDispatchToProps = {
    updateVitals,
};

export default connect(
    mapStatetoProps,
    mapDispatchToProps
)(PhysicalExamContent);

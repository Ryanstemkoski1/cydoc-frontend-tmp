import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import exampleSchema from '@constants/PhysicalExam/exampleSchema.json';
import { PhysicalExamSchemaItem } from '@constants/PhysicalExam/physicalExamSchema';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { updateVitals } from '@redux/actions/physicalExamActions';
import { CurrentNoteState } from '@redux/reducers';
import { VitalsFields } from '@redux/reducers/physicalExamReducer';
import { selectVitals } from '@redux/selectors/physicalExamSelectors';
import {
    Accordion,
    Form,
    Grid,
    Header,
    Input,
    InputOnChangeData,
    InputProps,
} from 'semantic-ui-react';
import ButtonGroupTemperature from './InputSelectableTemperature';
import './PhysicalExam.css';
import PhysicalExamGroup from './PhysicalExamGroup';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';

interface State {
    weightKg: number;
    heightM: number;
    bmi: number;
    headCircumference: number;
}
interface OwnProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

//Component that manages content for the Physical Exam tab
class PhysicalExamContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            weightKg: 0,
            heightM: 0,
            bmi: 0,
            headCircumference: 0,
        };
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

    calculateAgeInYears = (dateOfBirth: string) => {
        const dobObj = new Date(dateOfBirth);
        const timeDiff = Math.abs(Date.now() - dobObj.getTime());
        const ageInYears = timeDiff / (1000 * 60 * 60 * 24 * 365.25);
        return ageInYears;
    };

    isPediatric() {
        if (
            this.props.additionalSurvey.dateOfBirth === undefined ||
            this.props.additionalSurvey.dateOfBirth === null ||
            this.props.additionalSurvey.dateOfBirth === ''
        ) {
            return +false;
        }

        const patientAge = this.calculateAgeInYears(
            this.props.additionalSurvey.dateOfBirth
        );
        return +(patientAge <= 2);
    }

    handleChangeTemperature = (val: string) => {
        const num = +val;
        this.props.updateVitals('temperature', +num.toFixed(1));
    };

    handleChangeTemperatureUnit = (val: string) => {
        const num = +val;
        this.props.updateVitals('tempUnit', +num.toFixed(1));
    };

    generateNumericInput = (
        name: VitalsFields,
        label: string | null,
        labelPosition: InputProps['labelPosition']
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

        const panels = [
            {
                key: 'Vitals',
                title: {
                    className: 'ui dropdown-title listing',
                    content: 'Vitals',
                    icon: 'dropdown',
                    onClick: () => {
                        void 0;
                    },
                },
                content: {
                    content: (
                        <Form className='physical-content'>
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
                                    <Form.Field inline={false}>
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
                                    <Form.Field inline={false}>
                                        <label>
                                            <Header as='h5' content='RR' />
                                        </label>
                                        {this.generateNumericInput(
                                            'RR',
                                            null,
                                            undefined
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={false}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content='Temperature'
                                            />
                                        </label>
                                        <ButtonGroupTemperature
                                            temperature={
                                                this.props.vitals.temperature
                                            }
                                            tempUnit={
                                                this.props.vitals.tempUnit
                                            }
                                            handleTempChange={
                                                this.handleChangeTemperature
                                            }
                                            handleTempUnitChange={
                                                this.handleChangeTemperatureUnit
                                            }
                                        />
                                    </Form.Field>
                                </Grid.Column>

                                <Grid.Column>
                                    <Form.Field inline={false}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content='Oxygen Saturation'
                                            />
                                        </label>
                                        {this.generateNumericInput(
                                            'oxygenSaturation',
                                            null,
                                            undefined
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>{''}</Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={false}>
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
                                    <Form.Field inline={false}>
                                        <label>
                                            <Header
                                                as='h5'
                                                content={
                                                    this.isPediatric()
                                                        ? 'Length'
                                                        : 'Height'
                                                }
                                            />
                                        </label>
                                        {this.generateNumericInput(
                                            'height',
                                            'inches',
                                            'right'
                                        )}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={false}>
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
                                {this.isPediatric() ? (
                                    <Grid.Column>
                                        <Form.Field inline={false}>
                                            <label>
                                                <Header
                                                    as='h5'
                                                    content='Head Circumference'
                                                />
                                            </label>
                                            {this.generateNumericInput(
                                                'headCircumference',
                                                'inches',
                                                'right'
                                            )}
                                        </Form.Field>
                                    </Grid.Column>
                                ) : (
                                    <br></br>
                                )}
                            </Grid>
                        </Form>
                    ),
                },
            },
        ];

        for (let i = 1; i < itemGroups.length + 1; i++) {
            panels.push({
                key: itemGroups[i - 1].name,
                title: {
                    className: 'ui dropdown-title listing',
                    content: itemGroups[i - 1].name,
                    icon: 'dropdown',
                    onClick: () => {
                        void 0;
                    },
                },
                content: {
                    content: (
                        <div className='btn-wrapper'>
                            <PhysicalExamGroup
                                name={itemGroups[i - 1].name}
                                rows={itemGroups[i - 1].rows}
                            />
                        </div>
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
                <br />
                <NavigationButton
                    previousClick={this.props.previousFormClick}
                    nextClick={this.props.nextFormClick}
                />
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
const mapStateToProps = (state: CurrentNoteState) => {
    return {
        additionalSurvey: selectAdditionalSurvey(state),
        vitals: selectVitals(state),
    };
};

const mapDispatchToProps = { updateVitals };
const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(PhysicalExamContent);

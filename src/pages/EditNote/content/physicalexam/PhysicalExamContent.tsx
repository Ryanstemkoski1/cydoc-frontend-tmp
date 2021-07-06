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
import {
    PhysicalExamState,
    Vitals,
    VitalsFields,
} from 'redux/reducers/physicalExamReducer';
import { PhysicalExamSchemaItem } from 'constants/PhysicalExam/physicalExamSchema';
import { CurrentNoteState } from 'redux/reducers';

//Component that manages content for the Physical Exam tab
class PhysicalExamContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
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
        this.props.updateVitals(data.name, parseInt(e.target.value));
    };

    generateNumericInput = (
        name: VitalsFields,
        label: string | null,
        labelPosition: any
    ) => {
        const { vitals } = this.props;
        return (
            <Input
                type='number'
                label={label}
                labelPosition={labelPosition}
                className='pe-input'
                name={name}
                value={vitals[name]}
                onChange={(e, data) => this.handleChange(e, data)}
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
                                        {this.generateNumericInput(
                                            'temperature',
                                            '℃',
                                            'right'
                                        )}
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
                    className: 'ui dropdown-title',
                    content: itemGroups[i - 1].name,
                    icon: 'dropdown',
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
                    Previous
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

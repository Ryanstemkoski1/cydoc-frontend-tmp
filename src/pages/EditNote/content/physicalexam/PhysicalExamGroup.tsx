import React, { Component, Fragment } from 'react';
import { Grid, Form, TextAreaProps, ButtonProps } from 'semantic-ui-react';
import PhysicalExamRow from './PhysicalExamRow';
import { PHYSICAL_EXAM_MOBILE_BP } from 'constants/breakpoints.js';
import {
    toggleFinding,
    toggleLeftRightFinding,
    updateComments,
} from 'redux/actions/physicalExamActions';
import { connect } from 'react-redux';
import { selectSection } from 'redux/selectors/physicalExamSelectors';
import { PhysicalExamSchemaRow } from 'constants/PhysicalExam/physicalExamSchema';
import { LRButtonState } from 'constants/enums';
import { PhysicalExamSection } from 'redux/reducers/physicalExamReducer';
import { CurrentNoteState } from 'redux/reducers';
import './PhysicalExamGroup.css';

//Sub-Component that represents the individual categories for the Review of Systems section of the note
class PhysicalExamGroup extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
        };
        this.handleToggle = this.handleToggle.bind(this);
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

        this.setState({ windowWidth });
    }

    handleToggle = (
        section: string,
        e: React.MouseEvent<Element, MouseEvent>,
        data: ButtonProps
    ) => {
        this.props.toggleFinding(section, data.name);
    };

    handleLRToggle = (
        section: string,
        finding: string,
        e: React.MouseEvent<Element, MouseEvent>,
        data: ButtonProps
    ) => {
        let leftRight: keyof LRButtonState;
        if (data.content === 'L') {
            leftRight = 'left';
        } else if (data.content === 'R') {
            leftRight = 'right';
        } else {
            leftRight = 'center';
        }

        this.props.toggleLeftRightFinding(section, finding, leftRight);
    };

    handleTextChange = (
        e: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        this.props.updateComments(this.props.name, data.value as string);
    };

    generateRows = (rows: PhysicalExamSchemaRow[]) => {
        return rows.map((row, index) => (
            <PhysicalExamRow
                row={row}
                key={index}
                group={this.props.name}
                handleToggle={this.handleToggle}
                handleLRToggle={this.handleLRToggle}
            />
        ));
    };

    render() {
        const windowWidth = this.state.windowWidth;
        const { physicalExamSection } = this.props;
        const { comments } = physicalExamSection;
        return (
            <Fragment>
                {windowWidth !== 0 && windowWidth < PHYSICAL_EXAM_MOBILE_BP ? (
                    <>
                        <Form>
                            {this.generateRows(this.props.rows)}
                            <Form.Field>
                                <label>Additional Comments</label>
                                <Form.TextArea
                                    className='pe-textarea'
                                    value={comments}
                                    onChange={(e, data) => {
                                        this.handleTextChange(e, data);
                                    }}
                                />
                            </Form.Field>
                        </Form>
                    </>
                ) : (
                    <>
                        <Form>
                            <Grid columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateRows(this.props.rows)}
                                    </Grid.Column>
                                    <Grid.Column floated='right' width={5}>
                                        <Form.Field>
                                            <label>Additional Comments</label>
                                            <Form.TextArea
                                                value={comments}
                                                className='pe-textarea'
                                                onChange={(e, data) => {
                                                    this.handleTextChange(
                                                        e,
                                                        data
                                                    );
                                                }}
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </>
                )}
            </Fragment>
        );
    }
}

interface GroupProps {
    name: string;
    rows: PhysicalExamSchemaRow[];
}

interface DispatchProps {
    toggleFinding: (section: string, finding: string) => void;
    toggleLeftRightFinding: (
        section: string,
        finding: string,
        buttonClicked: keyof LRButtonState
    ) => void;
    updateComments: (section: string, newComments: string) => void;
    physicalExamSection: PhysicalExamSection;
}

type Props = GroupProps & DispatchProps;

interface State {
    windowWidth: number;
}

const mapStatetoProps = (state: CurrentNoteState, props: GroupProps) => {
    return {
        physicalExamSection: selectSection(state, props.name),
    };
};

const mapDispatchToProps = {
    toggleFinding,
    toggleLeftRightFinding,
    updateComments,
};

export default connect(mapStatetoProps, mapDispatchToProps)(PhysicalExamGroup);

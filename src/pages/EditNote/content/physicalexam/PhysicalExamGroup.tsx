import { PhysicalExamSchemaRow } from 'constants/PhysicalExam/physicalExamSchema';
import { LRButtonState } from 'constants/enums';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    toggleFinding,
    toggleLeftRightFinding,
    updateComments,
} from '@redux/actions/physicalExamActions';
import { CurrentNoteState } from '@redux/reducers';
import { PhysicalExamSection } from '@redux/reducers/physicalExamReducer';
import { selectSection } from '@redux/selectors/physicalExamSelectors';
import { ButtonProps, Form, Grid, TextAreaProps } from 'semantic-ui-react';
import './PhysicalExamGroup.css';
import PhysicalExamRow from './PhysicalExamRow';

//Sub-Component that represents the individual categories for the Review of Systems section of the note
class PhysicalExamGroup extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
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

    generateRows = (
        rows: PhysicalExamSchemaRow[],
        physicalExamSection: PhysicalExamSection
    ) => {
        let dropdownSchemaRow: PhysicalExamSchemaRow | undefined;
        const rowComponents = rows.map((row, index) => {
            // for sections with dropdowns, track which values the user
            // has selected, and update options accordingly
            if (row.display === 'autocompletedropdown') {
                dropdownSchemaRow = {
                    ...row,
                    display: 'buttons',
                    findings: row.findings.filter(
                        (finding) => finding in physicalExamSection.findings
                    ),
                };
                row = {
                    ...row,
                    findings: row.findings.filter(
                        (finding) => !(finding in physicalExamSection.findings)
                    ),
                };
            }
            return (
                <PhysicalExamRow
                    row={row}
                    key={index}
                    group={this.props.name}
                    handleToggle={this.handleToggle}
                    handleLRToggle={this.handleLRToggle}
                />
            );
        });

        // include user added findings
        if (!!dropdownSchemaRow && dropdownSchemaRow.findings.length > 0) {
            rowComponents.splice(
                rowComponents.length - 1,
                0,
                <PhysicalExamRow
                    row={dropdownSchemaRow}
                    key={-1}
                    group={this.props.name}
                    handleToggle={this.handleToggle}
                    handleLRToggle={this.handleLRToggle}
                    isDropdown={true}
                />
            );
        }
        return rowComponents;
    };

    render() {
        const { physicalExamSection } = this.props;
        const { comments } = physicalExamSection;
        const rowComponents = this.generateRows(
            this.props.rows,
            physicalExamSection
        );
        const commentComponent = (
            <Form.Field>
                <label>Additional Comments</label>
                <Form.TextArea
                    value={comments}
                    className='pe-textarea'
                    onChange={(e, data) => {
                        this.handleTextChange(e, data);
                    }}
                />
            </Form.Field>
        );
        return (
            <Form>
                {
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column>{rowComponents}</Grid.Column>
                            <Grid.Column floated='right' width={5}>
                                {commentComponent}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                }
            </Form>
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

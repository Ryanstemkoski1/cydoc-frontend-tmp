import React from 'react';
import {
    Button,
    Grid,
    Dropdown,
    DropdownProps,
    ButtonProps,
} from 'semantic-ui-react';
import SelectAllButton from './SelectAllButton';
import LRButton from 'components/tools/LRButtonRedux';
import LungSounds from './widgets/LungSounds';
import AbdomenExam from './widgets/AbdomenExam';
import PulsesWidget from './widgets/PulsesWidget';
import ReflexesWidget from './widgets/ReflexesWidget';
import HeartMurmurs from './widgets/HeartMurmurs';
import './PhysicalExam.css';
import { connect } from 'react-redux';
import { selectSection } from '@redux/selectors/physicalExamSelectors';
import {
    removeFinding,
    toggleFinding,
    toggleLeftRightFinding,
    toggleChooseBooleanValue,
} from '@redux/actions/physicalExamActions';
import { LRButtonState } from 'constants/enums';
import { PhysicalExamSection } from '@redux/reducers/physicalExamReducer';
import {
    PhysicalExamSchemaRow,
    WidgetType,
} from 'constants/PhysicalExam/physicalExamSchema';
import { CurrentNoteState } from '@redux/reducers';
import './PhysicalExamRow.css';

class PhysicalExamRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dropdownSelected: [],
        };
    }

    handleDropdownChange = (
        e: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        const value = data.value as string[];

        //first call is to add button to list of findings, then button is rendered
        value.forEach((v) => {
            this.props.row.needsRightLeft
                ? this.props.toggleLeftRightFinding(
                      this.props.group,
                      v,
                      'center'
                  )
                : this.props.toggleFinding(this.props.group, v);
        });

        //second call is to automatically select
        value.forEach((v) => {
            this.props.row.needsRightLeft
                ? this.props.toggleLeftRightFinding(
                      this.props.group,
                      v,
                      'center'
                  )
                : this.props.toggleFinding(this.props.group, v);
        });
    };

    handleDropdownButtonDeselect = (data: ButtonProps) => {
        // remove button only when active
        if (data.active) {
            const finding = data.content as string;
            this.props.removeFinding(this.props.group, finding);
        }
    };

    handleSelectAll = (children: string[]) => {
        const response = children.every((child) => {
            const currFindings = this.props.physicalExamSection.findings[child];
            return typeof currFindings == 'boolean'
                ? currFindings
                : currFindings.center;
        });
        children.map((child) =>
            this.props.toggleChooseBooleanValue(
                this.props.group,
                child,
                !response
            )
        );
    };

    generateButtons = ({
        findings,
        includeSelectAll,
        normalOrAbnormal,
        needsRightLeft,
    }: PhysicalExamSchemaRow) => {
        let buttons;
        const { physicalExamSection, isDropdown } = this.props;
        if (needsRightLeft) {
            buttons = findings.map((finding: string, index: number) => {
                const find = physicalExamSection.findings[
                    finding
                ] as LRButtonState;
                return (
                    <LRButton
                        key={index}
                        content={finding}
                        name={finding}
                        group={this.props.group}
                        active={find.center}
                        toggle={physicalExamSection.findings[finding]}
                        className={
                            find.center
                                ? 'pe-ros-button'
                                : 'pe-ros-button spaced-buttons'
                        }
                        color={
                            find.center
                                ? normalOrAbnormal === 'normal'
                                    ? 'green'
                                    : 'red'
                                : null
                        }
                        isDropdown={isDropdown}
                        onDropdownButtonClick={
                            this.handleDropdownButtonDeselect
                        }
                        onClick={this.props.handleLRToggle}
                    />
                );
            });
        } else {
            buttons = findings.map((finding, index) => {
                return (
                    <Button
                        key={index}
                        content={finding}
                        name={finding}
                        group={this.props.group}
                        active={
                            physicalExamSection.findings[finding] == true
                                ? true
                                : false
                        }
                        className={
                            physicalExamSection.findings[finding]
                                ? 'pe-ros-button'
                                : 'pe-ros-button spaced-buttons'
                        }
                        color={
                            physicalExamSection.findings[finding]
                                ? normalOrAbnormal === 'normal'
                                    ? 'green'
                                    : 'red'
                                : undefined
                        }
                        onClick={(e, data) => {
                            this.props.handleToggle(this.props.group, e, data);
                            if (isDropdown) {
                                this.handleDropdownButtonDeselect(data);
                            }
                        }}
                    />
                );
            });
        }

        if (includeSelectAll) {
            return (
                <SelectAllButton handleClick={this.handleSelectAll}>
                    {buttons}
                </SelectAllButton>
            );
        } else {
            return buttons;
        }
    };

    generateOptions = (findings: string[]) => {
        return findings.map((finding: string) => ({
            key: finding,
            value: finding,
            text: finding,
        }));
    };

    generateDropdown = ({
        findings,
    }: // includeSelectAll,
    // normalOrAbnormal,
    // needsRightLeft,
    PhysicalExamSchemaRow) => {
        return (
            <Grid.Row>
                <Dropdown
                    search
                    selection
                    multiple
                    placeholder='Search'
                    options={this.generateOptions(findings)}
                    value={this.state.dropdownSelected}
                    onChange={this.handleDropdownChange}
                />
            </Grid.Row>
        );
    };

    generateWidget = (widget: string) => {
        switch (widget) {
            case 'LUNG_WIDGET':
                return <LungSounds />;
            case 'PULSES_WIDGET':
                return <PulsesWidget />;
            case 'ABDOMEN_WIDGET':
                return <AbdomenExam />;
            case 'REFLEXES_WIDGET':
                return <ReflexesWidget />;
            case 'MURMUR_WIDGET':
                return <HeartMurmurs />;
            default:
                return null;
        }
    };

    render() {
        if (this.props.row.display === 'widget') {
            return (
                <Grid.Row>
                    <Grid.Column>
                        {this.generateWidget(
                            this.props.row.widget as WidgetType
                        )}
                    </Grid.Column>
                </Grid.Row>
            );
        } else if (this.props.row.display === 'autocompletedropdown') {
            return (
                <Grid.Row>
                    <Grid.Column>
                        {this.generateDropdown(this.props.row)}
                    </Grid.Column>
                </Grid.Row>
            );
        } else {
            return (
                <Grid.Row>
                    <Grid.Column>
                        {this.generateButtons(this.props.row)}
                    </Grid.Column>
                </Grid.Row>
            );
        }
    }
}

interface RowProps {
    group: string;
    row: PhysicalExamSchemaRow;
    isDropdown?: boolean;
    handleToggle: (
        section: string,
        e: React.MouseEvent<Element, MouseEvent>,
        data: ButtonProps
    ) => void;
    handleLRToggle: (
        section: string,
        finding: string,
        e: React.MouseEvent<Element, MouseEvent>,
        data: ButtonProps
    ) => void;
}

interface DispatchProps {
    removeFinding: (section: string, finding: string) => void;
    toggleFinding: (section: string, finding: string) => void;
    toggleLeftRightFinding: (
        section: string,
        finding: string,
        buttonClicked: keyof LRButtonState
    ) => void;
    physicalExamSection: PhysicalExamSection;
    toggleChooseBooleanValue: (
        section: string,
        finding: string,
        response: boolean
    ) => void;
}

type Props = RowProps & DispatchProps;

interface State {
    dropdownSelected: string[];
}

const mapStatetoProps = (state: CurrentNoteState, props: RowProps) => {
    return {
        physicalExamSection: selectSection(state, props.group),
    };
};

const mapDispatchToProps = {
    removeFinding,
    toggleFinding,
    toggleLeftRightFinding,
    toggleChooseBooleanValue,
};

export default connect(mapStatetoProps, mapDispatchToProps)(PhysicalExamRow);

import React, { Fragment } from 'react';
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
import { selectSection } from 'redux/selectors/physicalExamSelectors';
import {
    toggleFinding,
    toggleLeftRightFinding,
} from 'redux/actions/physicalExamActions';
import { LRButtonState } from 'constants/enums';
import { PhysicalExamSection } from 'redux/reducers/physicalExamReducer';
import {
    PhysicalExamSchemaRow,
    WidgetType,
} from 'constants/PhysicalExam/physicalExamSchema';
import { CurrentNoteState } from 'redux/reducers';
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
        //for selecting buttons to appear only
        const value = data.value as string[];
        const newValues = value.filter(
            (v) => !this.state.dropdownSelected.includes(v)
        );
        newValues.forEach((v) => {
            this.props.row.needsRightLeft
                ? this.props.toggleLeftRightFinding(
                      this.props.group,
                      v,
                      'center'
                  )
                : this.props.toggleFinding(this.props.group, v);
        });
        this.setState({ dropdownSelected: value });
    };

    handleDropdownButtonDeselect = (data: ButtonProps) => {
        //prevent removing button when not active
        if (data.active) {
            const buttonLabel = data.content as string;
            //if is a regular button
            const newDropdownValues = this.state.dropdownSelected.filter(
                (str) => str !== buttonLabel
            );
            this.setState({ dropdownSelected: newDropdownValues });
        }
    };

    handleSelectAll = (button: ButtonProps) => {
        if ('toggle' in button.props) {
            this.props.toggleLeftRightFinding(
                this.props.group,
                button.props.name,
                'center'
            );
        } else {
            this.props.toggleFinding(this.props.group, button.props.name);
        }
    };

    generateButtons = (
        {
            findings,
            includeSelectAll,
            normalOrAbnormal,
            needsRightLeft,
        }: {
            findings: string[];
            includeSelectAll: boolean;
            normalOrAbnormal: 'normal' | 'abnormal';
            needsRightLeft: boolean;
        },
        isDropdown?: boolean
    ) => {
        let buttons;
        const { physicalExamSection } = this.props;
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
                        color={
                            find.center
                                ? normalOrAbnormal === 'normal'
                                    ? 'green'
                                    : 'red'
                                : null
                        }
                        isDropdown={isDropdown}
                        onDropdownButtonClick={
                            isDropdown
                                ? this.handleDropdownButtonDeselect
                                : // eslint-disable-next-line @typescript-eslint/no-empty-function
                                  () => {}
                        }
                        onClick={this.props.handleLRToggle}
                        className={'spaced-buttons'}
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
                        className={'spaced-buttons'}
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
        includeSelectAll,
        normalOrAbnormal,
        needsRightLeft,
    }: {
        findings: string[];
        includeSelectAll: boolean;
        normalOrAbnormal: 'normal' | 'abnormal';
        needsRightLeft: boolean;
    }) => {
        return (
            <Fragment>
                <Grid.Row>
                    {this.generateButtons(
                        {
                            findings: this.state.dropdownSelected,
                            includeSelectAll,
                            normalOrAbnormal,
                            needsRightLeft,
                        },
                        true
                    )}
                </Grid.Row>
                <Grid.Row>
                    <Dropdown
                        search
                        selection
                        multiple
                        options={this.generateOptions(findings)}
                        value={this.state.dropdownSelected}
                        onChange={this.handleDropdownChange}
                    />
                </Grid.Row>
            </Fragment>
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
    toggleFinding: (section: string, finding: string) => void;
    toggleLeftRightFinding: (
        section: string,
        finding: string,
        buttonClicked: keyof LRButtonState
    ) => void;
    physicalExamSection: PhysicalExamSection;
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
    toggleFinding,
    toggleLeftRightFinding,
};

export default connect(mapStatetoProps, mapDispatchToProps)(PhysicalExamRow);

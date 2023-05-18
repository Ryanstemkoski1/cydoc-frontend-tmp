import React, { Component } from 'react';
import SurgicalHistoryTableBodyRow from './SurgicalHistoryTableBodyRow';
import {
    updateProcedure,
    updateYear,
    updateComments,
    deleteProcedure,
    AddPshPopOptionsAction,
    addPshPopOptions,
} from 'redux/actions/surgicalHistoryActions';
import procedures from 'constants/procedures';
import Dropdown from 'components/tools/OptimizedDropdown';
import {
    Accordion,
    Form,
    Input,
    Table,
    DropdownProps,
    TextAreaProps,
    InputOnChangeData,
    Header,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import {
    SurgicalHistoryState,
    SurgicalHistoryItem,
} from 'redux/reducers/surgicalHistoryReducer';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import { selectSurgicalHistoryState } from 'redux/selectors/surgicalHistorySelectors';

import { OptionMapping } from '_processOptions';
import { ResponseTypes } from 'constants/hpiEnums';
import { v4 } from 'uuid';
import {
    BlankQuestionChangeAction,
    blankQuestionChange,
    PopResponseAction,
    popResponse,
} from 'redux/actions/hpiActions';
import './SurgicalHistoryContent.css';
import { YesNoResponse } from 'constants/enums';
import ToggleButton from 'components/tools/ToggleButton.js';
import { questionContainer, questionTextStyle } from './styles';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';

class SurgicalHistoryContent extends Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        const currentYear = new Date(Date.now()).getFullYear();
        const invalidYearSet = new Set();
        if (!this.props.isPreview) {
            const values = this.props.surgicalHistory;
            const keys = Object.keys(values);
            keys.map((i) => {
                const procedureYear = values[i]['year'];
                if (
                    (isNaN(procedureYear) ||
                        procedureYear < 1900 ||
                        procedureYear > currentYear) &&
                    procedureYear !== -1
                ) {
                    invalidYearSet.add(i);
                }
            });
        }

        this.state = {
            windowWidth: 0,
            proceduresOptions: procedures,
            active: new Set(),
            isInvalidYear: invalidYearSet,
            currentYear: currentYear,
            currSurgeries: Object.keys(this.props.surgicalHistory).filter(
                (surgery) =>
                    this.props.surgicalHistory[surgery].procedure.length &&
                    this.props.surgicalHistory[surgery].hasHadSurgery ==
                        YesNoResponse.Yes
            ),
            isSurgicalHistory: null,
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.toggleYesNoButton = this.toggleYesNoButton.bind(this);
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

    addRow() {
        const newKey = v4();
        this.props.addPshPopOptions(newKey, '');
        if (
            this.props.responseType == ResponseTypes.PSH_BLANK &&
            this.props.node
        )
            this.props.blankQuestionChange(this.props.node, newKey);
        else
            this.setState({
                currSurgeries: [...this.state.currSurgeries, newKey],
            });
    }

    deleteRow = (index: string) => {
        this.props.deleteProcedure(index);
    };

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(
        event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
            | React.SyntheticEvent,
        data: TextAreaProps | DropdownProps | InputOnChangeData
    ) {
        const { active } = this.state;
        if (!active.has(data.rowIndex)) {
            active.add(data.rowIndex);
            this.setState({ active });
        }
        const val = data.value as string;

        // Year validation
        if (data.type === 'year') {
            const procedureYear = +parseInt(val);
            if (
                data.value !== '' &&
                ((isNaN(procedureYear) && val !== '') ||
                    procedureYear < 1900 ||
                    procedureYear > this.state.currentYear)
            ) {
                if (!this.state.isInvalidYear.has(data.rowIndex)) {
                    const newInvalidYears = this.state.isInvalidYear;
                    newInvalidYears.add(data.rowIndex);
                    this.setState({ isInvalidYear: newInvalidYears });
                }
            } else if (this.state.isInvalidYear.has(data.rowIndex)) {
                const newInvalidYears = this.state.isInvalidYear;
                newInvalidYears.delete(data.rowIndex);
                this.setState({ isInvalidYear: newInvalidYears });
            }
        }
        if (data.className.includes('content-input-surgical')) {
            switch (data.type) {
                case 'procedure':
                    this.props.updateProcedure(data.rowIndex, val);
                    break;
                case 'year':
                    this.props.updateYear(data.rowIndex, parseInt(val));
                    break;
                case 'comments':
                    this.props.updateComments(data.rowIndex, val);
                    break;
                default:
                    return;
            }
        }
    }

    handleAddition(
        event: React.KeyboardEvent<HTMLElement>,
        data: DropdownProps
    ) {
        const value = data.value as string;
        this.setState({
            proceduresOptions: {
                ...this.state.proceduresOptions,
                [value]: { value, label: value },
            },
        });
    }

    toggleAccordion = (idx: string) => {
        const { active } = this.state;
        if (active.has(idx)) {
            active.delete(idx);
        } else {
            active.add(idx);
        }
        this.setState({ active });
    };

    //method to generate an collection of rows
    makeTableBodyRows(nums: string[]) {
        const cellField: (keyof SurgicalHistoryItem)[] = [
            'procedure',
            'hasHadSurgery',
            'year',
            'comments',
        ];
        const addProceduresOptions: OptionMapping = {};
        nums.map((index) => {
            if (index in this.props.surgicalHistory) {
                const procedure = this.props.surgicalHistory[index].procedure;
                addProceduresOptions[procedure] = {
                    value: procedure,
                    label: procedure,
                };
            }
        });
        const updatedProceduresOptions = Object.assign(
            {},
            this.state.proceduresOptions,
            addProceduresOptions
        );
        return nums.map((rowIndex: string, index: number) => (
            <SurgicalHistoryTableBodyRow
                {...this.props}
                key={index}
                rowIndex={rowIndex}
                fields={cellField}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                proceduresOptions={updatedProceduresOptions}
                isPreview={this.props.isPreview}
                currentYear={this.state.currentYear}
                mobile={this.props.mobile}
                deleteRow={this.deleteRow}
                pop={this.props.responseType == ResponseTypes.PSH_POP}
            />
        ));
    }

    //Method to generate the table header row
    makeHeader() {
        const fields = ['Procedure', '', 'Year', 'Comments'];
        return (
            <Table.Row>
                {fields.map((header, index) => (
                    <Table.HeaderCell key={index} className='sticky-header'>
                        {header}
                    </Table.HeaderCell>
                ))}
            </Table.Row>
        );
    }

    makeAccordionPanels(nums: string[], values: SurgicalHistoryState) {
        const { isPreview } = this.props;
        const panels: Panel[] = [];
        nums.map((i: string) => {
            const n = parseInt(i);
            let procedureName = '';
            let year = -1;
            let comments = '';
            if (i in values) {
                procedureName = values[i].procedure;
                year = values[i].year;
                comments = values[i].comments;
            }
            const titleContent = (
                <Form className='inline-form'>
                    {isPreview ? (
                        <Input
                            disabled
                            transparent
                            className='content-input-surgical medication'
                            value={nums[n]}
                        />
                    ) : (
                        // <Input
                        //     fluid
                        //     transparent
                        //     className='content-input-surgical content-dropdown medication'
                        //     id='add-row'
                        // >
                        <div id='width-full'>
                            <Dropdown
                                clearable
                                fluid
                                search
                                selection
                                allowAdditions
                                type='procedure'
                                optiontype='proceduresOptions'
                                options={this.state.proceduresOptions}
                                placeholder={'Procedure'}
                                onChange={this.handleTableBodyChange}
                                rowIndex={i}
                                value={procedureName}
                                onAddItem={this.handleAddition}
                                aria-label='Surgical-Dropdown'
                                className='content-input-surgical'
                            />
                        </div>
                        // </Input>
                    )}
                </Form>
            );

            const contentInputs = (
                <>
                    <div id='contents-input-div'>
                        <label
                            className='medications-content-input-label'
                            id='year-label'
                        >
                            <b>Year:</b>
                        </label>
                        <div id='contents-inner-input-div'>
                            <Input
                                fluid
                                transparent
                                rowIndex={i}
                                disabled={isPreview}
                                type='year'
                                placeholder='e.g. 2020'
                                value={
                                    isPreview ||
                                    year === -1 ||
                                    year.toString() === '-' ||
                                    isNaN(year)
                                        ? ''
                                        : year
                                }
                                onChange={this.handleTableBodyChange}
                                className='content-input-surgical content-dropdown'
                            />
                            {this.state.isInvalidYear.has(i) && (
                                <p className='year-validation-mobile-error'>
                                    Please enter a valid year between 1900 and{' '}
                                    {this.state.currentYear}
                                </p>
                            )}
                        </div>
                    </div>
                    <div id='contents-input-div'>
                        <label
                            className='medications-content-input-label'
                            id='comments-label'
                        >
                            <b>Comments:</b>
                        </label>
                        <div id='contents-inner-input-div'>
                            <Input
                                fluid
                                transparent
                                rowIndex={i}
                                disabled={isPreview}
                                type='comments'
                                placeholder='Comments'
                                onChange={this.handleTableBodyChange}
                                value={isPreview ? '' : comments}
                                className='content-input-surgical'
                            />
                        </div>
                    </div>
                </>
            );

            panels.push({
                key: i,
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                    icon: <></>,
                },
                content: {
                    content: <>{contentInputs}</>,
                },
                onTitleClick: () => {
                    this.toggleAccordion(i);
                },
            });
        });
        return panels;
    }
    toggleYesNoButton(state: boolean | null) {
        this.setState({
            isSurgicalHistory: state,
        });
    }

    render() {
        const values = this.props.surgicalHistory;
        let nums = Object.keys(values).filter(
            (key) =>
                this.state.currSurgeries.includes(key) ||
                values[key].hasHadSurgery == YesNoResponse.Yes
        );
        const { patientView } = this.props.userView;
        const {
            responseChoice,
            addPshPopOptions,
            responseType,
            popResponse,
            node,
            surgicalHistory,
        } = this.props;
        if (responseType == ResponseTypes.PSH_POP && responseChoice && node) {
            nums = responseChoice.map((procedureName) => {
                const key = Object.keys(surgicalHistory).find(
                    (entry) => surgicalHistory[entry].procedure == procedureName
                );
                let surgKey = '';
                if (key) surgKey = key;
                else {
                    surgKey = v4();
                    addPshPopOptions(surgKey, procedureName);
                }
                return surgKey;
            });
            popResponse(node, nums);
        }
        if (responseType == ResponseTypes.PSH_BLANK && responseChoice)
            nums = responseChoice;

        const content = (
            <>
                {this.state.windowWidth < 800 ? (
                    <Accordion
                        panels={this.makeAccordionPanels(nums, values)}
                        exclusive={false}
                        fluid
                        styled
                    />
                ) : (
                    <Table celled className='table-display'>
                        {<Table.Header content={this.makeHeader()} />}
                        {/* eslint-disable react/no-children-prop */}
                        <Table.Body children={this.makeTableBodyRows(nums)} />
                        {/* eslint-enable react/no-children-prop */}
                    </Table>
                )}
            </>
        );

        return (
            <>
                {patientView && (
                    <div style={questionContainer}>
                        <Header
                            as='h2'
                            textAlign='left'
                            content='Have you had any surgeries?'
                            style={questionTextStyle}
                        />
                        <ToggleButton
                            className='button_yesno'
                            title='Yes'
                            active={this.state.isSurgicalHistory || false}
                            onToggleButtonClick={() =>
                                this.toggleYesNoButton(true)
                            }
                        />
                        <ToggleButton
                            className='button_yesno'
                            title='No'
                            active={
                                this.state.isSurgicalHistory !== null &&
                                !this.state.isSurgicalHistory
                            }
                            onToggleButtonClick={() =>
                                this.toggleYesNoButton(false)
                            }
                        />
                    </div>
                )}
                {nums.length && (this.state.isSurgicalHistory || !patientView)
                    ? content
                    : ''}
                {!this.props.isPreview &&
                    (this.state.isSurgicalHistory || !patientView) &&
                    this.props.responseType != ResponseTypes.PSH_POP && (
                        <AddRowButton
                            onClick={this.addRow}
                            name='surgical history'
                        />
                    )}
            </>
        );
    }
}

type Panel = {
    key: string;
    active: boolean;
    title: { content: JSX.Element; icon: JSX.Element };
    content: { content: JSX.Element };
    onTitleClick: () => void;
};

export type Procedure = {
    key: string;
    value: string;
    text: string;
}[];

type OwnState = {
    windowWidth: number;
    proceduresOptions: OptionMapping;
    active: Set<string>;
    isInvalidYear: Set<unknown>;
    currentYear: number;
    currSurgeries: string[];
    isSurgicalHistory: boolean | null;
};
export interface UserViewProps {
    patientView: boolean;
    doctorView: boolean;
}
interface SurgicalHistoryProps {
    surgicalHistory: SurgicalHistoryState;
    userView: UserViewProps;
}

interface ContentProps {
    isPreview: boolean;
    mobile: boolean;
    responseChoice?: string[];
    responseType?: ResponseTypes;
    node?: string;
}

interface DispatchProps {
    updateProcedure: (index: string, newProcedure: string) => void;
    updateYear: (index: string, newYear: number) => void;
    updateComments: (index: string, newComment: string) => void;
    deleteProcedure: (index: string) => void;
    addPshPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddPshPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
    popResponse: (medId: string, conditionIds: string[]) => PopResponseAction;
}

type Props = ContentProps & DispatchProps & SurgicalHistoryProps;

const mapStateToProps = (state: CurrentNoteState): SurgicalHistoryProps => {
    return {
        surgicalHistory: selectSurgicalHistoryState(state),
        userView: state.userView,
    };
};

const mapDispatchToProps = {
    updateProcedure,
    updateYear,
    updateComments,
    deleteProcedure,
    addPshPopOptions,
    blankQuestionChange,
    popResponse,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurgicalHistoryContent);

import Input from 'components/Input/Input';
import Dropdown from 'components/tools/OptimizedDropdown';
import procedures from 'constants/procedures';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    AddPshPopOptionsAction,
    addPshPopOptions,
    deleteProcedure,
    toggleHasSurgicalHistory,
    updateComments,
    updateProcedure,
    updateYear,
} from 'redux/actions/surgicalHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    SurgicalHistoryElements,
    SurgicalHistoryItem,
} from 'redux/reducers/surgicalHistoryReducer';
import {
    selectHasSurgicalHistoryState,
    selectSurgicalHistoryProcedures,
} from 'redux/selectors/surgicalHistorySelectors';
import {
    DropdownProps,
    InputOnChangeData,
    TextAreaProps,
} from 'semantic-ui-react';
import SurgicalHistoryTableBodyRow from './SurgicalHistoryTableBodyRow';

import { OptionMapping } from '_processOptions';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import GridContent from 'components/tools/GridContent/GridContent';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import { ResponseTypes } from 'constants/hpiEnums';
import {
    BlankQuestionChangeAction,
    PopResponseAction,
    blankQuestionChange,
    popResponse,
} from 'redux/actions/hpiActions';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { v4 } from 'uuid';
import style from './SurgicalHistoryContent.module.scss';

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
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.toggleYesNoButton = this.toggleYesNoButton.bind(this);
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
            | React.SyntheticEvent
            | null,
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
        event: React.KeyboardEvent<HTMLElement> | React.SyntheticEvent | null,
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
                hide={this.props.hide}
                rowIndex={rowIndex}
                fields={cellField}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                proceduresOptions={updatedProceduresOptions}
                isPreview={this.props.isPreview}
                currentYear={this.state.currentYear}
                deleteRow={this.deleteRow}
                pop={this.props.responseType == ResponseTypes.PSH_POP}
            />
        ));
    }

    //Method to generate the table header row
    makeHeader() {
        const fields = this.props.hide
            ? ['Procedure', '']
            : ['Procedure', '', 'Year', 'Comments'];
        return fields.map((item) => ({ title: item, col: 1 }));
    }

    makeAccordionPanels(nums: string[], values: SurgicalHistoryElements) {
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
                <form className='inline-form'>
                    {isPreview ? (
                        <Input
                            disabled
                            transparent
                            className='content-input-surgical medication'
                            value={nums[n]}
                        />
                    ) : (
                        <div id='width-full' className='full-view'>
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
                    )}
                </form>
            );

            const contentInputs = (
                <>
                    <div id='contents-input-div'>
                        <label
                            className='medications-content-input-label surgical__label'
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
                                    year?.toString() === '-' ||
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
                            className='medications-content-input-label surgical__label'
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
        this.props.toggleHasSurgicalHistory(state as boolean);
    }

    render() {
        const values = this.props.surgicalHistory;
        let nums = Object.keys(values).filter(
            (key) =>
                this.state.currSurgeries.includes(key) ||
                values[key].hasHadSurgery == YesNoResponse.Yes
        );
        const { hasSurgicalHistory, patientView } = this.props;
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
        if (responseType == ResponseTypes.PSH_BLANK && responseChoice) {
            nums = responseChoice;
        }

        const content = (
            <GridContent
                header_titles={this.makeHeader()}
                rows={this.makeTableBodyRows(nums)}
                canAddNew={
                    !this.props.isPreview &&
                    (hasSurgicalHistory || !patientView) &&
                    this.props.responseType != ResponseTypes.PSH_POP
                }
                name='Surgical History'
                onAddRow={this.addRow}
            />
        );

        return (
            <div className={style.surgicalHistory}>
                {patientView && !nums.length && (
                    <div
                        className={`${style.surgicalHistory__item} flex-wrap align-center justify-between`}
                    >
                        <p>Have you had any surgeries?</p>
                        <aside>
                            <YesAndNo
                                yesButtonActive={hasSurgicalHistory || false}
                                handleYesButtonClick={() =>
                                    this.toggleYesNoButton(true)
                                }
                                noButtonActive={
                                    hasSurgicalHistory !== null &&
                                    !hasSurgicalHistory
                                }
                                handleNoButtonClick={() =>
                                    this.toggleYesNoButton(false)
                                }
                            />
                        </aside>
                    </div>
                )}
                {nums.length !== 0 &&
                    (hasSurgicalHistory || !patientView) &&
                    content}

                {nums.length === 0 && (hasSurgicalHistory || !patientView) && (
                    <AddRowButton
                        onClick={this.addRow}
                        name='Surgical History'
                    />
                )}
            </div>
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
    proceduresOptions: OptionMapping;
    active: Set<string>;
    isInvalidYear: Set<unknown>;
    currentYear: number;
    currSurgeries: string[];
};

interface SurgicalHistoryProps {
    hasSurgicalHistory: boolean | null;
    surgicalHistory: SurgicalHistoryElements;
    patientView: boolean;
}

interface ContentProps {
    isPreview: boolean;
    responseChoice?: string[];
    responseType?: ResponseTypes;
    node?: string;
    hide?: boolean;
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
    toggleHasSurgicalHistory: (state: boolean) => void;
}

type Props = ContentProps & DispatchProps & SurgicalHistoryProps;

const mapStateToProps = (state: CurrentNoteState): SurgicalHistoryProps => {
    return {
        hasSurgicalHistory: selectHasSurgicalHistoryState(state),
        surgicalHistory: selectSurgicalHistoryProcedures(state),
        patientView: selectPatientViewState(state),
    };
};

const mapDispatchToProps = {
    toggleHasSurgicalHistory,
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

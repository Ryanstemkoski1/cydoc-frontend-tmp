import React, { Component, ComponentType } from 'react';
import { SurgicalHistoryTableBodyRow } from './SurgicalHistoryTableBodyRow';
import {
    updateProcedure,
    updateYear,
    updateComments,
    addProcedure,
    deleteProcedure,
} from 'redux/actions/surgicalHistoryActions';
import { procedures } from 'constants/procedures';
import Dropdown from 'components/tools/OptimizedDropdown';
import {
    Accordion,
    Form,
    Icon,
    Input,
    Table,
    DropdownProps,
    TextAreaProps,
    InputOnChangeData,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import {
    SurgicalHistoryState,
    SurgicalHistoryItem,
} from 'redux/reducers/surgicalHistoryReducer';
import { CurrentNoteState } from 'redux/reducers';
import { connect, ConnectedProps } from 'react-redux';
import { selectSurgicalHistoryState } from 'redux/selectors/surgicalHistorySelectors';
import { OptionMapping } from '_processOptions';

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
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
    }

    addRow() {
        this.props.addProcedure();
    }

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
    makeTableBodyRows(nums: string[], values: SurgicalHistoryState) {
        const cellField: (keyof SurgicalHistoryItem)[] = [
            'procedure',
            'year',
            'comments',
        ];
        return nums.map((rowindex: string, index: number) => (
            <SurgicalHistoryTableBodyRow
                {...this.props}
                key={index}
                rowIndex={rowindex}
                fields={cellField}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                proceduresOptions={this.state.proceduresOptions}
                isPreview={this.props.isPreview}
                currentYear={this.state.currentYear}
                mobile={this.props.mobile}
            />
        ));
    }

    //Method to generate the table header row
    makeHeader() {
        const fields = ['Procedure', 'Year', 'Comments'];
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
                        <Input
                            transparent
                            className='content-input-surgical content-dropdown medication'
                        >
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
                                value={values[i].procedure}
                                onAddItem={this.handleAddition}
                                aria-label='Surgical-Dropdown'
                                className='content-input-surgical'
                            />
                        </Input>
                    )}
                </Form>
            );

            const contentInputs = (
                <>
                    <Input
                        fluid
                        transparent
                        rowIndex={i}
                        disabled={isPreview}
                        type='year'
                        label={{
                            basic: true,
                            content: 'Year:',
                            className: 'medications-content-input-label',
                        }}
                        placeholder='e.g. 2020'
                        value={
                            isPreview ||
                            values[i].year === -1 ||
                            values[i].year.toString() === '-' ||
                            isNaN(values[i].year)
                                ? ''
                                : values[i].year
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
                    <Input
                        fluid
                        transparent
                        rowIndex={i}
                        disabled={isPreview}
                        type='comments'
                        label={{
                            basic: true,
                            content: 'Comments: ',
                            className: 'medications-content-input-label',
                        }}
                        placeholder='Comments'
                        onChange={this.handleTableBodyChange}
                        value={isPreview ? '' : values[i].comments}
                        className='content-input-surgical'
                    />
                </>
            );

            panels.push({
                key: i,
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                    icon: (
                        <Icon
                            name='dropdown'
                            corner='top left'
                            className='medications-desktop-accordion-dropdown-icon'
                        />
                    ),
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

    render() {
        const values = this.props.surgicalHistory;
        const nums = Object.keys(values);

        const content = this.props.mobile ? (
            <Accordion
                panels={this.makeAccordionPanels(nums, values)}
                exclusive={false}
                fluid
                styled
            />
        ) : (
            <Table celled className='table-display'>
                <Table.Header content={this.makeHeader()} />
                {/* eslint-disable-next-line react/no-children-prop */}
                <Table.Body children={this.makeTableBodyRows(nums, values)} />
            </Table>
        );

        return (
            <>
                {content}
                {!this.props.isPreview && (
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
    proceduresOptions: OptionMapping;
    active: Set<string>;
    isInvalidYear: Set<unknown>;
    currentYear: number;
};

interface SurgicalHistoryProps {
    surgicalHistory: SurgicalHistoryState;
}

interface ContentProps {
    isPreview: boolean;
    mobile: boolean;
}

interface DispatchProps {
    updateProcedure: (index: string, newProcedure: string) => void;
    updateYear: (index: string, newYear: number) => void;
    updateComments: (index: string, newComment: string) => void;
    addProcedure: () => void;
    deleteProcedure: (index: string) => void;
}

type Props = ContentProps & DispatchProps & SurgicalHistoryProps;

const mapStateToProps = (state: CurrentNoteState): SurgicalHistoryProps => {
    return {
        surgicalHistory: selectSurgicalHistoryState(state),
    };
};

const mapDispatchToProps = {
    updateProcedure,
    updateYear,
    updateComments,
    addProcedure,
    deleteProcedure,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurgicalHistoryContent);

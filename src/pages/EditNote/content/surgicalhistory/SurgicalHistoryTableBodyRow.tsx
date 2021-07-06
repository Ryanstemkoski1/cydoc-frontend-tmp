import React, { Component, ComponentType } from 'react';
import {
    TextArea,
    Table,
    Input,
    TextAreaProps,
    DropdownProps,
    InputOnChangeData,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    updateProcedure,
    updateYear,
    updateComments,
    addProcedure,
    deleteProcedure,
} from 'redux/actions/surgicalHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    SurgicalHistoryState,
    SurgicalHistoryItem,
} from 'redux/reducers/surgicalHistoryReducer';
import Dropdown from 'components/tools/OptimizedDropdown';
import { AllergiesState } from 'redux/reducers/allergiesReducer';
import './SurgicalHistoryTableBodyRow.css';
import {
    selectSurgicalHistoryState,
    selectSurgicalHistoryItem,
} from 'redux/selectors/surgicalHistorySelectors';
import { OptionMapping } from '_processOptions';
import { RouteProps, withRouter } from 'react-router';

//Controlled component for a row in a TableContent component
export class SurgicalHistoryTableBodyRow extends Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            invalidYear: false,
        };
        this.onYearChange = this.onYearChange.bind(this);
    }

    onYearChange = (e: React.FocusEvent, data: DropdownProps) => {
        const target = e.target as HTMLTextAreaElement;
        const startYear = parseInt(target.value);
        this.setState({
            invalidYear:
                target.value !== '' &&
                (isNaN(startYear) ||
                    startYear < 1900 ||
                    startYear > this.props.currentYear),
        });
    };

    handleYearChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        this.props.onTableBodyChange(event, data);
        this.props.updateYear(data.rowIndex, parseInt(data.value as string));
    };

    handleCellClick = (e: React.MouseEvent) => {
        const innerInput = (e.target as HTMLTextAreaElement)
            .lastElementChild as any;
        // Handles clicks outside of the "clickable area" (padding) of the input/textarea component within a cell
        if (innerInput !== null) {
            if (innerInput.type === 'textarea') {
                innerInput.focus();
            } else {
                // for Inputs/dropdowns
                innerInput.click();
            }
        }
    };

    handleProcedureChange = (
        event: React.SyntheticEvent,
        data: DropdownProps
    ) => {
        this.props.onTableBodyChange(event, data);
        this.props.updateProcedure(data.rowIndex, data.value as string);
    };

    handleCommentsChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        this.props.onTableBodyChange(event, data);
        this.props.updateComments(data.rowIndex, data.value as string);
    };

    getCell(field: string) {
        const {
            rowIndex,
            onAddItem,
            proceduresOptions,
            isPreview,
        } = this.props;
        const { procedure, year, comments } = this.props.surgicalHistoryItem!;

        if (isPreview) {
            return (
                <div className='content-preview'>
                    {field === 'Procedure' ? rowIndex : ''}
                </div>
            );
        }
        let cell;

        switch (field) {
            case 'procedure': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            clearable
                            allowAdditions
                            options={proceduresOptions}
                            optiontype='proceduresOptions'
                            type={field}
                            onChange={this.handleProcedureChange}
                            rowIndex={rowIndex}
                            value={procedure}
                            onAddItem={onAddItem}
                            aria-label='Surgical-Dropdown'
                            className='table-row-text'
                        />
                    </Input>
                );
                break;
            }
            case 'year': {
                const yearString: string =
                    year === -1 || isNaN(year) ? '' : year.toString();
                cell = (
                    <div className='table-year-input'>
                        <TextArea
                            rows={3}
                            type={field}
                            onChange={this.handleYearChange}
                            onBlur={this.onYearChange}
                            rowIndex={rowIndex}
                            value={yearString}
                            className='table-row-text'
                        />
                        {this.state.invalidYear && (
                            <p className='year-validation-error'>
                                Please enter a valid year between 1900 and 2020
                            </p>
                        )}
                    </div>
                );
                break;
            }
            // Comments
            default: {
                cell = (
                    <TextArea
                        rows={3}
                        type={field}
                        onChange={this.handleCommentsChange}
                        rowIndex={rowIndex}
                        value={comments}
                        className='table-row-text'
                    />
                );
                break;
            }
        }

        return cell;
    }

    render() {
        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        const { fields } = this.props;

        const tableRows = fields.map((field: string, index: number) => {
            return (
                <Table.Cell
                    key={index}
                    onClick={this.handleCellClick}
                    style={{ padding: '0px' }}
                >
                    {this.getCell(field)}
                </Table.Cell>
            );
        });

        return <Table.Row>{tableRows}</Table.Row>;
    }
}

interface OwnState {
    invalidYear: boolean;
}

interface DispatchProps {
    updateProcedure: (index: string, newProcedure: string) => void;
    updateYear: (index: string, newYear: number) => void;
    updateComments: (index: string, newComment: string) => void;
    addProcedure: () => void;
    deleteProcedure: (index: string) => void;
}

interface RowProps {
    isPreview: boolean;
    mobile: boolean;
    currentYear: number;
    rowIndex: keyof AllergiesState;
    proceduresOptions: OptionMapping;
    fields: string[];
    onTableBodyChange: (
        event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
            | React.SyntheticEvent,
        data: TextAreaProps | DropdownProps | InputOnChangeData
    ) => void;
    onAddItem: (
        event: React.KeyboardEvent<HTMLElement>,
        data: DropdownProps
    ) => void;
}

interface SurgicalHistoryProps {
    surgicalHistory: SurgicalHistoryState;
    surgicalHistoryItem?: SurgicalHistoryItem;
}

type Props = RowProps & SurgicalHistoryProps & DispatchProps;

const mapStateToProps = (
    state: CurrentNoteState,
    rowProps: RowProps
): SurgicalHistoryProps => {
    return {
        surgicalHistory: selectSurgicalHistoryState(state),
        surgicalHistoryItem: selectSurgicalHistoryItem(
            state,
            rowProps.rowIndex
        ),
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
)(SurgicalHistoryTableBodyRow);

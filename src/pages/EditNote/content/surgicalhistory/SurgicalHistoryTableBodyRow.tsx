/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { Component } from 'react';
import {
    TextArea,
    Table,
    Input,
    TextAreaProps,
    DropdownProps,
    InputOnChangeData,
    Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    updateProcedure,
    toggleOption,
    updateYear,
    updateComments,
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
import ToggleButton from 'components/tools/ToggleButton';
import { YesNoResponse } from 'constants/enums';

//Controlled component for a row in a TableContent component
export class SurgicalHistoryTableBodyRow extends Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            invalidYear: false,
        };
        this.onYearChange = this.onYearChange.bind(this);
    }

    onYearChange = (e: React.FocusEvent) => {
        const target = e.target as HTMLTextAreaElement;
        const startYear = parseInt(target.value);
        this.setState({
            invalidYear:
                target.value !== '' &&
                (isNaN(startYear) ||
                    startYear < 1900 ||
                    startYear > new Date(Date.now()).getFullYear()),
        });
    };

    handleYearChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        this.props.onTableBodyChange(event, data);
        this.props.updateYear(data.rowIndex, parseInt(data.value as string));
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
        const { procedure, hasHadSurgery, year, comments } =
            this.props.surgicalHistoryItem! || {};

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
                cell = this.props.pop ? (
                    <> {procedure} </>
                ) : (
                    <Input
                        fluid
                        transparent
                        className='content-input-computer content-dropdown'
                    >
                        <div id='procedure-div'>
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
                        </div>
                    </Input>
                );
                break;
            }
            case 'hasHadSurgery': {
                cell = (
                    <>
                        <ToggleButton
                            active={
                                isPreview
                                    ? false
                                    : hasHadSurgery == YesNoResponse.Yes
                            }
                            condition={procedure}
                            title='Yes'
                            onToggleButtonClick={
                                isPreview
                                    ? () => {
                                          return undefined;
                                      }
                                    : () =>
                                          this.props.toggleOption(
                                              rowIndex.toString(),
                                              YesNoResponse.Yes
                                          )
                            }
                        />
                        <ToggleButton
                            active={
                                isPreview
                                    ? false
                                    : hasHadSurgery == YesNoResponse.No
                            }
                            condition={procedure}
                            title='No'
                            onToggleButtonClick={
                                isPreview
                                    ? () => {
                                          return undefined;
                                      }
                                    : () =>
                                          this.props.toggleOption(
                                              rowIndex.toString(),
                                              YesNoResponse.No
                                          )
                            }
                        />
                    </>
                );
                break;
            }
            case 'year': {
                const yearString: string =
                    year === -1 || isNaN(year) ? '' : year.toString();
                cell = (
                    <div className='table-year-input'>
                        <div className='ui form'>
                            <TextArea
                                rows={3}
                                type={field}
                                onChange={this.handleYearChange}
                                onBlur={this.onYearChange}
                                rowIndex={rowIndex}
                                defaultValue={yearString}
                                className='table-row-text'
                                placeHolder='e.g. 2020'
                                id='row'
                            />
                            {this.state.invalidYear && (
                                <p className='year-validation-error'>
                                    Please enter a year between 1900 and{' '}
                                    {new Date(Date.now()).getFullYear()}
                                </p>
                            )}
                        </div>
                    </div>
                );
                break;
            }
            // Comments
            default: {
                cell = (
                    <div className='ui form'>
                        <TextArea
                            rows={3}
                            type={field}
                            onChange={this.handleCommentsChange}
                            rowIndex={rowIndex}
                            value={comments}
                            className='table-row-text'
                            placeHolder='Comments'
                            id='row'
                        />
                    </div>
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
            const textAlign = field == 'hasHadSurgery' ? 'center' : 'left';
            return (
                <Table.Cell key={index} id='table-rows' textAlign={textAlign}>
                    {this.getCell(field)}
                </Table.Cell>
            );
        });

        return (
            <Table.Row>
                {tableRows}
                <td>
                    <Button
                        circular
                        icon='close'
                        onClick={() => {
                            this.props.deleteRow(this.props.rowIndex as string);
                        }}
                        aria-label='delete-surgery'
                        className='hpi-ph-button delete-surgery'
                    />
                </td>
            </Table.Row>
        );
    }
}

interface OwnState {
    invalidYear: boolean;
}

interface SurgicalHistoryProps {
    surgicalHistory: SurgicalHistoryState;
    surgicalHistoryItem: SurgicalHistoryItem;
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
    deleteRow: (index: string) => void;
    pop: boolean;
}

interface DispatchProps {
    updateProcedure: (index: string, newProcedure: string) => void;
    toggleOption: (index: string, optionSelected: YesNoResponse) => void;
    updateYear: (index: string, newYear: number) => void;
    updateComments: (index: string, newComment: string) => void;
    deleteProcedure: (index: string) => void;
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
    toggleOption,
    updateYear,
    updateComments,
    deleteProcedure,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurgicalHistoryTableBodyRow);

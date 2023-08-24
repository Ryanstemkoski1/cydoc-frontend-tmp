/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { OptionMapping } from '_processOptions';
import Dropdown from 'components/tools/OptimizedDropdown';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteProcedure,
    toggleOption,
    updateComments,
    updateProcedure,
    updateYear,
} from 'redux/actions/surgicalHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    SurgicalHistoryElements,
    SurgicalHistoryItem,
} from 'redux/reducers/surgicalHistoryReducer';
import { selectSurgicalHistoryItem } from 'redux/selectors/surgicalHistorySelectors';
import {
    DropdownProps,
    Input,
    InputOnChangeData,
    Table,
    TextArea,
    TextAreaProps,
} from 'semantic-ui-react';
import './SurgicalHistoryTableBodyRow.css';

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
        event: React.SyntheticEvent | null,
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
        const { rowIndex, onAddItem, proceduresOptions, isPreview } =
            this.props;
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
                        <YesAndNo
                            yesButtonActive={
                                isPreview
                                    ? false
                                    : hasHadSurgery == YesNoResponse.Yes
                            }
                            yesButtonCondition={procedure}
                            handleYesButtonClick={
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
                            noButtonActive={
                                isPreview
                                    ? false
                                    : hasHadSurgery == YesNoResponse.No
                            }
                            noButtonCondition={procedure}
                            handleNoButtonClick={
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
        const { fields, hide } = this.props;

        const tableRows = hide
            ? fields.map((field: string, index: number) => {
                  const textAlign =
                      field == 'hasHadSurgery' ? 'center' : 'left';
                  if (field !== 'procedure') {
                      return null;
                  }
                  return (
                      <Table.Cell
                          key={index}
                          id='table-rows'
                          textAlign={textAlign}
                      >
                          {this.getCell(field)}
                      </Table.Cell>
                  );
              })
            : fields.map((field: string, index: number) => {
                  const textAlign =
                      field == 'hasHadSurgery' ? 'center' : 'left';
                  return (
                      <Table.Cell
                          key={index}
                          id='table-rows'
                          textAlign={textAlign}
                      >
                          {this.getCell(field)}
                      </Table.Cell>
                  );
              });

        return (
            <Table.Row>
                {tableRows}
                <td>
                    <RemoveButton
                        onClick={() => {
                            this.props.deleteRow(this.props.rowIndex as string);
                        }}
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
    surgicalHistoryItem: SurgicalHistoryItem;
}

interface RowProps {
    isPreview: boolean;
    currentYear: number;
    rowIndex: keyof SurgicalHistoryElements;
    proceduresOptions: OptionMapping;
    fields: string[];
    hide?: boolean;
    onTableBodyChange: (
        event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
            | React.SyntheticEvent
            | null,
        data: TextAreaProps | DropdownProps | InputOnChangeData
    ) => void;
    onAddItem: (
        event:
            | React.KeyboardEvent<HTMLElement>
            | React.SyntheticEvent<Element, Event>
            | null,
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

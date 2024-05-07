/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { OptionMapping } from '_processOptions';
import Dropdown from 'components/Input/Dropdown';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    deleteProcedure,
    toggleOption,
    updateComments,
    updateProcedure,
    updateYear,
} from '@redux/actions/surgicalHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    SurgicalHistoryElements,
    SurgicalHistoryItem,
} from '@redux/reducers/surgicalHistoryReducer';
import { selectSurgicalHistoryItem } from '@redux/selectors/surgicalHistorySelectors';
import {
    DropdownProps,
    InputOnChangeData,
    TextArea,
    TextAreaProps,
} from 'semantic-ui-react';
import './SurgicalHistoryTableBodyRow.css';

const SurgicalHistoryTableBodyRowNew = (props: Props) => {
    const [invalidYear, setInvalidYear] = useState(false);

    const onYearChange = (e: React.FocusEvent) => {
        const target = e.target as HTMLTextAreaElement;
        const startYear = parseInt(target.value);
        setInvalidYear(
            target.value !== '' &&
                (isNaN(startYear) ||
                    startYear < 1900 ||
                    startYear > new Date(Date.now()).getFullYear())
        );
    };

    const handleYearChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        props.onTableBodyChange(event, data);
        props.updateYear(data.rowIndex, parseInt(data.value as string));
    };

    const handleProcedureChange = (
        event: React.SyntheticEvent | null,
        data: DropdownProps
    ) => {
        // props.onTableBodyChange(event, data);
        props.updateProcedure(data.rowIndex, data.value as string);
    };

    const handleCommentsChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        props.onTableBodyChange(event, data);
        props.updateComments(data.rowIndex, data.value as string);
    };

    const getCell = (field: string) => {
        const { rowIndex, proceduresOptions, isPreview } = props;
        const { procedure, hasHadSurgery, year, comments } =
            props.surgicalHistoryItem! || {};

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
                cell = props.pop ? (
                    <> {procedure} </>
                ) : (
                    <Dropdown
                        items={Object.values(proceduresOptions).map(
                            (item) => item.value
                        )}
                        canEnterNewValue={true}
                        onChange={(value) =>
                            handleProcedureChange(null, {
                                rowIndex: rowIndex,
                                value: value,
                            })
                        }
                        value={procedure}
                        key={procedure}
                    />
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
                                          props.toggleOption(
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
                                          props.toggleOption(
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
                                onChange={handleYearChange}
                                onBlur={onYearChange}
                                rowIndex={rowIndex}
                                defaultValue={yearString}
                                className='table-row-text'
                                placeHolder='e.g. 2020'
                                id='row'
                            />
                            {invalidYear && (
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
                            onChange={handleCommentsChange}
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
    };

    //returns a Table.Row with a cell for each item in tableBodyPlaceholders
    const { fields, hide } = props;

    const tableRows = hide
        ? fields.map((field: string, index: number) => {
              //   const textAlign = field == 'hasHadSurgery' ? 'center' : 'left';
              if (field !== 'procedure') {
                  return null;
              }
              return <td key={index}>{getCell(field)}</td>;
          })
        : fields.map((field: string, index: number) => {
              //   const textAlign = field == 'hasHadSurgery' ? 'center' : 'left';
              return <td key={index}>{getCell(field)}</td>;
          });

    return (
        <tr>
            {tableRows}
            <td>
                <RemoveButton
                    onClick={() => {
                        props.deleteRow(props.rowIndex as string);
                    }}
                />
            </td>
        </tr>
    );
};

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
)(SurgicalHistoryTableBodyRowNew);

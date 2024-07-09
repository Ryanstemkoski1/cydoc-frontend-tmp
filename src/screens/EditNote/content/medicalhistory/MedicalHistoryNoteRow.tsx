/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Input from '@components/Input/Input';
import RemoveButton from '@components/tools/RemoveButton/RemoveButton';
import ToolTip from '@components/tools/ToolTip/Tooltip';
import YesAndNo from '@components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from '@constants/enums';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    toggleOption,
    updateComments,
    updateConditionResolved,
    updateEndYear,
    updateStartYear,
} from '@redux/actions/medicalHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    selectMedicalHistoryItem,
    selectMedicalHistoryState,
} from '@redux/selectors/medicalHistorySelector';
import { ButtonProps, Form, TextAreaProps } from 'semantic-ui-react';
import '../familyhistory/FamilyHistory.css';
import '../hpi/knowledgegraph/css/Button.css';
import style from './MedicalHistoryNoteRow.module.scss';

//Component for a row the Medical History GridContent
class MedicalHistoryNoteRow extends Component<Props> {
    handleOnsetChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateStartYear(this.props.index, parseInt(value));
    };

    handleEndYearChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateEndYear(this.props.index, parseInt(value));
    };

    handleConditionToggleButtonClick = (
        event: React.MouseEvent,
        data: ButtonProps
    ) => {
        this.props.toggleOption(this.props.index, data.title.toUpperCase());
    };

    handleResolvedToggleButtonClick = (
        event: React.MouseEvent,
        data: ButtonProps
    ) => {
        this.props.updateConditionResolved(
            this.props.index,
            data.title.toUpperCase()
        );
    };

    handleCommentsChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateComments(this.props.index, value);
    };

    render = () => {
        const {
            conditionInput,
            isPreview,
            index,
            hide,
            dontShowOptions = false,
        } = this.props;
        const currentYear = new Date(Date.now()).getFullYear();

        const {
            condition,
            hasBeenAfflicted,
            startYear,
            hasConditionResolved,
            endYear,
            comments,
        } = this.props.medicalHistoryItem;

        const onsetYearString: string =
            startYear === -1 || isNaN(startYear) ? '' : startYear.toString();
        const endYearString: string =
            endYear === -1 || isNaN(endYear) ? '' : endYear.toString();

        if (hide) {
            return (
                <tr>
                    <td>
                        <div
                            className={`${style.medicalHistory__condition} flex justify-between`}
                        >
                            <p>{conditionInput}</p>

                            <RemoveButton
                                onClick={() =>
                                    this.props.deleteRow(this.props.index)
                                }
                            />
                        </div>
                    </td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{conditionInput}</td>
                <td>
                    <div className='flex-wrap align-center justify-between'>
                        <strong>Condition</strong>
                        <YesAndNo
                            yesButtonActive={
                                isPreview
                                    ? false
                                    : hasBeenAfflicted === YesNoResponse.Yes
                            }
                            yesButtonCondition={condition}
                            handleYesButtonClick={
                                isPreview
                                    ? () => {
                                          return undefined;
                                      }
                                    : this.handleConditionToggleButtonClick
                            }
                            noButtonActive={
                                isPreview
                                    ? false
                                    : hasBeenAfflicted === YesNoResponse.No
                            }
                            noButtonCondition={condition}
                            handleNoButtonClick={
                                isPreview
                                    ? () => {
                                          return undefined;
                                      }
                                    : this.handleConditionToggleButtonClick
                            }
                        />
                    </div>
                </td>
                {!dontShowOptions && (
                    <>
                        <td>
                            <strong>Start Year</strong>
                            <ToolTip
                                messageContent={`Please enter a year between 1900 and ${currentYear}`}
                                messageShow={
                                    (isNaN(startYear) &&
                                        onsetYearString !== '') ||
                                    (startYear < 1900 && startYear !== -1) ||
                                    startYear > currentYear
                                }
                            >
                                <form>
                                    <Input
                                        condition={condition}
                                        index={index}
                                        placeholder='Onset'
                                        value={
                                            isPreview ? '2000' : onsetYearString
                                        }
                                        onChange={(e: any) =>
                                            this.handleOnsetChange(e, {
                                                condition: condition,
                                            })
                                        }
                                        disabled={isPreview}
                                        rows={1}
                                    />
                                </form>
                            </ToolTip>
                        </td>
                        <td>
                            <div className='flex-wrap align-center justify-between'>
                                <strong>Has Condition Resolved? </strong>
                                <YesAndNo
                                    yesButtonActive={
                                        isPreview
                                            ? false
                                            : hasConditionResolved ===
                                              YesNoResponse.Yes
                                    }
                                    yesButtonCondition={condition}
                                    yesButtonClasses='fam-hist-buttons'
                                    handleYesButtonClick={
                                        isPreview
                                            ? () => {
                                                  return undefined;
                                              }
                                            : this
                                                  .handleResolvedToggleButtonClick
                                    }
                                    noButtonActive={
                                        isPreview
                                            ? false
                                            : hasConditionResolved ===
                                              YesNoResponse.No
                                    }
                                    noButtonCondition={condition}
                                    handleNoButtonClick={
                                        isPreview
                                            ? () => {
                                                  return undefined;
                                              }
                                            : this
                                                  .handleResolvedToggleButtonClick
                                    }
                                />
                            </div>
                        </td>
                        <td>
                            <strong>End Year</strong>
                            <ToolTip
                                messageContent={`Please enter a year between 
                        ${startYear} and ${currentYear}`}
                                messageShow={
                                    hasConditionResolved ===
                                        YesNoResponse.Yes &&
                                    ((isNaN(endYear) && endYearString !== '') ||
                                        (endYear < startYear &&
                                            endYear !== -1) ||
                                        endYear > currentYear)
                                }
                            >
                                <form>
                                    <Input
                                        condition={condition}
                                        index={index}
                                        placeholder='End Year'
                                        value={
                                            isPreview ? '2001' : endYearString
                                        }
                                        onChange={(e: any) =>
                                            this.handleEndYearChange(e, {
                                                condition: condition,
                                            })
                                        }
                                        disabled={
                                            isPreview ||
                                            hasConditionResolved !==
                                                YesNoResponse.Yes
                                        }
                                        rows={1}
                                    />
                                </form>
                            </ToolTip>
                        </td>
                        <td>
                            <strong>Comments</strong>
                            <Form>
                                <Form.TextArea
                                    rows={2}
                                    condition={condition}
                                    index={index}
                                    value={isPreview ? '' : comments}
                                    onChange={(e: any, _data: any) =>
                                        this.handleCommentsChange(e, {
                                            condition: condition,
                                        })
                                    }
                                    placeholder='Comments'
                                    disabled={isPreview}
                                />
                            </Form>
                        </td>
                        <td>
                            <RemoveButton
                                onClick={() =>
                                    this.props.deleteRow(this.props.index)
                                }
                            />
                        </td>
                    </>
                )}
            </tr>
        );
    };
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

type OwnProps = {
    index: string;
    deleteRow: (index: string) => void;
};

const mapDispatchToProps = {
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
};

const mapStateToProps = (state: CurrentNoteState, ownProps: OwnProps) => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
        medicalHistoryItem: selectMedicalHistoryItem(state, ownProps.index),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(MedicalHistoryNoteRow);

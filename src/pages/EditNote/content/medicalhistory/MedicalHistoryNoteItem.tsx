import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    toggleOption,
    updateComments,
    updateConditionResolved,
    updateEndYear,
    updateStartYear,
} from '@redux/actions/medicalHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    MedicalHistoryItem,
    MedicalHistoryState,
} from '@redux/reducers/medicalHistoryReducer';
import {
    selectMedicalHistoryItem,
    selectMedicalHistoryState,
} from '@redux/selectors/medicalHistorySelector';
import {
    Button,
    ButtonProps,
    Form,
    Grid,
    TextAreaProps,
} from 'semantic-ui-react';
import '../familyhistory/FamilyHistory.css';
import Image from 'next/image';

//Component for a row the Medical History GridContent
class MedicalHistoryNoteItem extends Component<Props> {
    findIndex = (event: FindIndex, data: TextAreaProps) => {
        let index = '';
        Object.keys(this.props.medicalHistory).map((idx: string) => {
            if (
                this.props.medicalHistory[idx]['condition'] === data.condition
            ) {
                index = idx;
            }
        });
        return index;
    };

    handleOnsetChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const index = this.findIndex(event, data);
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateStartYear(index, parseInt(value));
    };

    handleEndYearChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const index = this.findIndex(event, data);
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateEndYear(index, parseInt(value));
    };

    handleConditionToggleButtonClick = (
        event: React.MouseEvent,
        data: ButtonProps
    ) => {
        const index = this.findIndex(event, data);
        this.props.toggleOption(index, data.title.toUpperCase());
    };

    handleResolvedToggleButtonClick = (
        event: React.MouseEvent,
        data: ButtonProps
    ) => {
        const index = this.findIndex(event, data);
        this.props.updateConditionResolved(index, data.title.toUpperCase());
    };

    handleCommentsChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => {
        const index = this.findIndex(event, data);
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateComments(index, value);
    };

    render = () => {
        const { currentYear, isPreview, index, conditionInput } = this.props;

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

        if (this.props.hide) {
            return (
                <Grid.Row>
                    <Form
                        className='family-hx-note-item'
                        style={{ width: 'calc(100% - 50px)' }}
                    >
                        <Form.Group inline className='condition-header'>
                            <div className='condition-name'>
                                {conditionInput}
                            </div>
                        </Form.Group>
                    </Form>
                    <Button
                        circular
                        icon='close'
                        onClick={() => this.props.deleteRow(this.props.index)}
                        aria-label='delete-conditon'
                        className='hpi-ph-button'
                        style={{
                            width: '40px',
                            height: '40px',
                        }}
                    />
                </Grid.Row>
            );
        }

        return (
            <Grid.Row className='mobile-block-row'>
                <Form className='family-hx-note-item family-medical'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>{conditionInput}</div>
                        <YesAndNo
                            containerClasses={`${
                                hasBeenAfflicted === YesNoResponse.Yes
                                    ? 'active'
                                    : ''
                            }`}
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
                    </Form.Group>
                    {hasBeenAfflicted === YesNoResponse.Yes && (
                        <div
                            className='condition-info'
                            style={{ marginLeft: '0px' }}
                        >
                            <div className='confirmation-item option-block-item flex align-center'>
                                <span className='field'>
                                    <label>Has Condition Resolved?</label>
                                </span>

                                <YesAndNo
                                    containerClasses={`${
                                        hasConditionResolved ===
                                        YesNoResponse.Yes
                                            ? 'active'
                                            : ''
                                    }`}
                                    yesButtonActive={
                                        isPreview
                                            ? false
                                            : hasConditionResolved ===
                                              YesNoResponse.Yes
                                    }
                                    yesButtonCondition={condition}
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
                            <div className='ui grid year-block'>
                                <div className='eight wide column'>
                                    <Form.TextArea
                                        label='Start Year'
                                        index={index}
                                        condition={condition}
                                        placeholder='Start Year'
                                        value={
                                            isPreview ? '2000' : onsetYearString
                                        }
                                        onChange={this.handleOnsetChange}
                                        rows={1}
                                        style={{ width: '100%' }}
                                    />
                                    {((isNaN(startYear) &&
                                        onsetYearString !== '') ||
                                        (startYear < 1900 &&
                                            startYear !== -1) ||
                                        startYear > currentYear) && (
                                        <p className='year-validation-mobile-error'>
                                            Please enter a valid year after 1900
                                        </p>
                                    )}
                                </div>
                                <div className='eight wide column'>
                                    <Form.TextArea
                                        label='End Year'
                                        index={index}
                                        condition={condition}
                                        placeholder='End Year'
                                        value={
                                            isPreview ? '2001' : endYearString
                                        }
                                        onChange={this.handleEndYearChange}
                                        disabled={
                                            isPreview ||
                                            hasConditionResolved !==
                                                YesNoResponse.Yes
                                        }
                                        rows={1}
                                        style={{
                                            width: '100%',
                                            marginBottom: '5px',
                                        }}
                                    />
                                </div>
                            </div>
                            {hasConditionResolved === YesNoResponse.Yes && (
                                <>
                                    {((isNaN(endYear) &&
                                        endYearString !== '') ||
                                        (endYear < 1900 && endYear !== -1) ||
                                        endYear > currentYear ||
                                        endYear < startYear) && (
                                        <p className='year-validation-mobile-error'>
                                            Please enter a valid year after 1900
                                            and the onset
                                        </p>
                                    )}
                                </>
                            )}

                            <Form.TextArea
                                label='Comments'
                                index={index}
                                condition={condition}
                                placeholder='Comments'
                                value={isPreview ? '' : comments}
                                onChange={this.handleCommentsChange}
                                rows={2}
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                </Form>

                <div className='action-btn'>
                    <Button
                        circular
                        icon='close'
                        onClick={() => this.props.deleteRow(this.props.index)}
                        aria-label='delete-conditon'
                        className='hpi-ph-button'
                    />

                    <aside
                        onClick={() => {
                            this.props.deleteRow(this.props.index);
                        }}
                    >
                        <Image
                            alt='Delete'
                            src={'/images/delete.svg'}
                            width={50}
                        />
                        <span>Remove</span>
                    </aside>
                </div>
            </Grid.Row>
        );
    };
}

interface DispatchProps {
    toggleOption: (index: string, optionSelected: YesNoResponse) => void;
    updateStartYear: (index: string, newStartYear: number) => void;
    updateEndYear: (index: string, newEndYear: number) => void;
    updateComments: (index: string, newComments: string) => void;
    updateConditionResolved: (
        index: string,
        optionSelected: YesNoResponse
    ) => void;
}

interface MedicalHistoryProps {
    medicalHistory: MedicalHistoryState;
    medicalHistoryItem: MedicalHistoryItem;
}

interface ItemProps {
    conditionInput: JSX.Element;
    currentYear: number;
    isPreview?: boolean;
    deleteRow: (index: string) => void;
    hide?: boolean;
}

type OwnProps = {
    index: string;
};

type FindIndex = React.MouseEvent | React.FormEvent<HTMLTextAreaElement>;

type Props = MedicalHistoryProps & ItemProps & OwnProps & DispatchProps;

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: OwnProps
): MedicalHistoryProps => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
        medicalHistoryItem: selectMedicalHistoryItem(state, ownProps.index),
    };
};

const mapDispatchToProps = {
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MedicalHistoryNoteItem);

import {
    Form,
    Grid,
    TextAreaProps,
    StrictInputProps,
    ButtonProps,
    Button,
} from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import React, { Component } from 'react';
import '../familyhistory/FamilyHistory.css';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    MedicalHistoryState,
    MedicalHistoryItem,
} from 'redux/reducers/medicalHistoryReducer';
import { YesNoResponse } from 'constants/enums';
import {
    selectMedicalHistoryState,
    selectMedicalHistoryItem,
} from 'redux/selectors/medicalHistorySelector';
import {
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
} from 'redux/actions/medicalHistoryActions';

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

        return (
            <Grid.Row>
                <Form className='family-hx-note-item family-medical'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>{conditionInput}</div>
                        <ToggleButton
                            active={
                                isPreview
                                    ? false
                                    : hasBeenAfflicted === YesNoResponse.Yes
                            }
                            condition={condition}
                            title='Yes'
                            onToggleButtonClick={
                                isPreview
                                    ? () => {
                                          return undefined;
                                      }
                                    : this.handleConditionToggleButtonClick
                            }
                        />
                        <ToggleButton
                            active={
                                isPreview
                                    ? false
                                    : hasBeenAfflicted === YesNoResponse.No
                            }
                            condition={condition}
                            title='No'
                            onToggleButtonClick={
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
                            <Form.TextArea
                                label='Onset'
                                index={index}
                                condition={condition}
                                placeholder='Onset'
                                value={isPreview ? '2000' : onsetYearString}
                                onChange={this.handleOnsetChange}
                                rows={1}
                                style={{ width: '100%' }}
                            />
                            {((isNaN(startYear) && onsetYearString !== '') ||
                                (startYear < 1900 && startYear !== -1) ||
                                startYear > currentYear) && (
                                <p className='year-validation-mobile-error'>
                                    Please enter a valid year after 1900
                                </p>
                            )}
                            <span className='field'>
                                <label>Has Condition Resolved?</label>
                            </span>
                            <div>
                                <ToggleButton
                                    active={
                                        isPreview
                                            ? false
                                            : hasConditionResolved ===
                                              YesNoResponse.Yes
                                    }
                                    condition={condition}
                                    title='Yes'
                                    onToggleButtonClick={
                                        isPreview
                                            ? () => {
                                                  return undefined;
                                              }
                                            : this
                                                  .handleResolvedToggleButtonClick
                                    }
                                />
                                <ToggleButton
                                    active={
                                        isPreview
                                            ? false
                                            : hasConditionResolved ===
                                              YesNoResponse.No
                                    }
                                    condition={condition}
                                    title='No'
                                    onToggleButtonClick={
                                        isPreview
                                            ? () => () => {
                                                  return undefined;
                                              }
                                            : this
                                                  .handleResolvedToggleButtonClick
                                    }
                                />
                            </div>
                            {hasConditionResolved === YesNoResponse.Yes && (
                                <>
                                    <Form.TextArea
                                        label='End Year'
                                        index={index}
                                        condition={condition}
                                        placeholder='End Year'
                                        value={
                                            isPreview ? '2001' : endYearString
                                        }
                                        onChange={this.handleEndYearChange}
                                        rows={1}
                                        style={{
                                            width: '100%',
                                            marginBottom: '5px',
                                        }}
                                    />
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
                <Button
                    circular
                    icon='close'
                    onClick={() => this.props.deleteRow(this.props.index)}
                    aria-label='delete-conditon'
                    className='hpi-ph-button'
                />
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

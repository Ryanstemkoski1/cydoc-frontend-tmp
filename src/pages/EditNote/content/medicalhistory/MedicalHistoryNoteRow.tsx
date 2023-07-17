/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    Form,
    Grid,
    TextAreaProps,
    ButtonProps,
    Button,
} from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton';
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
import '../hpi/knowledgegraph/src/css/Button.css';
import './MedicalHistoryNoteRow.css';

//Component for a row the Medical History GridContent
class MedicalHistoryNoteRow extends Component<Props> {
    findIndex = (_event: FindIndex, data: TextAreaProps) => {
        let index = '';
        Object.keys(this.props.medicalHistory).forEach((idx: string) => {
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
        const { conditionInput, isPreview, index, hide } = this.props;
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
                <div className='flex margin-top-20'>
                    <div className='input-field width-100-input'>
                        {conditionInput}
                    </div>
                    <Button
                        circular
                        icon='close'
                        onClick={() => this.props.deleteRow(this.props.index)}
                        aria-label='delete-condition'
                        className='hpi-ph-button'
                    />
                </div>
            );
        }
        return (
            <Grid.Row columns={7}>
                <Grid.Column>{conditionInput}</Grid.Column>
                <Grid.Column textAlign='center' className='toggle-button-row'>
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
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <Form.TextArea
                            condition={condition}
                            index={index}
                            placeholder='Onset'
                            value={isPreview ? '2000' : onsetYearString}
                            onChange={this.handleOnsetChange}
                            disabled={isPreview}
                            rows={1}
                        />
                    </Form>
                    {((isNaN(startYear) && onsetYearString !== '') ||
                        (startYear < 1900 && startYear !== -1) ||
                        startYear > currentYear) && (
                        <p className='year-validation-mobile-error'>
                            Please enter a year between 1900 and {currentYear}
                        </p>
                    )}
                </Grid.Column>
                <Grid.Column textAlign='center' className='toggle-button-row'>
                    <ToggleButton
                        active={
                            isPreview
                                ? false
                                : hasConditionResolved === YesNoResponse.Yes
                        }
                        condition={condition}
                        title='Yes'
                        onToggleButtonClick={
                            isPreview
                                ? () => {
                                      return undefined;
                                  }
                                : this.handleResolvedToggleButtonClick
                        }
                    />
                    <ToggleButton
                        active={
                            isPreview
                                ? false
                                : hasConditionResolved === YesNoResponse.No
                        }
                        condition={condition}
                        title='No'
                        onToggleButtonClick={
                            isPreview
                                ? () => {
                                      return undefined;
                                  }
                                : this.handleResolvedToggleButtonClick
                        }
                    />
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <Form.TextArea
                            condition={condition}
                            index={index}
                            placeholder='End Year'
                            value={isPreview ? '2001' : endYearString}
                            onChange={this.handleEndYearChange}
                            disabled={
                                isPreview ||
                                hasConditionResolved !== YesNoResponse.Yes
                            }
                            rows={1}
                        />
                    </Form>
                    {hasConditionResolved === YesNoResponse.Yes &&
                        ((isNaN(endYear) && endYearString !== '') ||
                            (endYear < startYear && endYear !== -1) ||
                            endYear > currentYear) && (
                            <p className='year-validation-mobile-error'>
                                Please enter a year between {startYear} and{' '}
                                {currentYear}
                            </p>
                        )}
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <Form.TextArea
                            rows={2}
                            condition={condition}
                            index={index}
                            value={isPreview ? '' : comments}
                            onChange={this.handleCommentsChange}
                            placeholder='Comments'
                            disabled={isPreview}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column className='delete-row' textAlign='center'>
                    <Button
                        circular
                        icon='close'
                        onClick={() => this.props.deleteRow(this.props.index)}
                        aria-label='delete-condition'
                        className='hpi-ph-button'
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };
}

interface RowProps {
    conditionInput: JSX.Element;
    isPreview?: boolean;
    currentYear: number;
    index: keyof MedicalHistoryState;
    hide?: boolean;
}

interface MedicalHistoryProps {
    medicalHistory: MedicalHistoryState;
    medicalHistoryItem: MedicalHistoryItem;
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

type OwnProps = {
    index: string;
    deleteRow: (index: string) => void;
};

type FindIndex = React.MouseEvent | React.FormEvent<HTMLTextAreaElement>;

type Props = MedicalHistoryProps & RowProps & OwnProps & DispatchProps;

const mapDispatchToProps = {
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
};

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: OwnProps
): MedicalHistoryProps => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
        medicalHistoryItem: selectMedicalHistoryItem(state, ownProps.index),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MedicalHistoryNoteRow);

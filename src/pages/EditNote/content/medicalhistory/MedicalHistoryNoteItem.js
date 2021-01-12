import { Form, Grid } from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../familyhistory/FamilyHistory.css';

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteItem extends Component {
    render = () => {
        const {
            yesActive,
            condition,
            onConditionToggleButtonClick,
            onResolvedToggleButtonClick,
            noActive,
            onset,
            onChange,
            comments,
            currentYear,
            isResolved,
            endYear,
        } = this.props;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>{condition}</div>
                        <div>
                            <ToggleButton
                                active={yesActive}
                                condition={condition.props.condition}
                                title='Yes'
                                onToggleButtonClick={
                                    onConditionToggleButtonClick
                                }
                            />
                            <ToggleButton
                                active={noActive}
                                condition={condition.props.condition}
                                title='No'
                                onToggleButtonClick={
                                    onConditionToggleButtonClick
                                }
                            />
                        </div>
                    </Form.Group>
                    {yesActive && (
                        <div className='condition-info'>
                            <Form.TextArea
                                label='Onset'
                                className={`text-area text-area-${condition.props.index}`}
                                condition={condition.props.condition}
                                placeholder='Onset'
                                value={onset}
                                onChange={onChange}
                                rows={1}
                            />
                            {onset !== '' &&
                                (onset < 1900 || onset > currentYear) && (
                                    <p className='year-validation-mobile-error'>
                                        Please enter a valid year after 1900
                                    </p>
                                )}
                            <span className='field'>
                                <label>Has Condition Resolved?</label>
                            </span>
                            <div>
                                <ToggleButton
                                    active={isResolved === 'Yes'}
                                    condition={condition.props.condition}
                                    title='Yes'
                                    onToggleButtonClick={
                                        onResolvedToggleButtonClick
                                    }
                                />
                                <ToggleButton
                                    active={isResolved === 'No'}
                                    condition={condition.props.condition}
                                    title='No'
                                    onToggleButtonClick={
                                        onResolvedToggleButtonClick
                                    }
                                />
                            </div>
                            {isResolved === 'Yes' && (
                                <>
                                    <Form.TextArea
                                        label='End Year'
                                        className={`text-area text-area-${condition.props.index}`}
                                        condition={condition.props.condition}
                                        placeholder='End Year'
                                        value={endYear}
                                        onChange={onChange}
                                        rows={1}
                                    />
                                    {endYear !== '' &&
                                        (endYear < 1900 ||
                                            endYear > currentYear ||
                                            endYear < onset) && (
                                            <p className='year-validation-mobile-error'>
                                                Please enter a valid year after
                                                1900 and the onset
                                            </p>
                                        )}
                                </>
                            )}

                            <Form.TextArea
                                label='Comments'
                                className={`text-area text-area-${condition.props.index}`}
                                condition={condition.props.condition}
                                placeholder='Comments'
                                value={comments}
                                onChange={onChange}
                                rows={2}
                            />
                        </div>
                    )}
                </Form>
            </Grid.Row>
        );
    };
}

MedicalHistoryNoteItem.propTypes = {
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

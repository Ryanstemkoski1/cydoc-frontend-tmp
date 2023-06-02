import React, { useState, useEffect } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import DiscussionPlanMenu from './DiscussionPlanMenu';
import DifferentialDiagnosesForm from './forms/DifferentialDiagnosesForm';
import PrescriptionsForm from './forms/PrescriptionsForm';
import {
    ProceduresAndServicesForm,
    ReferralsForm,
} from './forms/MainWhenCommentsForms';
import DiscussionPlanSurvey from './DiscussionPlanSurvey';
import { DISCUSSION_PLAN_SECTION_BP } from 'constants/breakpoints.js';
import { PlanAction, EventHandler } from './util';
import './discussionPlan.css';

interface DiscussionPlanProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
}

/**
 * Main component for discussion and plan section of the note
 */
const DiscussionPlan = ({
    nextFormClick,
    previousFormClick,
}: DiscussionPlanProps) => {
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentId, setCurrentId] = useState<string>('');

    // Set event listeners for window resize to determine mobile vs web view
    useEffect(() => {
        const updateDimensions = () => {
            setWindowWidth(
                typeof window !== 'undefined' ? window.innerWidth : 0
            );
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Returns formatted actions
    const formatAction = (
        action: PlanAction /*  ...args: any[] */
    ): EventHandler => {
        return (_e, { uuid, value }) => {
            action(currentId, uuid, value);
        };
    };

    const mobile = windowWidth < DISCUSSION_PLAN_SECTION_BP;
    const formProps = { mobile, formatAction, conditionId: currentId };
    const form = currentId !== '' && (
        <>
            <DifferentialDiagnosesForm {...formProps} />
            <PrescriptionsForm {...formProps} />
            <ProceduresAndServicesForm {...formProps} />
            <ReferralsForm {...formProps} />
        </>
    );

    return (
        <>
            <Segment>
                <DiscussionPlanMenu
                    index={currentIndex}
                    windowWidth={windowWidth}
                    setCurrentIndex={setCurrentIndex}
                    setCurrentId={setCurrentId}
                />
                {form}
            </Segment>
            <DiscussionPlanSurvey />
            <Button
                icon='arrow left'
                floated='left'
                className='small-plan-previous-button'
                aria-label='previous-button'
                onClick={previousFormClick}
            />
            <Button
                icon='arrow left'
                labelPosition='left'
                floated='left'
                onClick={previousFormClick}
                className='plan-previous-button'
                aria-label='previous-button'
                content='Previous'
            />
            <Button
                icon='arrow right'
                floated='right'
                aria-label='next-button'
                className='small-plan-next-button'
                onClick={nextFormClick}
            />
            <Button
                icon='arrow right'
                labelPosition='right'
                aria-label='next-button'
                floated='right'
                onClick={nextFormClick}
                className='plan-next-button'
                content='Next'
            />
        </>
    );
};

export default DiscussionPlan;

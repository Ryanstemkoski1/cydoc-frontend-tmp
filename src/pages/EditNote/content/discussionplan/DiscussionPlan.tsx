import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { DISCUSSION_PLAN_SECTION_BP } from 'constants/breakpoints.js';
import useDimensions from 'hooks/useDimensions';
import React, { useState } from 'react';
import { Segment } from 'semantic-ui-react';
import DiscussionPlanMenu from './DiscussionPlanMenu';
import DiscussionPlanSurvey from './DiscussionPlanSurvey';
import './discussionPlan.css';
import DifferentialDiagnosesForm from './forms/DifferentialDiagnosesForm';
import {
    ProceduresAndServicesForm,
    ReferralsForm,
} from './forms/MainWhenCommentsForms';
import PrescriptionsForm from './forms/PrescriptionsForm';
import { EventHandler, PlanAction } from './util';

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
    const [windowWidth] = useDimensions();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentId, setCurrentId] = useState<string>('');

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
            <Segment className='dropdown-nav'>
                <DiscussionPlanMenu
                    index={currentIndex}
                    windowWidth={windowWidth}
                    setCurrentIndex={setCurrentIndex}
                    setCurrentId={setCurrentId}
                />
                {form}
            </Segment>
            <DiscussionPlanSurvey />
            <NavigationButton
                previousClick={previousFormClick}
                nextClick={nextFormClick}
            />
        </>
    );
};

export default DiscussionPlan;

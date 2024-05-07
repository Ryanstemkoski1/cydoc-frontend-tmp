import React, { ChangeEvent } from 'react';
import { Header, Segment, Grid, Label, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import { PlanSurvey } from '@redux/reducers/planReducer';
import {
    updateAdmitToHospital,
    updateSickness,
    updateEmergency,
} from '@redux/actions/planActions';
import { selectPlanSurvey } from '@redux/selectors/planSelectors';
import { YesNoUncertainResponse } from 'constants/enums';
import 'pages/EditNote/content/hpi/knowledgegraph/css/Button.css';

const GRID_QUESTION_WIDTH = 7;

interface StateProps {
    survey: PlanSurvey;
}

interface DispatchProps {
    updateAdmitToHospital: (value: YesNoUncertainResponse) => void;
    updateEmergency: (value: YesNoUncertainResponse) => void;
    updateSickness: (value: number) => void;
}

type DiscussionPlanSurveyProps = StateProps & DispatchProps;

interface AnswerButtonsProps {
    value: YesNoUncertainResponse;
    setResponse: (value: YesNoUncertainResponse) => void;
}

/**
 * Component for the survey of the discussion and plan section
 */
const DiscussionPlanSurvey = (props: DiscussionPlanSurveyProps) => {
    const { survey, updateSickness, updateEmergency, updateAdmitToHospital } =
        props;

    return (
        <Segment className='plan-survey'>
            <Header as='h3' content='Help Improve Cydoc' />
            <Grid stackable columns={2} as='article'>
                <Grid.Row>
                    <Grid.Column
                        width={GRID_QUESTION_WIDTH}
                        /* eslint-disable-next-line */
                        children='How sick is the patient?'
                    />
                    <Grid.Column floated='right'>
                        <div className='range-input-labels'>
                            <label> Healthy </label>
                            <label> Sick </label>
                        </div>
                        <input
                            type='range'
                            min={0}
                            max={10}
                            step={1}
                            value={survey.sicknessLevel}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateSickness(parseInt(e.target.value))
                            }
                            aria-label='range-for-sickness'
                        />
                        <Label
                            circular
                            as='label'
                            pointing='left'
                            content={survey.sicknessLevel}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column
                        width={GRID_QUESTION_WIDTH}
                        /* eslint-disable-next-line */
                        children='Will the patient be sent to the emergency department?'
                    />
                    <Grid.Column floated='right'>
                        <AnswerButtons
                            value={survey.emergency}
                            setResponse={updateEmergency}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column
                        width={GRID_QUESTION_WIDTH}
                        /* eslint-disable-next-line */
                        children='Will the patient be admitted to the hospital?'
                    />
                    <Grid.Column floated='right'>
                        <AnswerButtons
                            value={survey.admitToHospital}
                            setResponse={updateAdmitToHospital}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

/**
 * Component for rendering the different survey answer options as a
 * button group
 */
const AnswerButtons = ({ value, setResponse }: AnswerButtonsProps) => {
    const buttons = Object.entries(YesNoUncertainResponse)
        .filter(([_, val]) => val !== YesNoUncertainResponse.None)
        .map(([name, val], i) => (
            <Button
                key={i}
                className={`button_yesno hpi-ph-button${
                    val === value ? '-selected' : ''
                }`}
                active={val === value}
                onClick={() => setResponse(val)}
            >
                {name}
            </Button>
        ));
    return <>{buttons}</>;
};

export default connect(
    (state: CurrentNoteState) => ({ survey: selectPlanSurvey(state) }),
    { updateAdmitToHospital, updateEmergency, updateSickness }
)(DiscussionPlanSurvey);

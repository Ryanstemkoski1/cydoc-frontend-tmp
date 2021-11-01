import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { ReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import { selectReviewOfSystemsState } from 'redux/selectors/reviewOfSystemsSelectors';
import { selectPlanState } from 'redux/selectors/planSelectors';
import { SocialHistoryState } from 'redux/reducers/socialHistoryReducer';
import { selectFamilyHistoryState } from 'redux/selectors/familyHistorySelectors';
import { selectAllergiesState } from 'redux/selectors/allergiesSelectors';
import { AllergiesState } from 'redux/reducers/allergiesReducer';
import { selectMedicationsState } from 'redux/selectors/medicationsSelectors';
import { MedicationsState } from 'redux/reducers/medicationsReducer';
import { selectSurgicalHistoryState } from 'redux/selectors/surgicalHistorySelectors';
import { SurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { PhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { Button, Segment, Icon } from 'semantic-ui-react';
import { PlanState } from 'redux/reducers/planReducer';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';

// import all the individual note sections
import MedicalHistoryNote from './notesections/MedicalHistoryNote';
import SurgicalHistoryNote from './notesections/SurgicalHistoryNote';
import MedicationsNote from './notesections/MedicationsNote';
import AllergiesNote from './notesections/AllergiesNote';
import SocialHistoryNote from './notesections/SocialHistoryNote';
import FamilyHistoryNote from './notesections/FamilyHistoryNote';
import ReviewOfSystemsNote from './notesections/ReviewOfSystemsNote';
import PhysicalExamNote from './notesections/PhysicalExamNote';
import PlanNote from './notesections/PlanNote';

// import HPINote from './notesections/HPINote';

interface GenerateNoteProps {
    previousFormClick: () => void;
}

interface GenerateNoteState {
    rich: boolean;
}

interface StateProps {
    ROSState: ReviewOfSystemsState;
    planState: PlanState;
    familyHistoryState: FamilyHistoryState;
    socialHistoryState: SocialHistoryState;
    allergiesState: AllergiesState;
    medicationsState: MedicationsState;
    surgicalHistoryState: SurgicalHistoryState;
    medicalHistoryState: MedicalHistoryState;
    physicalExamState: PhysicalExamState;
}

type Props = GenerateNoteProps & StateProps;

const mapStateToProps = (state: CurrentNoteState): StateProps => ({
    ROSState: selectReviewOfSystemsState(state),
    planState: selectPlanState(state),
    familyHistoryState: selectFamilyHistoryState(state),
    socialHistoryState: state.socialHistory,
    allergiesState: selectAllergiesState(state),
    medicationsState: selectMedicationsState(state),
    surgicalHistoryState: selectSurgicalHistoryState(state),
    medicalHistoryState: state.medicalHistory,
    physicalExamState: state.physicalExam,
});

// TODO: look into <li> keys -- throws a warning if duplicats, not a huge deal but probably fix
export class GenerateNote extends Component<Props, GenerateNoteState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            rich: false,
        };
    }

    render() {
        const {
            previousFormClick,
            ROSState,
            planState,
            familyHistoryState,
            socialHistoryState,
            allergiesState,
            medicationsState,
            surgicalHistoryState,
            medicalHistoryState,
            physicalExamState,
        } = this.props;

        return (
            <div>
                <Button.Group>
                    <Button onClick={() => this.setState({ rich: false })}>
                        Plain Text{' '}
                    </Button>
                    <Button.Or />
                    <Button
                        onClick={() => {
                            this.setState({ rich: true });
                        }}
                    >
                        Rich Text
                    </Button>
                </Button.Group>
                <Segment>
                    {/* <h1> {this.context.title} </h1> */}
                    {/* <h3> History of Present Illness </h3>
                    <HPINote /> */}
                    <h3> Patient History </h3>
                    <h4> Medical History </h4>
                    <MedicalHistoryNote
                        isRich={this.state.rich}
                        medicalHistory={medicalHistoryState}
                    />
                    <h4> Surgical History </h4>
                    <SurgicalHistoryNote
                        isRich={this.state.rich}
                        surgicalHistory={surgicalHistoryState}
                    />
                    <h4> Medications </h4>
                    <MedicationsNote
                        isRich={this.state.rich}
                        medications={medicationsState}
                    />
                    <h4> Allergies </h4>
                    <AllergiesNote
                        isRich={this.state.rich}
                        allergies={allergiesState}
                    />
                    <h4> Social History </h4>
                    <SocialHistoryNote socialHistory={socialHistoryState} />
                    <h4> Family History </h4>
                    <FamilyHistoryNote familyHistory={familyHistoryState} />
                    <h3> Review of Systems </h3>
                    <ReviewOfSystemsNote ROSState={ROSState} />
                    <h3> Physical Exam </h3>
                    <PhysicalExamNote
                        isRich={this.state.rich}
                        physicalExam={physicalExamState}
                    />
                    <h3> Plan </h3>
                    <PlanNote planState={planState} />
                </Segment>

                <Button
                    icon
                    floated='left'
                    onClick={previousFormClick}
                    className='small-note-previous-button'
                >
                    <Icon name='arrow left' />
                </Button>
                <Button
                    icon
                    labelPosition='left'
                    floated='left'
                    onClick={previousFormClick}
                    className='note-previous-button'
                >
                    Previous Form
                    <Icon name='arrow left' />
                </Button>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(GenerateNote);

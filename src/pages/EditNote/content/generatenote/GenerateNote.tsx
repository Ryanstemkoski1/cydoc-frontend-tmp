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
import { Button, Segment, Icon, Sticky } from 'semantic-ui-react';
import { PlanState } from 'redux/reducers/planReducer';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';

// import all the individual note sections
import HPINote from './notesections/HPINote';
import MedicalHistoryNote from './notesections/MedicalHistoryNote';
import SurgicalHistoryNote from './notesections/SurgicalHistoryNote';
import MedicationsNote from './notesections/MedicationsNote';
import AllergiesNote from './notesections/AllergiesNote';
import SocialHistoryNote from './notesections/SocialHistoryNote';
import FamilyHistoryNote from './notesections/FamilyHistoryNote';
import ReviewOfSystemsNote from './notesections/ReviewOfSystemsNote';
import PhysicalExamNote from './notesections/PhysicalExamNote';
import PlanNote from './notesections/PlanNote';
import './GenerateNote.css';

import './GenerateNote.css';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
// import HPINote from './notesections/HPINote';
/// <reference types="./Clipboard.ts" />

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

    copyNote = () => {
        const note = document.querySelectorAll('.generate-note-text');
        const blob = new Blob([note[0].innerHTML], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
            ['text/html']: blob,
        });
        navigator.clipboard.write([clipboardItem]);
    };

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
                <div className='generate-note-buttons'>
                    <Segment>
                        <Button.Group>
                            <Button
                                onClick={() => this.setState({ rich: false })}
                                className={`hpi-ph-button${
                                    this.state.rich === false ? '-selected' : ''
                                }`}
                            >
                                Plain Text{' '}
                            </Button>
                            <Button.Or />
                            <Button
                                onClick={() => this.setState({ rich: true })}
                                className={`hpi-ph-button${
                                    this.state.rich === true ? '-selected' : ''
                                }`}
                            >
                                Rich Text
                            </Button>
                        </Button.Group>
                        <Button.Group floated='right'>
                            <Button
                                className='copy-button'
                                onClick={() => this.copyNote()}
                            >
                                Copy Note
                            </Button>
                        </Button.Group>
                    </Segment>
                </div>
                <Segment className='generate-note-text'>
                    {/* <h1> {this.context.title} </h1> */}
                    <h3> History of Present Illness </h3>
                    <HPINote />
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
                    <SocialHistoryNote
                        isRich={this.state.rich}
                        socialHistory={socialHistoryState}
                    />
                    <h4> Family History </h4>
                    <FamilyHistoryNote
                        isRich={this.state.rich}
                        familyHistory={familyHistoryState}
                    />
                    <h3> Review of Systems </h3>
                    <ReviewOfSystemsNote
                        isRich={this.state.rich}
                        ROSState={ROSState}
                    />
                    <h3> Physical Exam </h3>
                    <PhysicalExamNote
                        isRich={this.state.rich}
                        physicalExam={physicalExamState}
                    />
                    <h3> Plan </h3>
                    <PlanNote planState={planState} />
                </Segment>
                {/*<Button
                icon='arrow left'
                floated='left'
                className='small-note-previous-button'
                aria-label='previous-button'
                onClick={previousFormClick}
            />*/}
                <Button
                    icon='arrow left'
                    labelPosition='left'
                    floated='left'
                    onClick={previousFormClick}
                    className='note-previous-button'
                    aria-label='previous-button'
                    content='Previous'
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(GenerateNote);

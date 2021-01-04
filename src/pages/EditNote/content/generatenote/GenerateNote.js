import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';
import { Button, Segment } from 'semantic-ui-react';

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
import HPINote from './notesections/HPINote';

// TODO: look into <li> keys -- throws a warning if duplicats, not a huge deal but probably fix
class GenerateNote extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rich: false
        }
    }

    static contextType = HPIContext;

    render() {
        return (
            <div>
                <Button.Group>
                    <Button onClick={() => this.setState({rich : false})}>Plain Text </Button>
                    <Button.Or />
                    <Button onClick={() => this.setState({rich : true})}>Rich Text</Button>
                </Button.Group>
                <Segment>
                    <h1> {this.context.title} </h1>
                    <h3> History of Present Illness </h3>
                    <HPINote />
                    <h3> Patient History </h3>
                        <h4> Medical History </h4>
                        <MedicalHistoryNote isRich={this.state.rich} medicalHistory={this.context["Medical History"]} />
                        <h4> Surgical History </h4>
                        <SurgicalHistoryNote isRich={this.state.rich} surgicalHistory={this.context["Surgical History"]} />
                        <h4> Medications </h4>
                        <MedicationsNote isRich={this.state.rich} medications={this.context["Medications"]} />
                        <h4> Allergies </h4>
                        <AllergiesNote isRich={this.state.rich} allergies={this.context["Allergies"]} />
                        <h4> Social History </h4>
                        <SocialHistoryNote socialHistory={this.context["Social History"]} />
                        <h4> Family History </h4>
                        <FamilyHistoryNote familyHistory={this.context["Family History"]} />
                    <h3> Review of Systems </h3>
                    <ReviewOfSystemsNote reviewOfSystems={this.context["Review of Systems"]} />
                    <h3> Physical Exam </h3>
                    <PhysicalExamNote isRich={this.state.rich} physicalExam={this.context["Physical Exam"]} />
                    <h3> Plan </h3>
                    <PlanNote plan={this.context.plan} />
                </Segment>

                <Button icon floated='left' onClick={this.previousFormClick} className='small-note-previous-button'>
                <Icon name='arrow left'/>
                </Button>
                <Button icon labelPosition='left' floated='left' onClick={this.previousFormClick} className='note-previous-button'>
                Previous Form
                <Icon name='arrow left'/>
                </Button>
            </div>
        )
    }
}

export default GenerateNote;

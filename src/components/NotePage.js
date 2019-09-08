import React, {Component} from 'react';
import {Segment, Container, Header, Input, Form} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../content/medications/MedicationsContent";
import AllergiesContent from "../content/allergies/AllergiesContent";
import FamilyHistoryContent from "../content/familyhistory/FamilyHistoryContent";
import PropTypes from 'prop-types';
import SocialHistoryContent from "../content/socialhistory/SocialHistoryContent";
import PhysicalExamContent from "../content/physicalexam/PhysicalExamContent";
import ControlledInput from "./temp";
import ControlledInputOuter from "./temp1";

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        this.newOnChange = this.newOnChange.bind(this);
        // this.onChangeTemp = this.onChangeTemp.bind(this);
        // this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            value: "Hello",
            // socialHistoryContent: {
            //     alcohol: {},
            //     tobacco: {
            //         "Packs/Day": ""
            //     },
            //     recreationalDrugs: {},
            // },
            // medicalHistoryContent: {},
            // input: "hi"
        }
    }
    //
    // onInputChange(value){
    //     let newState = this.state;
    //     newState["input"] = value;
    //     this.setState({newState});
    // }
    //

    newOnChange(event, data){
        let newState = this.state;
        // newState[pageName] = data;
        newState.value = data.value;
        this.setState(newState);
        console.log(this.state.value);
    }
    //
    // onChangeTemp(event, data){
    //     let newState = this.state;
    //     newState.value = data.value;
    //     this.setState(newState);
    //     console.log(data.value);
    // }

    isActive (tabName) {
        if(this.props.activeItem === tabName) {
            return {}
        }
        return {display: "block"}
    }

    render() {
        let tabToDisplay;
        switch(this.props.activeItem) {
            case "Medical History":
                tabToDisplay = (<MedicalHistoryContent
                    onChange={this.newOnChange}
                    value={this.state.value}/>);
                break;
            case "Surgical History":
                tabToDisplay = (<SurgicalHistoryContent />);
                break;
            case "Medications":
                tabToDisplay = (<MedicationsContent/>);
                break;
            case "Allergies":
                tabToDisplay = (<AllergiesContent/>);
                break;
            case "Family History":
                tabToDisplay = (<FamilyHistoryContent/>);
                break;
            case "Social History":
                tabToDisplay = (<SocialHistoryContent/>);
                break;
            case "Physical Exam":
                tabToDisplay = (<PhysicalExamContent />);
                break;
            default:
                tabToDisplay = (<MedicalHistoryContent />);

            // code block
        }
        return (
            <Container>
                <br/>
                <Segment style={{borderColor: "white"}} padded={"very"}>
                    <Header as="h3" textAlign="center">
                        {this.props.activeItem.toLowerCase()}
                    </Header>
                    {tabToDisplay}
                </Segment>
                <br />
            </Container>
        );
    }
};

NotePage.propTypes = {
  activeItem: PropTypes.string
};
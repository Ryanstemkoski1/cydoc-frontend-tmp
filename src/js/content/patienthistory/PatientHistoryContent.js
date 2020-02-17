import React, { Component } from 'react'
import {Menu, Container} from 'semantic-ui-react'
import MedicalHistoryContent from "../medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../medications/MedicationsContent";
import AllergiesContent from "../allergies/AllergiesContent";
import SocialHistoryContent from "../socialhistory/SocialHistoryContent";

export default class PatientHistoryContent extends Component {
    constructor() {
        super()
        this.state = {
            patient_history: ["medical history", "surgical history", "medications", "allergies", "social history"],
            activeItem: "medical history"
        }
        this.handleItemClick = this.handleItemClick.bind(this)
    }
    handleItemClick = (e, {name}) => {
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        document.getElementById(name).style.display = "block";
        this.setState({ activeItem: name });
    }
    render() {
        const tabs = this.state.patient_history.map((name, index) => 
        <Menu.Item 
            key={index} 
            name={name} 
            active={this.state.activeItem === name} 
            onClick={this.handleItemClick} 
            style={{borderColor: "white", fontSize: '13px'}} 
            />)
        return (
            <div>
                <Menu tabular> 
                <Container style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                         {tabs}
                    </Container>
                </Menu>
                <div id="medical history" className="tabcontent" style={{marginTop: 25, display: "block"}}><MedicalHistoryContent /> </div>
                <div id="surgical history" className="tabcontent" style={{marginTop: 25, display: "none"}}><SurgicalHistoryContent /> </div>
                <div id="medications" className="tabcontent" style={{marginTop: 25, display: "none"}}> 
                <h5 style={{textAlign: 'right', marginRight: 50, display: "none"}}> scroll &rarr; </h5>
                <MedicationsContent /> </div>
                <div id="allergies" className="tabcontent" style={{marginTop: 25, display: "none"}}>  <AllergiesContent /> </div>
                <div id="social history" className="tabcontent" style={{marginTop: 25, display: "none"}}> <SocialHistoryContent /> </div>
            </div>
        )
    }
}
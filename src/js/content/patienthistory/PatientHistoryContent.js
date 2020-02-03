import React, { Component } from 'react'
import MedicalHistoryContent from "../medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../medications/MedicationsContent";
import AllergiesContent from "../allergies/AllergiesContent";
import SocialHistoryContent from "../socialhistory/SocialHistoryContent";

export default class PatientHistoryContent extends Component {
    render() {
        return (
            <div>
                <div className="ui divider"> </div>
                <h3 style={{textAlign: 'center'}}> medical history </h3> <MedicalHistoryContent />
                <div className="ui divider"> </div>
                <h3 style={{textAlign: 'center'}}> surgical history </h3> <SurgicalHistoryContent />
                <div className="ui divider"> </div>
                <h3 style={{textAlign: 'center'}}> medications </h3> <MedicationsContent />
                <div className="ui divider"> </div>
                <h3 style={{textAlign: 'center'}}> allergies </h3> <AllergiesContent />
                <div className="ui divider"> </div>
                <h3 style={{textAlign: 'center'}}> social history </h3> <SocialHistoryContent />
            </div>
        )
    }
}
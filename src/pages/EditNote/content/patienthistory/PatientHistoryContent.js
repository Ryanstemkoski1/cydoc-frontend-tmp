import React, { Component, Fragment } from 'react'
import { Menu, Dropdown, Tab, Container } from 'semantic-ui-react'
import MedicalHistoryContent from "../medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../medications/MedicationsContent";
import AllergiesContent from "../allergies/AllergiesContent";
import SocialHistoryContent from "../socialhistory/SocialHistoryContent";
import './PatientHistory.css';
import {PATIENT_HISTORY_MOBILE_BP, SOCIAL_HISTORY_MOBILE_BP} from "constants/breakpoints.js";

export default class PatientHistoryContent extends Component {
    constructor() {
        super()
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            patient_history: ["medical history", "surgical history", "medications", "allergies", "social history"],
            activeItem: "medical history"
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    handleItemClick = (e, {name}) => {
        var tabcontent = document.getElementsByClassName("tab-content");
        for (var i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        document.getElementById(name).style.display = "block";
        this.setState({ activeItem: name });
    }

    render() {
        const { windowWidth, activeItem } = this.state;

        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const socialHistoryMobile = windowWidth < SOCIAL_HISTORY_MOBILE_BP;

        const expandedTabs = this.state.patient_history.map((name, index) => 
            <Tab.Pane
                attached={false}
                key={index} 
                name={name} 
                active={this.state.activeItem === name} 
                onClick={this.handleItemClick}
                className="patient-history-tab" 
            />
        );

        const dropdownTabs = [];
        for (let i = 0; i < this.state.patient_history.length; i++) {
            dropdownTabs.push({
                key: i,
                name: this.state.patient_history[i],
                text: this.state.patient_history[i],
                value: this.state.patient_history[i],
                active: this.state.activeItem === this.state.patient_history[i],
                onClick: this.handleItemClick,
                className: "patient-history-tab",
            });
        }

        const panes = [
            {
                menuItem: 'Medical History',
                render: () => <Tab.Pane attached={false}>
                    <MedicalHistoryContent collapseTabs={collapseTabs} />
                </Tab.Pane>,
            },
            {
                menuItem: 'Surgical History',
                render: () => <Tab.Pane attached={false}>
                    <SurgicalHistoryContent mobile={collapseTabs} />
                </Tab.Pane>,
            },
            {
                menuItem: 'Medications',
                render: () => <Tab.Pane attached={false}>
                    <MedicationsContent mobile={collapseTabs} />
                </Tab.Pane>,
            },
            {
                menuItem: 'Allergies',
                render: () => <Tab.Pane attached={false}>
                    <AllergiesContent mobile={collapseTabs}/>
                </Tab.Pane>,
            },
            {
                menuItem: 'Social History',
                render: () => <Tab.Pane attached={false}>
                    <SocialHistoryContent mobile={socialHistoryMobile}/>
                </Tab.Pane>,
            },
        ]

        /*

                <div id="medical history" className="tab-content initial">
                    <MedicalHistoryContent collapseTabs={collapseTabs} />
                </div>
                <div id="surgical history" className="tab-content">
                    <SurgicalHistoryContent mobile={collapseTabs} />
                </div>
                <div id="medications" className="tab-content">
                    <MedicationsContent mobile={collapseTabs} />
                </div>
                <div id="allergies" className="tab-content">
                    <AllergiesContent mobile={collapseTabs}/>
                </div>
                <div id="social history" className="tab-content">
                    <SocialHistoryContent mobile={socialHistoryMobile}/>
                </div>
         */

        return (
            <Container style={collapseTabs ? null : {
                backgroundColor: "white",
                boxShadow: "0px 5px 10px 1px grey",
                padding: "10px 10px 10px 10px"
            }}>
                {collapseTabs ? 
                    <Dropdown text={activeItem} options={dropdownTabs} selection fluid scrolling={false} />
                    : <Tab menu={{ secondary: true }} panes={panes} />

                }
            </Container>
        )
    }
}
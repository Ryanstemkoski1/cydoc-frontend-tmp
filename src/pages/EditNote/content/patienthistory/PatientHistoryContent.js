import React, { Component, Fragment } from 'react'
import { Menu, Dropdown, Tab, Container, Segment } from 'semantic-ui-react'
import MedicalHistoryContent from "../medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../medications/MedicationsContent";
import AllergiesContent from "../allergies/AllergiesContent";
import SocialHistoryContent from "../socialhistory/SocialHistoryContent";
import FamilyHistoryContent from "../familyhistory/FamilyHistoryContent";
import './PatientHistory.css';
import {PATIENT_HISTORY_MOBILE_BP, SOCIAL_HISTORY_MOBILE_BP} from "constants/breakpoints.js";

export default class PatientHistoryContent extends Component {
    constructor() {
        super()
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            activeTabName: "Medical History" // Default open pane is Medical History
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

    // handleItemClick = (e, {name}) => {
    //     this.setState({ activeItem: name });
    // }
    handleItemClick = (e, { value }) => this.setState({ activeTabName: value })

    render() {
        const { windowWidth, activeTabName } = this.state;

        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const socialHistoryMobile = windowWidth < SOCIAL_HISTORY_MOBILE_BP;

        // If more panes are needed, then add ONLY to this array.
        // All other arrays needed for rendering are automatically constructed.
        const panes = [
            {
                menuItem: 'Medical History',
                content: <MedicalHistoryContent mobile={collapseTabs} />
            },
            {
                menuItem: 'Surgical History',
                content: <SurgicalHistoryContent mobile={collapseTabs} />
            },
            {
                menuItem: 'Medications',
                content: <MedicationsContent mobile={collapseTabs} />
            },
            {
                menuItem: 'Allergies',
                content: <AllergiesContent mobile={collapseTabs}/>
            },
            {
                menuItem: 'Social History',
                content: <SocialHistoryContent mobile={socialHistoryMobile}/>
            },
            {
                menuItem: 'Family History',
                content: <FamilyHistoryContent mobile={collapseTabs}/>
            }
        ]

        const dropdownOptions = panes.map(
            (pane) => {
                return {
                    key: pane.menuItem,
                    text: pane.menuItem,
                    value: pane.menuItem
                }
            }
        )

        const expandedPanes = panes.map(
            (pane) => {
                return {
                    menuItem: pane.menuItem,
                    render: () => <Tab.Pane attached={false}> {pane.content} </Tab.Pane>
                }
            }
        )

        const compactPanes = panes.map(
            (pane) => {
                return {
                    menuItem: pane.menuItem,
                    render: () => <Segment> {pane.content} </Segment>
                }
            }
        )

        return (
            <>
                {collapseTabs ?
                    <>
                        <Dropdown onChange={this.handleItemClick} options={dropdownOptions} selection fluid value={activeTabName}/>
                        {compactPanes.find(e => e.menuItem == activeTabName).render()}
                    </>
                    :
                    <Tab menu={{ pointing: true }} panes={expandedPanes}/>

                }
            </>
        )
    }
}
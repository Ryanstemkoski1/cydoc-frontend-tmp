import React, { Component, Fragment } from 'react'
import { Button, Container, Grid, Tab, Segment, Icon } from 'semantic-ui-react'
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
            activeTabName: 'Medical History', // Default open pane is Medical History
            activeIndex: this.activeIndex,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        // Using timeout to ensure that tab/dropdown menu is rendered before setting 
        setTimeout((_event) => {
            this.setMenuPosition();
        }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
        this.setMenuPosition();
    }

    setMenuPosition() {
       const stickyHeaderHeight = document.getElementById("stickyHeader").offsetHeight;
        // Ensuring that the patient history tabs are rendered
        while (this.fixedMenu == null || this.fixedMenu.length == 0) {
            this.fixedMenu = document.getElementsByClassName("patient-history-menu");
        }
        this.fixedMenu[0].style.top = `${stickyHeaderHeight}px`;
    }

    handleItemClick = (e, { children }) => this.setState({ activeTabName: children })

    nextFormClick = () => this.props.nextFormClick();

    previousFormClick = () => this.props.previousFormClick();

    handleTabChange = (e, { panes, activeIndex }) => this.setState({ activeIndex, activeTabName: panes.menuItem });

    handlePrevTab = (e, {activeTabName}) => {
        this.setState({ activeIndex: e.target.value, activeTabName: activeTabName })
    }

    handleNextTab = (e, {activeTabName}) => {
        this.setState({ activeIndex: e.target.value, activeTabName: activeTabName });
    }

    // panes for mobile view
    onTabClick(activeTabName) {
        const collapseTabs = this.state.windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const socialHistoryMobile = this.state.windowWidth < SOCIAL_HISTORY_MOBILE_BP;


        let tabToDisplay;

        switch (activeTabName) {
            case "Medical History":
                tabToDisplay = (<MedicalHistoryContent mobile={collapseTabs} />);
                break;
            case "Surgical History":
                tabToDisplay = (<SurgicalHistoryContent mobile={collapseTabs} />);
                break;
            case "Medications":
                tabToDisplay = (<MedicationsContent mobile={collapseTabs} />);
                break;
            case "Allergies":
                tabToDisplay = (<AllergiesContent mobile={collapseTabs} />);
                break;
            case "Social History":
                tabToDisplay = (<SocialHistoryContent mobile={socialHistoryMobile} />);
                break;
            case "Family History":
                tabToDisplay = (<FamilyHistoryContent mobile={collapseTabs} />)
                break;
            default:
                tabToDisplay = (<MedicalHistoryContent mobile={collapseTabs} />);
                break;
        }
        return tabToDisplay;    
    }

    onNextClick() {
        this.setState(state => {
            if (state.activeTabName === 'Medical History') {
                return {
                    activeTabName: 'Surgical History',
                }
            } else if (state.activeTabName === 'Surgical History') {
                return {
                    activeTabName: 'Medications',
                }
            } else if (state.activeTabName === 'Medications') {
                return {
                    activeTabName: 'Allergies',
                }
            } else if (state.activeTabName === 'Allergies') {
                return {
                    activeTabName: 'Social History',
                }
            } else if (state.activeTabName === 'Social History') {
                return {
                    activeTabName: 'Family History',
                }
            }
        })
        // // brings users to the top of the page after button click
        // window.scrollTo(0,0);
    }

    // brings users to the previous form when clicked
    onPreviousClick() {
        this.setState(state => {
            if (state.activeItem === 'Surgical History') {
                return {
                    activeItem: 'Medical History',
                }
            } else if (state.activeItem === 'Medications') {
                return {
                    activeItem: 'Surgical History',
                }
            } else if (state.activeItem === 'Allergies') {
                return {
                    activeItem: 'Medications',
                }
            } else if (state.activeItem === 'Social History') {
                return {
                    activeItem: 'Allergies',
                }
            } else if (state.activeItem === 'Family History') {
                return {
                    activeItem: 'Social History',
                }
            }
        })
        // brings users to the top of the page after button click
        window.scrollTo(0,0);
    }


    render() {
        const { windowWidth, activeTabName, activeIndex } = this.state;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        // panes for desktop view
        const panes = [
            {
                menuItem: 'Medical History',
                render: () => (
                    <Tab.Pane>
                    <MedicalHistoryContent activeTabName='Medical History'/>
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        onClick={this.previousFormClick}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        value={1}
                        activeTabName='Surgical History'
                        onClick={this.handleNextTab}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Surgical History',
                render: () => (
                    <Tab.Pane>
                    <SurgicalHistoryContent activeTabName='Surgical History' />
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        value={0}
                        activeTabName='Medical History'
                        onClick={this.handlePrevTab}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        value={2}
                        activeTabName='Medications'
                        onClick={this.handleNextTab}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                    )
            },
            {
                menuItem: 'Medications',
                render: ()  => (
                    <Tab.Pane>
                    <MedicationsContent activeTabName='Medications'/>
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        value={1}
                        activeTabName='Surgical History'
                        onClick={this.handlePrevTab}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        value={3}
                        activeTabName='Allergies'
                        onClick={this.handleNextTab}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Allergies',
                render: () => (
                    <Tab.Pane>
                    <AllergiesContent activeTabName='Allergies'/>
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        value={2}
                        activeTabName='Medications'
                        onClick={this.handlePrevTab}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        value={4}
                        activeTabName='Social History'
                        onClick={this.handleNextTab}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Social History',
                render: () => (
                    <Tab.Pane>
                    <SocialHistoryContent activeTabName='Social History' />
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        value={3}
                        activeTabName='Allergies'
                        onClick={this.handlePrevTab}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        value={5}
                        activeTabName='Family History'
                        onClick={this.handleNextTab}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Family History',
                render: () => (
                    <Tab.Pane>
                    <FamilyHistoryContent activeTabName='Family History' />
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        value={4}
                        activeTabName='Social History'
                        onClick={this.handlePrevTab}
                    >
                    Previous Form
                    <Icon name='left arrow' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        className='patient-next-button'
                        onClick={this.nextFormClick}
                    >
                    Next Form
                    <Icon name='right arrow' />
                    </Button>
                    </Tab.Pane>
                )
            }
        ]

        const gridButtons = panes.map(
            (pane) => {
                return <Button basic children = {pane.menuItem} onClick={this.handleItemClick} active={activeTabName==pane.menuItem} style={{marginBottom: 5}}/>
            }
        ) 

        const tabToDisplay = this.onTabClick(this.state.activeTabName);

        return (
            <>
                {collapseTabs ?
                    <Container>
                        <Grid stackable centered className={"patient-history-menu"} relaxed>
                            {gridButtons}
                        </Grid>
                        <Segment>{tabToDisplay}</Segment>
                        {activeTabName === 'Medical History' ? 
                        <>
                        <Button icon floated='left' onClick={this.previousFormClick} className='small-patient-previous-button'>
                        <Icon name='left arrow'/>
                        </Button>

                        <Button icon floated='right' onClick={this.onNextClick} className='small-patient-next-button'>
                        <Icon name='right arrow'/>
                        </Button>  
                        </> 
                        : ''
                        }

                        {activeTabName === 'Family History'? 
                        <>
                        <Button icon floated='left' onClick={this.onPreviousClick} className='small-patient-previous-button'>
                        <Icon name='left arrow'/>
                        </Button>

                        <Button icon floated='right' onClick={this.nextFormClick} className='small-patient-next-button'>
                        <Icon name='right arrow'/>
                        </Button>
                        </>
                        : ''
                        }
                        {activeTabName === 'Social History' || activeTabName === 'Allergies' || activeTabName === 'Medications' || activeTabName === 'Surgical History' ?
                        <>
                        <Button icon floated='left' onClick={this.onPreviousClick} className='small-patient-previous-button'>
                        <Icon name='left arrow'/>
                        </Button>

                        <Button icon floated='right' onClick={this.onNextClick} className='small-patient-next-button'>
                        <Icon name='right arrow'/>
                        </Button>
                        </>
                        :''
                        }            
                    </Container>
                    :
                    <Tab menu={{ pointing: true, className: "patient-history-menu"}} panes={panes} activeIndex={activeIndex} activeTabName={this.state.activeTabName} onTabChange={this.handleTabChange}/>
                }
            </>

        )
    }
}
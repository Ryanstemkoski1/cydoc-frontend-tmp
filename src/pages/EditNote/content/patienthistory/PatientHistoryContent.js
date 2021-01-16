import React, { Component } from 'react';
import { Button, Container, Grid, Tab, Segment, Icon } from 'semantic-ui-react';
import MedicalHistoryContent from '../medicalhistory/MedicalHistoryContent';
import SurgicalHistoryContent from '../surgicalhistory/SurgicalHistoryContent';
import MedicationsContent from '../medications/MedicationsContent';
import AllergiesContent from '../allergies/AllergiesContent';
import SocialHistoryContent from '../socialhistory/SocialHistoryContent';
import FamilyHistoryContent from '../familyhistory/FamilyHistoryContent';
import './PatientHistory.css';
import {
    PATIENT_HISTORY_MOBILE_BP,
    SOCIAL_HISTORY_MOBILE_BP,
} from 'constants/breakpoints.js';

export default class PatientHistoryContent extends Component {
    constructor() {
        super();
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            headerHeight: 0,
            activeTabName: 'Medical History', // Default open pane is Medical History
            activeIndex: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
        this.setMenuPosition = this.setMenuPosition.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
        this.updateIndex();
        // Using timeout to ensure that tab/dropdown menu and any relevant headers are rendered before setting
        setTimeout(() => {
            this.setMenuPosition();
            this.setStickyHeaders();
        }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;
        let headerHeight =
            document.getElementById('stickyHeader')?.offsetHeight ?? 0;

        this.setState({ windowWidth, windowHeight, headerHeight });
        this.setMenuPosition();
        this.setStickyHeaders();
    }

    setMenuPosition() {
        const fixedMenu = document.getElementById('patient-history-menu');
        if (fixedMenu != null) {
            fixedMenu.style.top = `${this.state.headerHeight}px`;
        }
    }

    setStickyHeaders() {
        const stickyHeaders = document.getElementsByClassName('sticky-header');
        const patientHistoryMenu = document.getElementById(
            'patient-history-menu'
        );
        if (
            stickyHeaders != null &&
            stickyHeaders.length != 0 &&
            patientHistoryMenu != null
        ) {
            for (let i = 0; i < stickyHeaders.length; i++) {
                stickyHeaders[i].style.top = `${
                    parseInt(patientHistoryMenu.style.top) +
                    patientHistoryMenu.offsetHeight
                }px`;
            }
        }
    }

    updateIndex() {
        let index = window.localStorage.getItem('activeIndex');
        let tab = window.localStorage.getItem('activeTabName');
        this.setState({ activeIndex: index });
        this.setState({ activeTabName: tab });
    }

    handleItemClick = (e, { children }) =>
        this.setState({ activeTabName: children });

    nextFormClick = () => this.props.nextFormClick();

    previousFormClick = () => this.props.previousFormClick();

    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeIndex });
        if (activeIndex === 0) {
            this.setState({ activeTabName: 'Medical History' });
        } else if (activeIndex === 1) {
            this.setState({ activeTabName: 'Surgical History' });
        } else if (activeIndex === 2) {
            this.setState({ activeTabName: 'Medications' });
        } else if (activeIndex === 3) {
            this.setState({ activeTabName: 'Allergies' });
        } else if (activeIndex === 4) {
            this.setState({ activeTabName: 'Social History' });
        } else if (activeIndex === 5) {
            this.setState({ activeTabName: 'Family History' });
        } else {
            this.setState({ activeTabName: 'Medical History' });
        }
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    handlePrevTab = (e, { activeTabName }) => {
        this.setState({
            activeIndex: e.target.value,
            activeTabName: activeTabName,
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    handleNextTab = (e, { activeTabName }) => {
        this.setState({
            activeIndex: e.target.value,
            activeTabName: activeTabName,
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    // panes for mobile view
    onTabClick(activeTabName) {
        const collapseTabs = this.state.windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const socialHistoryMobile =
            this.state.windowWidth < SOCIAL_HISTORY_MOBILE_BP;

        let tabToDisplay;
        switch (activeTabName) {
            case 'Medical History':
                tabToDisplay = <MedicalHistoryContent mobile={collapseTabs} />;
                break;
            case 'Surgical History':
                tabToDisplay = <SurgicalHistoryContent mobile={collapseTabs} />;
                break;
            case 'Medications':
                tabToDisplay = <MedicationsContent mobile={collapseTabs} />;
                break;
            case 'Allergies':
                tabToDisplay = <AllergiesContent mobile={collapseTabs} />;
                break;
            case 'Social History':
                tabToDisplay = (
                    <SocialHistoryContent mobile={socialHistoryMobile} />
                );
                break;
            case 'Family History':
                tabToDisplay = <FamilyHistoryContent mobile={collapseTabs} />;
                break;
            default:
                tabToDisplay = <MedicalHistoryContent mobile={collapseTabs} />;
                break;
        }
        return tabToDisplay;
    }

    onNextClick() {
        this.setState((state) => {
            if (state.activeTabName === 'Medical History') {
                return {
                    activeTabName: 'Surgical History',
                };
            } else if (state.activeTabName === 'Surgical History') {
                return {
                    activeTabName: 'Medications',
                };
            } else if (state.activeTabName === 'Medications') {
                return {
                    activeTabName: 'Allergies',
                };
            } else if (state.activeTabName === 'Allergies') {
                return {
                    activeTabName: 'Social History',
                };
            } else if (state.activeTabName === 'Social History') {
                return {
                    activeTabName: 'Family History',
                };
            }
        });
    }

    // brings users to the previous form when clicked
    onPreviousClick() {
        this.setState((state) => {
            if (state.activeTabName === 'Surgical History') {
                return {
                    activeTabName: 'Medical History',
                };
            } else if (state.activeTabName === 'Medications') {
                return {
                    activeTabName: 'Surgical History',
                };
            } else if (state.activeTabName === 'Allergies') {
                return {
                    activeTabName: 'Medications',
                };
            } else if (state.activeTabName === 'Social History') {
                return {
                    activeTabName: 'Allergies',
                };
            } else if (state.activeTabName === 'Family History') {
                return {
                    activeTabName: 'Social History',
                };
            }
        });
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
                        <MedicalHistoryContent activeTabName='Medical History' />
                        <Button
                            icon
                            labelPosition='left'
                            floated='left'
                            className='patient-previous-button'
                            onClick={this.previousFormClick}
                        >
                            Previous Form
                            <Icon name='arrow left' />
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
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
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
                            <Icon name='arrow left' />
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
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Medications',
                render: () => (
                    <Tab.Pane>
                        <MedicationsContent activeTabName='Medications' />
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
                            <Icon name='arrow left' />
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
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Allergies',
                render: () => (
                    <Tab.Pane>
                        <AllergiesContent activeTabName='Allergies' />
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
                            <Icon name='arrow left' />
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
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
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
                            <Icon name='arrow left' />
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
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
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
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            onClick={this.nextFormClick}
                        >
                            Next Form
                            <Icon name='arrow right' />
                        </Button>
                    </Tab.Pane>
                ),
            },
        ];

        const gridButtons = panes.map((pane, index) => {
            return (
                <Button
                    basic
                    key={index}
                    // eslint-disable-next-line react/no-children-prop
                    children={pane.menuItem}
                    onClick={this.handleItemClick}
                    active={activeTabName === pane.menuItem}
                    style={{ marginBottom: 5 }}
                />
            );
        });

        const tabToDisplay = this.onTabClick(this.state.activeTabName);

        return (
            <>
                {collapseTabs ? (
                    <Container>
                        <Grid
                            stackable
                            centered
                            id='patient-history-menu'
                            relaxed
                        >
                            {gridButtons}
                        </Grid>
                        <Segment>{tabToDisplay}</Segment>
                        {activeTabName === 'Medical History' ? (
                            <>
                                <Button
                                    icon
                                    floated='left'
                                    onClick={this.previousFormClick}
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.onNextClick}
                                    className='small-patient-next-button'
                                >
                                    <Icon name='arrow right' />
                                </Button>
                            </>
                        ) : (
                            ''
                        )}

                        {activeTabName === 'Family History' ? (
                            <>
                                <Button
                                    icon
                                    floated='left'
                                    onClick={this.onPreviousClick}
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.nextFormClick}
                                    className='small-patient-next-button'
                                >
                                    <Icon name='arrow right' />
                                </Button>
                            </>
                        ) : (
                            ''
                        )}
                        {activeTabName === 'Social History' ||
                        activeTabName === 'Allergies' ||
                        activeTabName === 'Medications' ||
                        activeTabName === 'Surgical History' ? (
                            <>
                                <Button
                                    icon
                                    floated='left'
                                    onClick={this.onPreviousClick}
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.onNextClick}
                                    className='small-patient-next-button'
                                >
                                    <Icon name='arrow right' />
                                </Button>
                            </>
                        ) : (
                            ''
                        )}
                    </Container>
                ) : (
                    <Tab
                        menu={{
                            pointing: true,
                            id: 'patient-history-menu',
                        }}
                        id='tab-panes'
                        panes={panes}
                        activeIndex={activeIndex}
                        onTabChange={this.handleTabChange}
                    />
                )}
            </>
        );
    }
}

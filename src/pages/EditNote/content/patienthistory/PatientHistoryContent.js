import React, { Component } from 'react';
import { Button, Container, Grid, Tab, Segment, Icon } from 'semantic-ui-react';
import MedicalHistoryContent from '../medicalhistory/MedicalHistoryContent';
import SurgicalHistoryContent from '../surgicalhistory/SurgicalHistoryContent';
import MedicationsContent from '../medications/MedicationsContent';
import AllergiesContent from '../allergies/AllergiesContent';
import SocialHistoryContent from '../socialhistory/SocialHistoryContent';
import FamilyHistoryContent from '../familyhistory/FamilyHistoryContent';
import './PatientHistory.css';
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';

export default class PatientHistoryContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            headerHeight: 0,
            activeTabName: this.props.activePMH, // Default open pane is Medical History
            activeIndex: this.props.pmhIndex,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        //this.updateIndex = this.updateIndex.bind(this);
        this.setMenuPosition = this.setMenuPosition.bind(this);
        //this.onNextClick = this.onNextClick.bind(this);
        //this.onPreviousClick = this.onPreviousClick.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
        //this.updateIndex();
        // Using timeout to ensure that tab/dropdown menu and any relevant headers are rendered before setting
        setTimeout(() => {
            this.setMenuPosition();
            this.props.setStickyHeaders();
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
        this.props.setStickyHeaders();
    }

    setMenuPosition() {
        const fixedMenu = document.getElementById('patient-history-menu');
        if (fixedMenu != null) {
            fixedMenu.style.top = `${this.state.headerHeight}px`;
        }
    }

    handleItemClick = (e, { children }) => {
        this.setState({ activeTabName: children });
    };

    render() {
        const { windowWidth } = this.state;
        const activeTabName = this.props.activePMH;
        const activeIndex = this.props.activeIndex;
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
                            onClick={this.props.previousFormClick}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            value={1}
                            activeTabName='Surgical History'
                            onClick={this.props.handleNextTab}
                        >
                            Next
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
                            onClick={this.props.handlePrevTab}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            value={2}
                            activeTabName='Medications'
                            onClick={this.props.handleNextTab}
                        >
                            Next
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
                            onClick={this.props.handlePrevTab}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            value={3}
                            activeTabName='Allergies'
                            onClick={this.props.handleNextTab}
                        >
                            Next
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
                            onClick={this.props.handlePrevTab}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            value={4}
                            activeTabName='Social History'
                            onClick={this.props.handleNextTab}
                        >
                            Next
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
                            onClick={this.props.handlePrevTab}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            value={5}
                            activeTabName='Family History'
                            onClick={this.props.handleNextTab}
                        >
                            Next
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
                            onClick={this.props.handlePrevTab}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>

                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            className='patient-next-button'
                            onClick={this.props.nextFormClick}
                        >
                            Next
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
                    active={this.state.activeTabName === pane.menuItem}
                    style={{ marginBottom: 5 }}
                />
            );
        });
        const tabToDisplay = this.props.onTabClick(
            this.state.activeTabName,
            this.state.windowWidth
        );
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
                                    onClick={this.props.previousFormClick}
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={(activeTabName) =>
                                        this.props.onNextClick(activeTabName)
                                    }
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
                                    onClick={(activeTabName) =>
                                        this.props.onPreviousClick(
                                            activeTabName
                                        )
                                    }
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.props.nextFormClick}
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
                                    onClick={(activeTabName) =>
                                        this.props.onPreviousClick(
                                            activeTabName
                                        )
                                    }
                                    className='small-patient-previous-button'
                                >
                                    <Icon name='arrow left' />
                                </Button>

                                <Button
                                    icon
                                    floated='right'
                                    onClick={(activeTabName) =>
                                        this.props.onNextClick(activeTabName)
                                    }
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
                        onTabChange={this.props.handleTabChange}
                    />
                )}
            </>
        );
    }
}

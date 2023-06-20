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
import constants from 'constants/constants';

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
        this.setMenuPosition = this.setMenuPosition.bind(this);
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
    /**This revised function accepts a mobile tab's button's children and value and changes the state.
     * By changing the state, it will call upon the onTabClick function call changing the tab. */
    handleItemClick = (e, { children, value }) => {
        this.setState({ activeTabName: children, activeIndex: value });
    };

    /** This function accepts a button's activeTabName (whether it be the next/previous tabname) and value and changes
     * the state. By changing the state, It will call upon the Tab component's activeIndex function call changing tabs */
    handleTabChange = (e, { activeTabName, value }) => {
        this.setState({
            activeTabName: activeTabName,
            activeIndex: value,
        });
        this.props.handlePMHTabChange(e, { activeIndex: value });
    };

    render() {
        const { windowWidth } = this.state;
        const activeTabName = this.state.activeTabName;
        const activeIndex = this.state.activeIndex;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        const tabDict = {
            'Medical History': (
                <MedicalHistoryContent activeTabName='Medical History' />
            ),
            'Surgical History': (
                <SurgicalHistoryContent activeTabName='Surgical History' />
            ),
            Medications: (
                <MedicationsContent
                    activeTabName='Medications'
                    singleType={false}
                />
            ),
            Allergies: <AllergiesContent activeTabName='Allergies' />,
            'Social History': (
                <SocialHistoryContent activeTabName='Social History' />
            ),
            'Family History': (
                <FamilyHistoryContent activeTabName='Family History' />
            ),
        };

        const buttons = Object.keys(tabDict).map((_name, index) => {
            return (
                <>
                    <Button
                        icon
                        labelPosition='left'
                        floated='left'
                        className='patient-previous-button'
                        activeTabName={
                            index == 0
                                ? undefined
                                : Object.keys(tabDict)[index - 1]
                        }
                        onClick={
                            index == 0
                                ? this.props.previousFormClick
                                : this.handleTabChange
                        }
                        value={index == 0 ? undefined : index - 1}
                    >
                        Prev
                        <Icon name='arrow left' />
                    </Button>
                    <Button
                        icon
                        floated='left'
                        className='small-patient-previous-button'
                        activeTabName={
                            index == 0
                                ? undefined
                                : Object.keys(tabDict)[index - 1]
                        }
                        onClick={
                            index == 0
                                ? this.props.previousFormClick
                                : this.handleTabChange
                        }
                        value={index == 0 ? undefined : index - 1}
                    >
                        <Icon name='arrow left' />
                    </Button>

                    <Button
                        icon
                        labelPosition='right'
                        floated='right'
                        activeTabName={
                            index == Object.keys(tabDict).length - 1
                                ? undefined
                                : Object.keys(tabDict)[index + 1]
                        }
                        value={
                            index == Object.keys(tabDict).length - 1
                                ? undefined
                                : index + 1
                        }
                        onClick={
                            index == Object.keys(tabDict).length - 1
                                ? this.props.nextFormClick
                                : this.handleTabChange
                        }
                        className='patient-next-button'
                    >
                        Next
                        <Icon name='arrow right' />
                    </Button>
                    <Button
                        icon
                        floated='right'
                        activeTabName={
                            index == Object.keys(tabDict).length - 1
                                ? undefined
                                : Object.keys(tabDict)[index + 1]
                        }
                        value={
                            index == Object.keys(tabDict).length - 1
                                ? undefined
                                : index + 1
                        }
                        onClick={
                            index == Object.keys(tabDict).length - 1
                                ? this.props.nextFormClick
                                : this.handleTabChange
                        }
                        className='small-patient-next-button'
                    >
                        <Icon name='arrow right' />
                    </Button>
                </>
            );
        });

        // panes for desktop view
        const panes = Object.keys(tabDict).map((name, index) => {
            return {
                menuItem: name,
                render: () => (
                    <Tab.Pane className='white-card'>
                        {tabDict[name]}
                        {buttons[index]}
                    </Tab.Pane>
                ),
            };
        });

        const gridButtons = panes.map((pane, index) => {
            return (
                <Button
                    basic
                    key={index}
                    // eslint-disable-next-line react/no-children-prop
                    children={pane.menuItem}
                    value={index}
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
                        {buttons[activeIndex]}
                    </Container>
                ) : (
                    <Tab
                        menu={{
                            pointing: true,
                            id: 'patient-history-menu',
                        }}
                        id='tab-panes'
                        panes={panes}
                        activeTabName={activeTabName}
                        activeIndex={activeIndex}
                        index={activeIndex}
                        onTabChange={(e, data) => {
                            this.setState({
                                activeTabName:
                                    constants.PMH_TAB_NAMES[data.activeIndex],
                                activeIndex: data.activeIndex,
                            });
                            this.props.handlePMHTabChange(e, data);
                        }}
                    />
                )}
            </>
        );
    }
}

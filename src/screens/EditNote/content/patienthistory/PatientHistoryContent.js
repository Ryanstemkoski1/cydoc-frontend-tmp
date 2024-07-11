import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import constants from 'constants/constants';
import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Tab from '@components/tools/Tab';
import AllergiesContent from '../allergies/AllergiesContent';
import FamilyHistoryContent from '../familyhistory/FamilyHistoryContent';
import MedicalHistoryContent from '../medicalhistory/MedicalHistoryContent';
import MedicationsContent from '../medications/MedicationsContent';
import SocialHistoryContent from '../socialhistory/SocialHistoryContent';
import SurgicalHistoryContent from '../surgicalhistory/SurgicalHistoryContent';
import './PatientHistory.css';

export default class PatientHistoryContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 0,
            activeTabName: this.props.activePMH, // Default open pane is Medical History
            activeIndex: this.props.pmhIndex,
        };
        this.handleItemClick = this.handleItemClick.bind(this);
        this.setMenuPosition = this.setMenuPosition.bind(this);
    }

    componentDidMount() {
        //this.updateIndex();
        // Using timeout to ensure that tab/dropdown menu and any relevant headers are rendered before setting
        setTimeout(() => {
            this.setMenuPosition();
            this.props.setStickyHeaders();
        }, 0);
    }

    updateDimensions = () => {
        let headerHeight =
            document.getElementById('stickyHeader')?.offsetHeight ?? 0;

        this.setState({ headerHeight });
        this.setMenuPosition();
        this.props.setStickyHeaders();
    };

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
        const activeTabName = this.state.activeTabName;
        const activeIndex = this.state.activeIndex;

        const tabDict = {
            'Medical History': (
                <MedicalHistoryContent
                    activeTabName='Medical History'
                    showNo={true}
                />
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
                    <NavigationButton
                        previousClick={(e) => {
                            index === 0
                                ? this.props.previousFormClick(e)
                                : this.handleTabChange(e, {
                                      activeTabName:
                                          Object.keys(tabDict)[index - 1],
                                      value: index - 1,
                                  });
                        }}
                        nextClick={(e) => {
                            index == Object.keys(tabDict).length - 1
                                ? this.props.nextFormClick(e)
                                : this.handleTabChange(e, {
                                      activeTabName:
                                          Object.keys(tabDict)[index + 1],
                                      value: index + 1,
                                  });
                        }}
                    />
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

        const tabToDisplay = this.props.onTabClick(this.state.activeTabName);
        return (
            <>
                {
                    <>
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
                                        constants.PMH_TAB_NAMES[
                                            data.activeIndex
                                        ],
                                    activeIndex: data.activeIndex,
                                });
                                this.props.handlePMHTabChange(e, data);
                            }}
                        />
                        <Segment>{tabToDisplay}</Segment>
                        {buttons[activeIndex]}
                    </>
                }
            </>
        );
    }
}

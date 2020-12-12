import React, { Component, Fragment } from 'react';
import { Button, Container, Grid, Tab, Segment } from 'semantic-ui-react';
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
      activeTabName: 'Medical History', // Default open pane is Medical History
      activeIndex: 0,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    // Using timeout to ensure that tab/dropdown menu is rendered before setting
    setTimeout((_event) => {
      this.setMenuPosition();
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    let windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    this.setState({ windowWidth, windowHeight });
    this.setMenuPosition();
  }

  setMenuPosition() {
    const stickyHeaderHeight = document.getElementById('stickyHeader')
      .offsetHeight;
    // Ensuring that the patient history tabs are rendered
    while (this.fixedMenu == null || this.fixedMenu.length == 0) {
      this.fixedMenu = document.getElementsByClassName('patient-history-menu');
    }
    this.fixedMenu[0].style.top = `${stickyHeaderHeight}px`;
  }

  handleItemClick = (children, paneNames) => {
    this.setState({
      activeTabName: children,
      activeIndex: paneNames.findIndex((p) => {
        return p === children;
      }),
    });
  };

  handleTabChange = (activeIndex, paneNames) => {
    this.setState({
      activeIndex,
      activeTabName: paneNames.filter((p) => {
        return p === paneNames[activeIndex];
      }),
    });
  };
  
  render() {
    const { windowWidth, activeTabName, activeIndex } = this.state;

    const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
    const socialHistoryMobile = windowWidth < SOCIAL_HISTORY_MOBILE_BP;

    // If more panes are needed, then add to this array and the array in the constructor.
    // All other arrays needed for rendering are automatically constructed.
    const panes = [
      {
        menuItem: 'Medical History',
        content: <MedicalHistoryContent mobile={collapseTabs} />,
      },
      {
        menuItem: 'Surgical History',
        content: <SurgicalHistoryContent mobile={collapseTabs} />,
      },
      {
        menuItem: 'Medications',
        content: <MedicationsContent mobile={collapseTabs} />,
      },
      {
        menuItem: 'Allergies',
        content: <AllergiesContent mobile={collapseTabs} />,
      },
      {
        menuItem: 'Social History',
        content: <SocialHistoryContent mobile={socialHistoryMobile} />,
      },
      {
        menuItem: 'Family History',
        content: <FamilyHistoryContent mobile={collapseTabs} />,
      },
    ];

    const paneNames = panes.map((pane) => pane.menuItem);

    const expandedPanes = panes.map((pane) => {
      return {
        menuItem: pane.menuItem,
        render: () => <Tab.Pane attached={false}>{pane.content}</Tab.Pane>,
      };
    });

    const compactPanes = panes.map((pane) => {
      return {
        menuItem: pane.menuItem,
        render: () => <Segment> {pane.content} </Segment>,
      };
    });

    const gridButtons = panes.map((pane) => {
      return (
        <Button
          basic
          children={pane.menuItem}
          onClick={(_, {children}) => this.handleItemClick(children, paneNames)}
          active={activeTabName == pane.menuItem}
          style={{ marginBottom: 5 }}
        />
      );
    });

    return (
      <>
        {collapseTabs ? (
          <Container>
            <Grid
              stackable
              centered
              className={'patient-history-menu'}
              relaxed
              style={{ paddingTop: 10, paddingBottom: 5 }}
            >
              {gridButtons}
            </Grid>
            {compactPanes[activeIndex].render()}
          </Container>
        ) : (
          <Tab
            menu={{ pointing: true, className: 'patient-history-menu' }}
            panes={expandedPanes}
            activeIndex={activeIndex}
            onTabChange={(_, {activeIndex}) => this.handleTabChange(activeIndex, paneNames)}
          />
        )}
      </>
    );
  }
}

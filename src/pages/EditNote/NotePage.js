import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PhysicalExamContent from './content/physicalexam/PhysicalExamContent';
import ReviewOfSystemsContent from './content/reviewofsystems/ReviewOfSystemsContent';
import HPIContent from './content/hpi/knowledgegraph/HPIContent';
import PatientHistoryContent from './content/patienthistory/PatientHistoryContent';
import GenerateNote from './content/generatenote/GenerateNote.tsx';
import DiscussionPlan from './content/discussionplan/DiscussionPlan.tsx';

import './NotePage.css';

//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        //bind methods
        this.updateDimensions = this.updateDimensions.bind(this);
        //initialize state
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    nextFormClick = () => this.props.onNextClick();

    previousFormClick = () => this.props.onPreviousClick();

    getTabToDisplay(activeItem) {
        //Instantiates and returns the correct content component based on the active tab
        //passes in the corresponding handler and values prop
        let tabToDisplay;
        switch (activeItem) {
            case 'HPI':
                tabToDisplay = (
                    <HPIContent nextFormClick={this.nextFormClick} />
                );
                break;
            case 'Patient History':
                tabToDisplay = (
                    <PatientHistoryContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            case 'Physical Exam':
                tabToDisplay = (
                    <PhysicalExamContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            case 'Review of Systems':
                tabToDisplay = (
                    <ReviewOfSystemsContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            case 'Generated Note':
                tabToDisplay = (
                    <GenerateNote previousFormClick={this.previousFormClick} />
                );
                break;
            case 'Plan':
                tabToDisplay = (
                    <DiscussionPlan
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            default:
                tabToDisplay = (
                    <HPIContent nextFormClick={this.nextFormClick} />
                );
                break;
        }
        return tabToDisplay;
    }

    render() {
        //get content based on which tab is active
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);

        return (
            <Container className='active-tab-container'>
                {tabToDisplay}
            </Container>
        );
    }
}

NotePage.propTypes = {
    activeItem: PropTypes.string,
};

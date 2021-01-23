import React, { Component } from 'react';
import { Menu, Button, Segment, Icon } from 'semantic-ui-react';
import Masonry from 'react-masonry-css';
import './src/css/App.css';
import ButtonItem from './src/components/ButtonItem.js';
import PositiveDiseases from './src/components/PositiveDiseases';
import DiseaseForm from './src/components/DiseaseForm';
import { hpiHeaders } from './src/API';
import HPIContext from 'contexts/HPIContext.js';
import './HPI.css';
import { ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP } from 'constants/breakpoints';

class HPIContent extends Component {
    static contextType = HPIContext;
    constructor(context) {
        super(context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            headerHeight: 0,
            bodySystems: {},
            parentNodes: {},
            isLoaded: false,
            children: [],
            activeTabName: '',
            categoryCodes: {},
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.setMenuPosition = this.setMenuPosition.bind(this);
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI,
        // organizes parent nodes by their category code (medical condition) and body system
        const data = hpiHeaders;
        data.then((res) =>
            this.setState({
                isLoaded: true,
                bodySystems: res.data.bodySystems,
                parentNodes: res.data.parentNodes,
            })
        );
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
        window.addEventListener('scroll', this.setMenuPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
        window.removeEventListener('scroll', this.setMenuPosition);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;
        let headerHeight =
            document.getElementById('stickyHeader')?.offsetHeight ?? 0;

        this.setState({ windowWidth, windowHeight, headerHeight });
        this.setMenuPosition();
    }

    setMenuPosition() {
        let fixedMenu = document.getElementById('disease-menu');
        // Ensuring that the hpi tabs are rendered
        if (fixedMenu != null) {
            fixedMenu.style.top = `${this.state.headerHeight}px`;
            window.removeEventListener('scroll', this.setMenuPosition);
        }
    }

    // Proceed to next step
    nextStep = () => {
        let currentStep = this.context['step'];
        this.context.onContextChange('step', currentStep + 1);
        this.context.onContextChange(
            'activeHPI',
            this.context['positivediseases'][currentStep - 1]
        );
    };

    // Go back to previous step
    prevStep = () => {
        let currentStep = this.context['step'];
        this.context.onContextChange('step', currentStep - 1);
        this.context.onContextChange(
            'activeHPI',
            this.context['positivediseases'][currentStep - 3]
        );
    };

    // go to the next page (change step = step + 1)
    continue = (e) => {
        e.preventDefault();
        this.nextStep();
        window.scrollTo(0, 0);
    };

    // go to previous page (change step = step - 1)
    back = (e) => {
        e.preventDefault();
        this.prevStep();
        window.scrollTo(0, 0);
    };

    // responds to tabs - the clicked tab's name will be indexed from the list of positive diseases and
    // corresponds to its step - 2. The page will then change to the clicked tab's corresponding disease
    // category and the active tab will change to that as well.
    handleItemClick = (_e, { name }) => {
        this.context.onContextChange(
            'step',
            this.context['positivediseases'].indexOf(name) + 2
        );
        this.context.onContextChange('activeHPI', name);
        setTimeout(() => {
            window.scrollTo(0, 0);
            this.setMenuPosition();
        }, 0);
    };

    nextFormClick = () => {
        this.props.nextFormClick();
        window.localStorage.setItem('activeIndex', 0);
        window.localStorage.setItem('activeTabName', 'Medical History');
    };

    render() {
        const { parentNodes, isLoaded, windowWidth, bodySystems } = this.state;

        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        /* Creates list of body system buttons to add in the front page.
           Loops through state variable, bodySystems, saved from the API */
        const diseaseComponents = Object.keys(bodySystems).map((bodySystem) => (
            <ButtonItem
                key={bodySystem} // name of body system
                name={bodySystem}
                diseasesList={bodySystems[bodySystem]} // list of categories (diseases) associated with current body system
            />
        ));
        // diseases that the user has chosen
        // Creates list of category buttons clicked by the user (categories/diseases for which they are positive)
        // Loops through the HPI context storing which categories user clicked in the front page
        // (categories/diseases for which they are positive)
        const positiveDiseases = this.context[
            'positivediseases'
        ].map((disease) => <PositiveDiseases key={disease} name={disease} />);
        // tabs with the diseases the user has chosen
        // Loops through HPI context storing which categories user clicked in front page
        const diseaseTabs = this.context['positivediseases'].map(
            (name, index) => (
                <Menu.Item
                    key={index}
                    name={name}
                    /* if the current category in the for loop matches the active category (this.context['activeHPI']),
                the menu item is marked as active, meaning it will be displayed as clicked (pressed down) */
                    active={this.context['activeHPI'] === name}
                    onClick={this.handleItemClick}
                    className='disease-tab' // CSS
                />
            )
        );
        // each step correlates to a different tab
        let step = this.context['step'];
        // number of positive diseases, which is also the nnumber of steps
        const positiveLength = this.context['positivediseases'].length;

        // window/screen responsiveness
        let numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 4;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }

        // depending on the current step, we switch to a different view
        switch (step) {
            case 1:
                return (
                    // if the user has chosen any diseases (positiveLength > 0), then the right button can be displayed
                    // to advance to other pages of the HPI form
                    <>
                        <Segment>
                            {positiveLength > 0 ? (
                                positiveDiseases
                            ) : (
                                <div className='positive-diseases-placeholder' />
                            )}
                            <Masonry
                                className='disease-container'
                                breakpointCols={numColumns}
                                columnClassName='disease-column'
                            >
                                {diseaseComponents}
                            </Masonry>
                        </Segment>
                        {positiveLength > 0 ? (
                            <>
                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.continue}
                                    className='hpi-small-next-button'
                                >
                                    <Icon name='arrow right' />
                                </Button>
                                <Button
                                    icon
                                    labelPosition='right'
                                    floated='right'
                                    onClick={this.continue}
                                    className='hpi-next-button'
                                >
                                    Next
                                    <Icon name='arrow right' />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    icon
                                    floated='right'
                                    onClick={this.nextFormClick}
                                    className='hpi-small-next-button'
                                >
                                    <Icon name='arrow right' />
                                </Button>
                                <Button
                                    icon
                                    labelPosition='right'
                                    floated='right'
                                    onClick={this.nextFormClick}
                                    className='hpi-next-button'
                                >
                                    Next
                                    <Icon name='arrow right' />
                                </Button>
                            </>
                        )}
                    </>
                );
            default:
                // if API data is loaded, render the DiseaseForm
                if (isLoaded) {
                    let category = this.context['positivediseases'][step - 2];
                    let parentNode =
                        parentNodes[category][
                            Object.keys(parentNodes[category])[0]
                        ];
                    return (
                        <div className='hpi-disease-container'>
                            <DiseaseForm
                                key={parentNode}
                                parentNode={parentNode}
                                category={category}
                                diseaseTabs={diseaseTabs}
                                windowWidth={windowWidth}
                            />
                            {step === positiveLength + 1 ? (
                                <>
                                    <Button
                                        icon
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-small-previous-button'
                                    >
                                        <Icon name='arrow left' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='left'
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-previous-button'
                                    >
                                        Previous
                                        <Icon name='arrow left' />
                                    </Button>

                                    <Button
                                        icon
                                        floated='right'
                                        onClick={this.nextFormClick}
                                        className='hpi-small-next-button'
                                    >
                                        <Icon name='arrow right' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='right'
                                        floated='right'
                                        onClick={this.nextFormClick}
                                        className='hpi-next-button'
                                    >
                                        Next
                                        <Icon name='arrow right' />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        icon
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-small-previous-button'
                                    >
                                        <Icon name='arrow left' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='left'
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-previous-button'
                                    >
                                        Previous
                                        <Icon name='arrow left' />
                                    </Button>

                                    <Button
                                        icon
                                        floated='right'
                                        onClick={this.continue}
                                        className='hpi-small-next-button'
                                    >
                                        <Icon name='arrow right' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='right'
                                        floated='right'
                                        onClick={this.continue}
                                        className='hpi-next-button'
                                    >
                                        Next
                                        <Icon name='arrow right' />
                                    </Button>
                                </>
                            )}
                        </div>
                    );
                } else {
                    // if API data is not yet loaded, show loading screen
                    return <h1> Loading... </h1>;
                }
        }
    }
}

export default HPIContent;

import React from 'react';
import {
    Menu,
    Button,
    Segment,
    Icon,
    MenuItemProps,
    Dropdown,
} from 'semantic-ui-react';
import Masonry from 'react-masonry-css';
import './src/css/App.css';
import BodySystemDropdown from './src/components/BodySystemDropdown';
import DiseaseForm from './src/components/DiseaseForm';
import { hpiHeaders } from './src/API';
import './HPI.css';
import {
    ROS_LARGE_BP,
    ROS_MED_BP,
    ROS_SMALL_BP,
    DISEASE_TABS_SMALL_BP,
    DISEASE_TABS_MED_BP,
} from 'constants/breakpoints';
import { BodySystemNames, DoctorView } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ChiefComplaintsButton from './src/components/ChiefComplaintsButton';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';

interface HPIContentProps {
    nextFormClick: () => () => string; // this.props.nextFormClick => this.props.onNextClick => string
}

interface HPIContentState {
    windowWidth: number;
    windowHeight: number;
    bodySystems: { [bodySystem: string]: DoctorView[] };
    parentNodes: { [disease: string]: { [diseaseCode: string]: string } };
    isGraphLoaded: boolean;
    activeHPI: DoctorView | '';
    step: number;
}

class HPIContent extends React.Component<Props, HPIContentState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            bodySystems: {},
            parentNodes: {},
            isGraphLoaded: false,
            activeHPI: '', // active tab name
            step: -1, // step in the HPI interview form
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI,
        // organizes parent nodes by their category code (medical condition) and body system
        const data = hpiHeaders;
        data.then((res) =>
            this.setState({
                isGraphLoaded: true,
                bodySystems: res.data.bodySystems,
                parentNodes: res.data.parentNodes,
            })
        );
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    // go to the next page (change step = step + 1)
    continue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { step } = this.state;
        e.preventDefault();
        const currentStep: number = step;
        this.setState({
            step: currentStep + 1,
            activeHPI: this.props.chiefComplaints[currentStep + 1],
        });
        window.scrollTo(0, 0);
    };

    // go to previous page (change step = step - 1)
    back = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { step } = this.state;
        e.preventDefault();
        const currentStep: number = step;
        this.setState({
            step: currentStep - 1,
            activeHPI: this.props.chiefComplaints[currentStep - 1],
        });
        window.scrollTo(0, 0);
    };

    // responds to tabs - the clicked tab's name will be indexed from the list of selected diseases and
    // corresponds to its step. The page will then change to the clicked tab's corresponding disease
    // category and the active tab will change to that as well.
    handleItemClick = (
        _e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        data: MenuItemProps
    ) => {
        this.setState({
            step: this.props.chiefComplaints.indexOf(data.diseasecategory),
            activeHPI: data.diseasecategory,
        });
    };

    nextFormClick = () => this.props.nextFormClick();

    render() {
        const {
            isGraphLoaded,
            windowWidth,
            bodySystems,
            parentNodes,
        } = this.state;
        const { chiefComplaints } = this.props;
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        /* Creates list of body system buttons to add in the front page. 
           Loops through state variable, bodySystems, saved from the API */
        const diseaseComponents = Object.entries(bodySystems).map(
            ([bodySystem, diseasesList]) => (
                <BodySystemDropdown
                    key={bodySystem} // name of body system
                    name={bodySystem as BodySystemNames}
                    diseasesList={diseasesList.sort()} // list of categories (diseases) associated with current body system
                />
            )
        );

        // try to deprecate
        // diseases that the user has chosen
        // Creates list of category buttons clicked by the user (categories/diseases for which they are positive)
        // Loops through the HPI context storing which categories user clicked in the front page
        // (categories/diseases for which they are positive)
        const positiveDiseases: JSX.Element[] = chiefComplaints.map(
            (name: DoctorView) => (
                <ChiefComplaintsButton key={name} name={name} />
            )
        );

        // tabs with the diseases the user has chosen
        // Loops through HPI context storing which categories user clicked in front page
        const diseaseTabs: JSX.Element[] = chiefComplaints.map(
            (diseaseCategory: DoctorView) => (
                <Menu.Item
                    key={diseaseCategory}
                    diseasecategory={diseaseCategory}
                    /* if the current category in the for loop matches the active category, 
                the menu item is marked as active, meaning it will be displayed as clicked (pressed down) */
                    active={this.state.activeHPI === diseaseCategory}
                    onClick={this.handleItemClick}
                    className='disease-tab' // CSS
                >
                    {diseaseCategory}
                </Menu.Item>
            )
        );

        // each step correlates to a different tab
        const step: number = this.state.step;
        // number of positive diseases, which is also the number of steps
        const positiveLength: number = positiveDiseases.length;

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
            case -1:
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
                                    <Icon name='angle right' />
                                </Button>
                                <Button
                                    icon
                                    labelPosition='right'
                                    floated='right'
                                    onClick={this.continue}
                                    className='hpi-next-button'
                                >
                                    Next Form
                                    <Icon name='angle right' />
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
                                    <Icon name='angle right' />
                                </Button>
                                <Button
                                    icon
                                    labelPosition='right'
                                    floated='right'
                                    onClick={this.nextFormClick}
                                    className='hpi-next-button'
                                >
                                    Next Form
                                    <Icon name='angle right' />
                                </Button>
                            </>
                        )}
                    </>
                );
            default:
                // if API data is loaded, render the DiseaseForm
                if (isGraphLoaded) {
                    const diseaseCategory = chiefComplaints[step];
                    const parentNode: string =
                        parentNodes[diseaseCategory][
                            Object.keys(parentNodes[diseaseCategory])[0]
                        ];
                    const collapseTabs =
                        diseaseTabs.length >= 10 ||
                        (diseaseTabs.length >= 5 &&
                            windowWidth < DISEASE_TABS_MED_BP) ||
                        windowWidth < DISEASE_TABS_SMALL_BP;
                    return (
                        <div className='hpi-disease-container'>
                            {collapseTabs ? (
                                <Dropdown
                                    text={diseaseCategory}
                                    options={diseaseTabs}
                                    selection
                                    fluid
                                    scrolling={false}
                                />
                            ) : (
                                <Menu
                                    tabular
                                    borderless
                                    items={diseaseTabs}
                                    className='disease-menu'
                                />
                            )}
                            <DiseaseForm
                                key={parentNode}
                                parentNode={parentNode}
                                category={diseaseCategory}
                                nextStep={this.continue}
                                prevStep={this.back}
                            />
                            {step === positiveLength - 1 ? (
                                <>
                                    <Button
                                        icon
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-small-previous-button'
                                    >
                                        <Icon name='angle left' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='left'
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-previous-button'
                                    >
                                        Previous Form
                                        <Icon name='angle left' />
                                    </Button>

                                    <Button
                                        icon
                                        floated='right'
                                        onClick={this.nextFormClick}
                                        className='hpi-small-next-button'
                                    >
                                        <Icon name='angle right' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='right'
                                        floated='right'
                                        onClick={this.nextFormClick}
                                        className='hpi-next-button'
                                    >
                                        Next Form
                                        <Icon name='angle right' />
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
                                        <Icon name='angle left' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='left'
                                        floated='left'
                                        onClick={this.back}
                                        className='hpi-previous-button'
                                    >
                                        Previous Form
                                        <Icon name='angle left' />
                                    </Button>

                                    <Button
                                        icon
                                        floated='right'
                                        onClick={this.continue}
                                        className='hpi-small-next-button'
                                    >
                                        <Icon name='angle right' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='right'
                                        floated='right'
                                        onClick={this.continue}
                                        className='hpi-next-button'
                                    >
                                        Next Form
                                        <Icon name='angle right' />
                                    </Button>
                                </>
                            )}
                        </div>
                    );
                }
                // if API data is not yet loaded, show loading screen
                else {
                    return <h1> Loading... </h1>;
                }
        }
    }
}

const mapStateToProps = (state: CurrentNoteState): ChiefComplaintsProps => {
    return {
        chiefComplaints: state.chiefComplaints,
    };
};

export interface ChiefComplaintsProps {
    chiefComplaints: ChiefComplaintsState;
}

type Props = ChiefComplaintsProps & HPIContentProps;

export default connect(mapStateToProps)(HPIContent);

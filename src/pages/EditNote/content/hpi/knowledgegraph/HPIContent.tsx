import React from 'react';
import {
    Menu,
    Button,
    Segment,
    Icon,
    // MenuItemProps,
    // Dropdown,
    Search,
    Container,
    Grid,
    Tab,
    AccordionTitleProps,
    Accordion,
    Form,
    TextArea,
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
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ChiefComplaintsButton from './src/components/ChiefComplaintsButton';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';
import {
    setNotesChiefComplaint,
    SetNotesChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import { CHIEF_COMPLAINTS } from '../../../../../redux/actions/actionTypes';
import { currentNoteStore } from 'redux/store';
import { addCondition } from 'redux/actions/planActions';
import {
    PlanConditionsFlat,
    selectPlanConditions,
} from 'redux/selectors/planSelectors';

interface HPIContentProps {
    nextFormClick: () => () => string; // this.props.nextFormClick => this.props.onNextClick => string
}

interface HPIContentState {
    windowWidth: number;
    windowHeight: number;
    bodySystems: { [bodySystem: string]: string[] };
    parentNodes: { [disease: string]: { [diseaseCode: string]: string } };
    isGraphLoaded: boolean;
    activeHPI: string;
    step: number;
    searchVal: string;
    activeIndex: number;
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
            searchVal: '',
            activeIndex: 0, //misc notes box active
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        // this.handleItemClick = this.handleItemClick.bind(this);
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
            activeHPI: Object.keys(this.props.chiefComplaints)[
                currentStep + 1
            ] as string,
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
            activeHPI: Object.keys(this.props.chiefComplaints)[
                currentStep - 1
            ] as string,
        });
        window.scrollTo(0, 0);
    };

    nextFormClick = () => this.props.nextFormClick();

    // setStickyHeaders() {
    //     const stickyHeaders = document.getElementsByClassName('sticky-header');
    //     const patientHistoryMenu = document.getElementById(
    //         'patient-history-menu'
    //     );
    //     if (
    //         stickyHeaders != null &&
    //         stickyHeaders.length != 0 &&
    //         patientHistoryMenu != null
    //     ) {
    //         for (let i = 0; i < stickyHeaders.length; i++) {
    //             stickyHeaders[i].style.top = `${
    //                 parseInt(patientHistoryMenu.style.top) +
    //                 patientHistoryMenu.offsetHeight
    //             }px`;
    //         }
    //     }
    // }
    miscNotesClick = (
        _e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        titleProps: AccordionTitleProps
    ) => {
        const { activeIndex } = this.state;
        const newIndex =
            activeIndex === titleProps.index
                ? -1
                : (titleProps.index as number);
        this.setState({ activeIndex: newIndex });
    };

    render() {
        const {
            isGraphLoaded,
            windowWidth,
            bodySystems,
            parentNodes,
            activeHPI,
        } = this.state;
        const { chiefComplaints, setNotesChiefComplaint } = this.props;
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        /* Creates list of body system buttons to add in the front page. 
           Loops through state variable, bodySystems, saved from the API */
        const diseaseComponents = Object.entries(bodySystems).map(
            ([bodySystem, diseasesList]) => (
                <BodySystemDropdown
                    key={bodySystem} // name of body system
                    name={bodySystem}
                    diseasesList={diseasesList.sort()} // list of categories (diseases) associated with current body system
                />
            )
        );

        // try to deprecate
        // diseases that the user has chosen
        // Creates list of category buttons clicked by the user (categories/diseases for which they are positive)
        // Loops through the HPI context storing which categories user clicked in the front page
        // (categories/diseases for which they are positive)
        const positiveDiseases: JSX.Element[] = Object.keys(
            chiefComplaints
        ).map((disease) => (
            <ChiefComplaintsButton key={disease} name={disease as string} />
        ));

        // map through all complaints on the HPI and create search resuls
        const getRes = () => {
            const index = this.state.searchVal.length;
            const filterResults: object[] = [];
            Object.entries(bodySystems).forEach((grouping) => {
                grouping[1].forEach((complaint) => {
                    const toCompare = complaint.toString().toLowerCase();
                    if (
                        complaint !== 'HIDDEN' &&
                        toCompare.includes(this.state.searchVal.toLowerCase())
                    ) {
                        const temp = {
                            title: complaint,
                            onClick: () => {
                                currentNoteStore.dispatch({
                                    type:
                                        CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                                    payload: {
                                        disease: complaint,
                                    },
                                });
                            },
                        };
                        filterResults.push(temp);
                    }
                });
            });
            return filterResults;
        };

        // This is the abstraction of the misc box.
        // It takes in a string because the two renders called the diseases that were active different things,
        // one called it diseaseCategories and another called it activeHPI.

        const miscBox = (activeThing: string) => {
            return (
                <Accordion className='hpi-text-drop'>
                    <Accordion.Title
                        className='white-important'
                        active={this.state.activeIndex === 0}
                        index={0}
                        onClick={this.miscNotesClick}
                    >
                        <Icon className='white-important' name='dropdown' />
                        Misc Notes&nbsp;&nbsp;&nbsp;&nbsp;
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 0}>
                        <Form>
                            <TextArea
                                className='misc-box'
                                rows={3}
                                onChange={(_e, { value }) => {
                                    setNotesChiefComplaint(
                                        activeThing as string,
                                        value
                                    );
                                }}
                                value={chiefComplaints[activeThing]}
                            />
                        </Form>
                    </Accordion.Content>
                </Accordion>
            );
        };

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

        const collapseTabs =
            Object.keys(chiefComplaints).length >= 10 ||
            (Object.keys(chiefComplaints).length >= 5 &&
                windowWidth < DISEASE_TABS_MED_BP) ||
            windowWidth < DISEASE_TABS_SMALL_BP;

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
                            <Search
                                size='large'
                                placeholder='Type in a condition...'
                                noResultsMessage
                                className='hpi-search-bar'
                                minCharacters={2}
                                onSearchChange={(event) => {
                                    const target = event.target as HTMLTextAreaElement;
                                    this.setState({ searchVal: target.value });
                                }}
                                value={this.state.searchVal}
                                results={getRes()}
                            />
                            <Masonry
                                className='disease-container'
                                breakpointCols={numColumns}
                                columnClassName='disease-column'
                            >
                                {diseaseComponents}
                            </Masonry>
                        </Segment>
                        <>
                            <Button
                                icon
                                floated='right'
                                onClick={
                                    positiveLength > 0
                                        ? this.continue
                                        : this.nextFormClick
                                }
                                className='hpi-small-next-button'
                            >
                                <Icon name='angle right' />
                            </Button>
                            <Button
                                icon
                                labelPosition='right'
                                floated='right'
                                onClick={
                                    positiveLength > 0
                                        ? this.continue
                                        : this.nextFormClick
                                }
                                className='hpi-next-button'
                            >
                                Next
                                <Icon name='angle right' />
                            </Button>
                        </>
                    </>
                );
            default:
                // if API data is loaded, render the DiseaseForm
                if (isGraphLoaded) {
                    return (
                        <>
                            {collapseTabs ? (
                                <Container>
                                    <Grid
                                        stackable
                                        centered
                                        id='hpi-menu'
                                        relaxed
                                    >
                                        {' '}
                                        {Object.keys(chiefComplaints).map(
                                            (menuItem: string) => (
                                                <Button
                                                    basic
                                                    key={menuItem}
                                                    menuItem={menuItem}
                                                    onClick={(
                                                        _e,
                                                        { menuItem }
                                                    ): void =>
                                                        this.setState({
                                                            activeHPI: menuItem,
                                                        })
                                                    }
                                                    active={
                                                        activeHPI === menuItem
                                                    }
                                                    style={{ marginBottom: 5 }}
                                                >
                                                    {menuItem}
                                                </Button>
                                            )
                                        )}
                                    </Grid>
                                    <Segment>
                                        {/*MISC BOX PLACEMENT*/}
                                        {miscBox(activeHPI)}

                                        <DiseaseForm
                                            key={activeHPI}
                                            parentNode={
                                                parentNodes[activeHPI][
                                                    Object.keys(
                                                        parentNodes[activeHPI]
                                                    )[0]
                                                ]
                                            }
                                            category={activeHPI}
                                            nextStep={this.continue}
                                            prevStep={this.back}
                                        />
                                    </Segment>
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
                                        onClick={() =>
                                            activeHPI ==
                                            (Object.keys(
                                                chiefComplaints
                                            )[0] as string)
                                                ? this.nextFormClick
                                                : this.continue
                                        }
                                        className='hpi-small-next-button'
                                    >
                                        <Icon name='angle right' />
                                    </Button>
                                    <Button
                                        icon
                                        labelPosition='right'
                                        floated='right'
                                        onClick={() =>
                                            activeHPI ==
                                            (Object.keys(
                                                chiefComplaints
                                            )[0] as string)
                                                ? this.nextFormClick
                                                : this.continue
                                        }
                                        className='hpi-next-button'
                                    >
                                        Next
                                        <Icon name='angle right' />
                                    </Button>
                                </Container>
                            ) : (
                                <Tab
                                    menu={{
                                        pointing: true,
                                    }}
                                    panes={Object.keys(chiefComplaints).map(
                                        (
                                            diseaseCategory: string,
                                            index: number
                                        ) => ({
                                            menuItem: diseaseCategory,
                                            render: () => (
                                                <Tab.Pane>
                                                    {/*MISC BOX PLACEMENT*/}
                                                    {miscBox(diseaseCategory)}
                                                    <DiseaseForm
                                                        key={
                                                            parentNodes[
                                                                diseaseCategory
                                                            ][
                                                                Object.keys(
                                                                    parentNodes[
                                                                        diseaseCategory
                                                                    ]
                                                                )[0]
                                                            ]
                                                        }
                                                        parentNode={
                                                            parentNodes[
                                                                diseaseCategory
                                                            ][
                                                                Object.keys(
                                                                    parentNodes[
                                                                        diseaseCategory
                                                                    ]
                                                                )[0]
                                                            ]
                                                        }
                                                        category={
                                                            diseaseCategory as string
                                                        }
                                                        nextStep={this.continue}
                                                        prevStep={this.back}
                                                    />
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
                                                        onClick={
                                                            index ==
                                                            Object.keys(
                                                                chiefComplaints
                                                            ).length -
                                                                1
                                                                ? this
                                                                      .nextFormClick
                                                                : this.continue
                                                        }
                                                        className='hpi-small-next-button'
                                                    >
                                                        <Icon name='angle right' />
                                                    </Button>
                                                    <Button
                                                        icon
                                                        labelPosition='right'
                                                        floated='right'
                                                        onClick={
                                                            index ==
                                                            Object.keys(
                                                                chiefComplaints
                                                            ).length -
                                                                -1
                                                                ? this
                                                                      .nextFormClick
                                                                : this.continue
                                                        }
                                                        className='hpi-next-button'
                                                    >
                                                        Next
                                                        <Icon name='angle right' />
                                                    </Button>
                                                </Tab.Pane>
                                            ),
                                        })
                                    )}
                                    id='tab-panes'
                                    activeIndex={step}
                                    onTabChange={(_e, data) =>
                                        this.setState({
                                            step: data.activeIndex as number,
                                        })
                                    }
                                />
                            )}{' '}
                        </>
                    );
                }
                // if API data is not yet loaded, show loading screen
                else {
                    return <h1> Loading... </h1>;
                }
        }
    }
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & PlanProps => {
    return {
        chiefComplaints: state.chiefComplaints,
        planConditions: selectPlanConditions(state),
    };
};

export interface PlanProps {
    planConditions: PlanConditionsFlat[];
}

export interface ChiefComplaintsProps {
    chiefComplaints: ChiefComplaintsState;
}

interface DispatchProps {
    setNotesChiefComplaint: (
        disease: string,
        notes: string | number | undefined
    ) => SetNotesChiefComplaintAction;
}

const mapDispatchToProps = {
    setNotesChiefComplaint,
};

// const mapStateToProps = (state: CurrentNoteState): ChiefComplaintsProps => {
//     return { chiefComplaints: selectChiefComplaintsState(state) };
// };

type Props = ChiefComplaintsProps & HPIContentProps & DispatchProps;

export default connect(mapStateToProps, mapDispatchToProps)(HPIContent);

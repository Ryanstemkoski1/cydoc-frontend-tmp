import axios from 'axios';
import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { graphClientURL } from 'constants/api.js';
import {
    DISEASE_TABS_MED_BP,
    DISEASE_TABS_SMALL_BP,
    ROS_LARGE_BP,
    ROS_MED_BP,
    ROS_SMALL_BP,
} from 'constants/breakpoints';
import { favChiefComplaints } from 'constants/favoriteChiefComplaints';
import { GraphData } from 'constants/hpiEnums';
import { withDimensionsHook } from 'hooks/useDimensions';
import React from 'react';
import Masonry from 'react-masonry-css';
import { connect } from 'react-redux';
import {
    SetNotesChiefComplaintAction,
    setNotesChiefComplaint,
} from 'redux/actions/chiefComplaintsActions';
import {
    ProcessKnowledgeGraphAction,
    processKnowledgeGraph,
} from 'redux/actions/hpiActions';
import {
    SaveHpiHeaderAction,
    saveHpiHeader,
} from 'redux/actions/hpiHeadersActions';
import { CurrentNoteState } from 'redux/reducers';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';
import { HpiHeadersState } from 'redux/reducers/hpiHeadersReducer';
import {
    PlanConditionsFlat,
    selectPlanConditions,
} from 'redux/selectors/planSelectors';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import { Button, Icon, Search, Segment } from 'semantic-ui-react';
import Tab from '../../../../../components/tools/Tab';
import { CHIEF_COMPLAINTS } from '../../../../../redux/actions/actionTypes';
import './HPI.css';
import { hpiHeaders } from './src/API';
import BodySystemDropdown from './src/components/BodySystemDropdown';
import ChiefComplaintsButton, {
    PatientViewProps,
} from './src/components/ChiefComplaintsButton';
import DiseaseForm from './src/components/DiseaseForm';
import MiscBox from './src/components/MiscBox';
import './src/css/App.css';

interface HPIContentProps {
    step: number;
    continue: (e: any) => void;
    back: (e: any) => void;
    activeTab: string;
    onTabClick: (e: any, tabIndex: number) => void;
}

interface HPIContentState {
    searchVal: string;
    activeIndex: number;
}

class HPIContent extends React.Component<Props, HPIContentState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            searchVal: '',
            activeIndex: 0, //misc notes box active
        };
        // this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI,
        // organizes parent nodes by their category code (medical condition) and body system
        if (
            !(
                Object.keys(this.props.hpiHeaders.bodySystems).length &&
                Object.keys(this.props.hpiHeaders.parentNodes).length
            )
        ) {
            const data = hpiHeaders;
            data.then((res) => this.props.saveHpiHeader(res.data));
        }
    }

    getData = async (complaint: string) => {
        const { parentNodes } = this.props.hpiHeaders;
        const chiefComplaint = Object.keys(parentNodes[complaint])[0];
        const response = await axios.get(
            graphClientURL + '/graph/category/' + chiefComplaint + '/4'
        );
        this.props.processKnowledgeGraph(response.data);
    };

    continue = (e: any) => this.props.continue(e);

    back = (e: any) => this.props.back(e);

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
    // miscNotesClick = (
    //     _e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    //     titleProps: AccordionTitleProps
    // ) => {
    //     const { activeIndex } = this.state;
    //     const newIndex =
    //         activeIndex === titleProps.index
    //             ? -1
    //             : (titleProps.index as number);
    //     this.setState({ activeIndex: newIndex });
    // };

    render() {
        const { windowWidth } = this.props.dimensions;
        const { chiefComplaints, hpiHeaders, patientView } = this.props;
        const { bodySystems, parentNodes } = hpiHeaders;

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

        // component for ChiefComplaintsHeader
        const favoritesDiseaseComponent = (
            <BodySystemDropdown
                key={'Favorites'}
                name={'Favorites'}
                diseasesList={favChiefComplaints}
            />
        );

        // ensure that 'Favorites' ChiefComplaintsHeader appears as the first component displayed
        diseaseComponents.unshift(favoritesDiseaseComponent);

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
                                    type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                                    payload: {
                                        disease: complaint,
                                    },
                                });
                                this.getData(complaint);
                            },
                        };
                        filterResults.push(temp);
                    }
                });
            });
            return filterResults;
        };

        // each step correlates to a different tab
        const step: number = this.props.step;
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

        const panes = Object.keys(chiefComplaints).map((name) => ({
            menuItem: name,
        }));

        // depending on the current step, we switch to a different view
        switch (step) {
            case -1:
                return (
                    // if the user has chosen any diseases (positiveLength > 0), then the right button can be displayed
                    // to advance to other pages of the HPI form
                    <>
                        <Segment className='margin-bottom-for-notes'>
                            {positiveLength > 0 ? (
                                <div className='notes-btn-wrap flex-wrap'>
                                    {positiveDiseases}
                                </div>
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
                                    const target =
                                        event.target as HTMLTextAreaElement;
                                    this.setState({ searchVal: target.value });
                                }}
                                value={this.state.searchVal}
                                results={getRes()}
                            />
                            <Masonry
                                className='disease-container col-wrapper'
                                breakpointCols={numColumns}
                                columnClassName='disease-column'
                            >
                                {diseaseComponents}
                            </Masonry>
                        </Segment>
                        <>
                            <NavigationButton nextClick={this.continue} />
                        </>
                    </>
                );
            default:
                // if API data is loaded, render the DiseaseForm
                if (
                    Object.keys(bodySystems).length &&
                    Object.keys(parentNodes).length
                ) {
                    return (
                        <div className='hpi-content'>
                            <Tab
                                panes={panes}
                                activeIndex={panes.findIndex(
                                    (item) =>
                                        item.menuItem === this.props.activeTab
                                )}
                                onTabChange={(_e: any, { value }: any) => {
                                    // this.setState({ activeIndex: value });
                                    this.props.onTabClick(_e, value);
                                }}
                            ></Tab>
                            <Segment className='margin-bottom-for-notes'>
                                <MiscBox
                                    activeThing={this.props.activeTab}
                                    step={step}
                                />
                                <DiseaseForm
                                    key={this.props.activeTab}
                                    category={this.props.activeTab}
                                    nextStep={this.continue}
                                    prevStep={this.back}
                                />
                            </Segment>
                            <NavigationButton
                                previousClick={this.back}
                                nextClick={this.continue}
                            />
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

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & PlanProps & HpiHeadersProps & PatientViewProps => {
    return {
        chiefComplaints: state.chiefComplaints,
        planConditions: selectPlanConditions(state),
        hpiHeaders: state.hpiHeaders,
        patientView: selectPatientViewState(state),
    };
};

export interface PlanProps {
    planConditions: PlanConditionsFlat[];
}

export interface ChiefComplaintsProps {
    chiefComplaints: ChiefComplaintsState;
}

export interface HpiHeadersProps {
    hpiHeaders: HpiHeadersState;
}

interface DispatchProps {
    setNotesChiefComplaint: (
        disease: string,
        notes: string | number | undefined
    ) => SetNotesChiefComplaintAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
    saveHpiHeader: (data: HpiHeadersState) => SaveHpiHeaderAction;
}

const mapDispatchToProps = {
    setNotesChiefComplaint,
    processKnowledgeGraph,
    saveHpiHeader,
};

type Props = ChiefComplaintsProps &
    HpiHeadersProps &
    HPIContentProps &
    DispatchProps &
    PatientViewProps & {
        dimensions?: any;
    };

export default withDimensionsHook(
    connect(mapStateToProps, mapDispatchToProps)(HPIContent)
);

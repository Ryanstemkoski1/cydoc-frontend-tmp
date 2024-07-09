import axios from 'axios';
import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { graphClientURL } from '@constants/api';
import React from 'react';
import Masonry from 'react-masonry-css';
import { ConnectedProps, connect } from 'react-redux';
import {
    setChiefComplaint,
    setNotesChiefComplaint,
} from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectPlanConditions } from '@redux/selectors/planSelectors';
import { selectPatientViewState } from '@redux/selectors/userViewSelectors';
import { Search, Segment } from 'semantic-ui-react';
import Tab from '@components/tools/Tab';
import './HPI.css';
import { hpiHeaders } from './API';
import BodySystemDropdown from './components/BodySystemDropdown';
import ChiefComplaintsButton from './components/ChiefComplaintsButton';
import DiseaseForm from './components/DiseaseForm';
import MiscBox from './components/MiscBox';
import './css/App.css';
import { favChiefComplaints } from 'classes/institution.class';

interface OwnProps {
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

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

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

    render() {
        const { chiefComplaints, hpiHeaders } = this.props;
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
                                this.props.setChiefComplaint(complaint);
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
        const numColumns = 4;

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

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        chiefComplaints: state.chiefComplaints,
        planConditions: selectPlanConditions(state),
        hpiHeaders: state.hpiHeaders,
        patientView: selectPatientViewState(state),
    };
};

const mapDispatchToProps = {
    setChiefComplaint,
    setNotesChiefComplaint,
    processKnowledgeGraph,
    saveHpiHeader,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(HPIContent);

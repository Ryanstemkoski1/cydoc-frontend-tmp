import { HPIPatientQueryParams } from 'constants/enums/hpi.patient.enums';
import axios from 'axios';
import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { graphClientURL, apiClient } from 'constants/api.js';
import { favChiefComplaints } from 'classes/institution.class';
import React from 'react';
import Masonry from 'react-masonry-css';
import { ConnectedProps, connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setNotesChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from 'redux/actions/hpiActions';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectPlanConditions } from 'redux/selectors/planSelectors';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import { Search, Segment } from 'semantic-ui-react';
import getHPIFormData from 'utils/getHPIFormData';
import { CHIEF_COMPLAINTS } from '../../../redux/actions/actionTypes';
import { hpiHeaders } from '../../EditNote/content/hpi/knowledgegraph/src/API';
import BodySystemDropdown from '../../EditNote/content/hpi/knowledgegraph/src/components/BodySystemDropdown';
import ChiefComplaintsButton from '../../EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import DiseaseForm from '../../EditNote/content/hpi/knowledgegraph/src/components/DiseaseForm';
import { HpiHeadersState } from 'redux/reducers/hpiHeadersReducer';

interface Props {
    activeItem: string;
    hpiHeaders: HpiHeadersState;
    saveHpiHeader: (data: any) => void;
    chiefComplaints: any;
    processKnowledgeGraph: (data: any) => void;
    notification: {
        setNotificationMessage: (message: string) => void;
        setNotificationType: (type: string) => void;
    };
    step: number;
    continue: (e?: any) => void;
    back: (e?: any) => void;
    location: { search: string; pathname: any; state: any; hash: any };
}
interface State {
    searchVal: string;
    activeIndex: number;
    loading: boolean;
}
class HPIContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            searchVal: '',
            activeIndex: 0, //misc notes box active
            loading: false,
        };
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI,
        // organizes parent nodes by their category code (medical condition) and body system
        if (
            !(
                Object.keys(this.props.hpiHeaders.bodySystems || {}).length &&
                Object.keys(this.props.hpiHeaders.parentNodes || {}).length
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

    continue = () => this.props.continue();

    back = () => this.props.back();

    shouldShowNextButton = () => {
        const selectChiefComplaints = Object.keys(this.props.chiefComplaints);
        const currentActiveItem = this.props.activeItem;
        let result = true;

        selectChiefComplaints.forEach((item, index) => {
            if (
                item === currentActiveItem &&
                index === selectChiefComplaints.length - 1
            ) {
                result = false;
            }
        });
        return result;
    };

    handleSubmit = () => {
        const query = new URLSearchParams(this.props.location.search);

        const clinician_id =
            query.get(HPIPatientQueryParams.CLINICIAN_ID) ?? '';
        const institution_id =
            query.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';

        const { setNotificationMessage, setNotificationType } =
            this.props.notification;
        this.setState({ loading: true });

        apiClient
            .post('/appointment', {
                ...getHPIFormData(),
                clinician_id,
                institution_id,
            })
            .then(() => {
                localStorage.setItem('HPI_FORM_SUBMITTED', '1');
                let url = `/submission-successful?${HPIPatientQueryParams.INSTITUTION_ID}=${institution_id}`;

                if (clinician_id) {
                    url += `&${HPIPatientQueryParams.CLINICIAN_ID}=${clinician_id}`;
                }

                window.location.href = url;
            })
            .catch((_error) => {
                setNotificationMessage('Failed to submit your questionnaire');
                setNotificationType('error');
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

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
        const positiveDiseases = Object.keys(chiefComplaints || {}).map(
            (disease) => <ChiefComplaintsButton key={disease} name={disease} />
        );

        // map through all complaints on the HPI and create search resuls
        const getRes = () => {
            const filterResults: any[] = [];
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
        const step = this.props.step;
        // number of positive diseases, which is also the number of steps
        const positiveLength = positiveDiseases.length;

        // window/screen responsiveness
        const numColumns = 4;

        const shouldShowNextButton = this.shouldShowNextButton();

        // depending on the current step, we switch to a different view
        switch (step) {
            case -1:
                return (
                    // if the user has chosen any diseases (positiveLength > 0), then the right button can be displayed
                    // to advance to other pages of the HPI form
                    <>
                        <Segment className='margin-bottom-for-notes'>
                            {positiveLength > 0 ? (
                                positiveDiseases
                            ) : (
                                <div className='positive-diseases-placeholder' />
                            )}
                            <Search
                                size='large'
                                placeholder='Type in a condition...'
                                className='hpi-search-bar'
                                minCharacters={2}
                                onSearchChange={(event) => {
                                    const target = event.target as {
                                        value?: string;
                                    };
                                    this.setState({
                                        searchVal: target?.value || '',
                                    });
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
                    </>
                );
            default:
                // if API data is loaded, render the DiseaseForm
                if (
                    Object.keys(bodySystems || {}).length &&
                    Object.keys(parentNodes || {}).length
                ) {
                    return (
                        <>
                            {this.props.activeItem in parentNodes && (
                                <DiseaseForm
                                    key={
                                        Object.keys(
                                            parentNodes[this.props.activeItem]
                                        )[0]
                                    }
                                    category={this.props.activeItem}
                                    nextStep={this.continue}
                                    prevStep={this.back}
                                />
                            )}
                            <NavigationButton
                                previousClick={this.back}
                                nextClick={
                                    shouldShowNextButton
                                        ? this.continue
                                        : this.handleSubmit
                                }
                                loading={this.state.loading}
                                secondButtonLabel={
                                    shouldShowNextButton ? 'Next' : 'Submit'
                                }
                            />
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

const mapStateToProps = (state: any) => {
    return {
        chiefComplaints: state.chiefComplaints,
        planConditions: selectPlanConditions(state),
        hpiHeaders: state.hpiHeaders,
        patientView: selectPatientViewState(state),
        activeItem: selectActiveItem(state),
    };
};

const mapDispatchToProps = {
    setNotesChiefComplaint,
    processKnowledgeGraph,
    saveHpiHeader,
};

export default withRouter(
    // @ts-expect-error we need to create a unified redux state type
    connect(mapStateToProps, mapDispatchToProps)(HPIContent)
);

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type PropsFromRedux = ConnectedProps<typeof connector>;

// // export default connector<typeof SimpleErrorBoundary>(SimpleErrorBoundary);

// export default withRouter(
//     connector(mapStateToProps, mapDispatchToProps)(HPIContent)
// );

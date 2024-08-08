import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import axios from 'axios';
import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { graphClientURL, apiClient } from '@constants/api';
import { favChiefComplaints } from 'classes/institution.class';
import React, { useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { ConnectedProps, connect } from 'react-redux';
import {
    setChiefComplaint,
    setNotesChiefComplaint,
} from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { Search, Segment } from 'semantic-ui-react';
import getHPIFormData from '@utils/getHPIFormData';
import { hpiHeaders } from '../../EditNote/content/hpi/knowledgegraph/API';
import BodySystemDropdown from '../../EditNote/content/hpi/knowledgegraph/components/BodySystemDropdown';
import ChiefComplaintsButton from '../../EditNote/content/hpi/knowledgegraph/components/ChiefComplaintsButton';
import DiseaseForm from '../../EditNote/content/hpi/knowledgegraph/components/DiseaseForm';
import { CurrentNoteState } from '@redux/reducers';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectSurgicalHistoryProcedures } from '@redux/selectors/surgicalHistorySelectors';
import { NotificationTypeEnum } from '@components/tools/Notification/Notification';
import useQuery from '@hooks/useQuery';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { log } from '@modules/logging';
import { selectProductDefinitions } from '@redux/selectors/productDefinitionSelector';

interface OwnProps {
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
    step?: number; // does not appear to be passed in from parent component correctly
    continue: (e?: any) => void;
    back: (e?: any) => void;
}

interface State {
    searchVal: string;
    activeIndex: number;
    loading: boolean;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

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

    onSubmit = (query: ReadonlyURLSearchParams) => {
        // This is apparently deprecated, remove?
        const clinician_id =
            query.get(HPIPatientQueryParams.CLINICIAN_ID) ?? '';
        const institution_id =
            query.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';

        const { setNotificationMessage, setNotificationType } =
            this.props.notification;
        this.setState({ loading: true });

        apiClient
            .post('/appointment', {
                ...getHPIFormData(
                    this.props.additionalSurvey,
                    this.props.userSurveyState,
                    {
                        hpi: this.props.hpi,
                        chiefComplaints: this.props.chiefComplaints,
                        familyHistory: this.props.familyHistoryState,
                        medications: this.props.medicationsState,
                        medicalHistory: this.props.medicalHistoryState,
                        patientInformation: this.props.patientInformationState,
                        surgicalHistory: this.props.surgicalHistory,
                        userSurvey: this.props.userSurveyState,
                    },
                    this.props.productDefinition
                        ?.useAdvancedReportTextGeneration as boolean
                ),
                clinician_id,
                institution_id,
            })
            .then(() => {
                let url = `/submission-successful?${HPIPatientQueryParams.INSTITUTION_ID}=${institution_id}`;

                if (clinician_id) {
                    url += `&${HPIPatientQueryParams.CLINICIAN_ID}=${clinician_id}`;
                }

                // Should use router?
                window.location.href = url;
            })
            .catch((_error) => {
                setNotificationMessage('Failed to submit your questionnaire');
                setNotificationType(NotificationTypeEnum.ERROR);
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
                                    nextStep={this.props.continue}
                                    prevStep={this.props.back}
                                />
                            )}
                            <NextSubmitButton
                                loading={this.state.loading}
                                onBack={this.props.back}
                                onContinue={this.props.continue}
                                onSubmit={this.onSubmit}
                                shouldShowNextButton={shouldShowNextButton}
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

interface NextSubmitButtonProps {
    loading: boolean;
    onBack: () => void;
    onContinue: () => void;
    onSubmit: (query: ReadonlyURLSearchParams) => void;
    shouldShowNextButton: boolean;
}

function NextSubmitButton({
    loading,
    onBack,
    onContinue,
    onSubmit,
    shouldShowNextButton,
}: NextSubmitButtonProps) {
    const query = useQuery();

    const nextClick = useCallback(() => {
        if (shouldShowNextButton) {
            onContinue();
        } else if (query === null) {
            log(`[HPI Content] submitting null query`, {
                query,
                location: window.location,
            });
        } else {
            onSubmit(query);
        }
    }, [onContinue, onSubmit, query, shouldShowNextButton]);

    return (
        <NavigationButton
            previousClick={onBack}
            nextClick={nextClick}
            loading={loading}
            secondButtonLabel={shouldShowNextButton ? 'Next' : 'Submit'}
        />
    );
}

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        activeItem: selectActiveItem(state),
        additionalSurvey: selectAdditionalSurvey(state),
        chiefComplaints: state.chiefComplaints,
        familyHistoryState: selectFamilyHistoryState(state),
        hpi: selectHpiState(state),
        hpiHeaders: state.hpiHeaders,
        patientInformationState: selectPatientInformationState(state),
        medicationsState: selectMedicationsState(state),
        medicalHistoryState: selectMedicalHistoryState(state),
        surgicalHistory: selectSurgicalHistoryProcedures(state),
        userSurveyState: selectInitialPatientSurvey(state),
        productDefinition: selectProductDefinitions(state),
    };
};

const mapDispatchToProps = {
    processKnowledgeGraph,
    saveHpiHeader,
    setChiefComplaint,
    setNotesChiefComplaint,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(HPIContent);

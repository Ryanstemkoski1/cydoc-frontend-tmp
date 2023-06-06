import React from 'react';
import '../css/Button.css';
import MultipleChoice from './responseComponents/MultipleChoice';
import ReviewOfSystemsCategory from '../../../../reviewofsystems/ReviewOfSystemsCategory';
import YesNo from './responseComponents/YesNo';
import HandleInput from './responseComponents/HandleInput';
import HandleNumericInput from './responseComponents/HandleNumericInput';
import TimeInput from './responseComponents/TimeInput';
import BodyLocation from './responseComponents/BodyLocation';
import FamilyHistoryContent from '../../../../familyhistory/FamilyHistoryContent';
import MedicalHistoryContent from '../../../../medicalhistory/MedicalHistoryContent';
import MedicationsContent from '../../../../medications/MedicationsContent';
import SurgicalHistoryContent from '../../../../surgicalhistory/SurgicalHistoryContent';
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';
import ListText from './responseComponents/ListText';
import { ResponseTypes, HpiStateProps } from 'constants/hpiEnums';
import { YesNoResponse } from 'constants/enums';
import { ReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import {
    addFhPopOptions,
    AddFhPopOptionsAction,
} from 'redux/actions/familyHistoryActions';
import {
    blankQuestionChange,
    BlankQuestionChangeAction,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ScaleInput from './responseComponents/ScaleInput';
import { standardizeDiseaseNames } from 'constants/standardizeDiseaseNames';
import diseaseSynonyms from 'constants/diseaseSynonyms';
import LaboratoryTest from './responseComponents/LaboratoryTest';
import {
    isLabTestDictionary,
    isSelectOneResponse,
} from 'redux/reducers/hpiReducer';
import Masonry from 'react-masonry-component';

interface CreateResponseProps {
    node: string;
    category: string;
}

interface CreateResponseState {
    windowWidth: number;
    windowHeight: number;
    startDate: Date;
    scale: number;
    input: string;
    question: string;
    responseChoice: string[];
}

class CreateResponse extends React.Component<Props, CreateResponseState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            startDate: new Date(),
            scale: 0,
            input: '',
            question: '',
            responseChoice: [],
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        this.cleanQuestionText();
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

    cleanQuestionText = () => {
        /*
        Cleans a question text for any parts not to be seen by the user,
        such as SYMPTOM or DISEASE, which should be replaced by the 
        category name, or CLICK[] or any brackets [] that should not be
        present. 

        One random exception found was that BIP0002 has CLICK with no
        closing bracket "]", so the corresponding changes were made so 
        that the question can still pass through correctly.
        */
        const { node, hpi, category } = this.props;
        const { response, responseType } = hpi.nodes[node];
        const text = hpi.nodes[node].text
            .replace('SYMPTOM', category.toLowerCase())
            .replace('DISEASE', category.toLowerCase());
        if (
            [
                ResponseTypes.LABORATORY_TEST,
                ResponseTypes.CBC,
                ResponseTypes.BMP,
                ResponseTypes.LFT,
            ].includes(responseType) &&
            isLabTestDictionary(response)
        )
            this.setState({
                question: "What is the patient's " + response.name + '?',
            });
        else {
            const click = text.search('CLICK'),
                select = text.search('\\['),
                endSelect = text.search('\\]'),
                cleanText = select != -1 && endSelect != -1;
            this.setState({
                question: text.slice(
                    0,
                    click != -1 ? click : cleanText ? select : text.length
                ),
                responseChoice:
                    click != -1 || cleanText
                        ? text
                              .slice(
                                  select + 1,
                                  endSelect != -1 ? endSelect : text.length
                              )
                              .split(',')
                              .map((response) => response.trim())
                        : [],
            });
        }
    };

    renderSwitch = () => {
        const { windowWidth } = this.state,
            { node, hpi } = this.props,
            { responseType } = hpi.nodes[node],
            blankTypes = [
                ResponseTypes.FH_BLANK,
                ResponseTypes.MEDS_BLANK,
                ResponseTypes.PMH_BLANK,
                ResponseTypes.PSH_BLANK,
            ],
            collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        const responseChoice = this.state.responseChoice;
        const synonymTypes = [
            ResponseTypes.FH_POP,
            ResponseTypes.FH_BLANK,
            ResponseTypes.PMH_POP,
            ResponseTypes.PMH_BLANK,
        ];
        if (synonymTypes.includes(responseType)) {
            responseChoice.forEach((key: string, index: number) => {
                responseChoice[index] = standardizeDiseaseNames(
                    responseChoice[index]
                );
                if (key in diseaseSynonyms) {
                    responseChoice[index] = diseaseSynonyms[key];
                }
            });
        }

        const choices = blankTypes.includes(responseType)
            ? (hpi.nodes[node].response as string[])
            : responseChoice;
        switch (responseType) {
            case ResponseTypes.YES_NO:
            case ResponseTypes.NO_YES:
                return <YesNo key={node} node={node} />;

            case ResponseTypes.RADIOLOGY:
            case ResponseTypes.SHORT_TEXT:
                return <HandleInput key={node} node={node} />;

            case ResponseTypes.TIME3DAYS:
                return <TimeInput key={node} node={node} />;

            case ResponseTypes.LIST_TEXT:
                return <ListText key={node} node={node} />;

            case ResponseTypes.SELECTONE:
                return responseChoice.map((item: string) => (
                    <MultipleChoice key={item} name={item} node={node} />
                ));

            case ResponseTypes.SELECTMANY: {
                const existingResponse = this.props.hpi.nodes[node].response;
                const formattedResponseChoice: ReviewOfSystemsState = {
                    '': {},
                };
                if (isSelectOneResponse(existingResponse)) {
                    responseChoice.forEach((key: string) => {
                        formattedResponseChoice[''][key] =
                            existingResponse[key] !== undefined
                                ? existingResponse[key] === true
                                    ? YesNoResponse.Yes
                                    : YesNoResponse.No
                                : YesNoResponse.None;
                    });
                }
                return (
                    <Masonry className='ros-container' style={{ width: 357 }}>
                        <ReviewOfSystemsCategory
                            key={''}
                            category={''}
                            selectManyState={formattedResponseChoice}
                            selectManyOptions={responseChoice}
                            node={node}
                        />
                    </Masonry>
                );
            }

            case ResponseTypes.NUMBER:
                return <HandleNumericInput key={node} node={node} />;

            case ResponseTypes.BODYLOCATION:
                return <BodyLocation key={node} node={node} />;
            case ResponseTypes.SCALE1TO10:
                return <ScaleInput key={node} node={node} />;

            case ResponseTypes.MEDS_POP:
            case ResponseTypes.MEDS_BLANK:
                return (
                    <MedicationsContent
                        key={node}
                        isPreview={false}
                        mobile={collapseTabs}
                        values={choices}
                        responseType={responseType}
                        node={node}
                        singleType={true}
                        isNote={true}
                    />
                );
            case ResponseTypes.FH_POP:
            case ResponseTypes.FH_BLANK:
                return (
                    <FamilyHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={choices}
                        responseType={responseType}
                        node={node}
                    />
                );

            case ResponseTypes.PMH_POP:
            case ResponseTypes.PMH_BLANK:
                return (
                    <MedicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={choices}
                        responseType={responseType}
                        mobile={collapseTabs}
                        currentYear={-1}
                        node={node}
                    />
                );

            case ResponseTypes.PSH_POP:
            case ResponseTypes.PSH_BLANK:
                return (
                    <SurgicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={choices}
                        responseType={responseType}
                        mobile={collapseTabs}
                        node={node}
                    />
                );
            case ResponseTypes.LABORATORY_TEST:
            case ResponseTypes.CBC:
            case ResponseTypes.BMP:
            case ResponseTypes.LFT:
                return <LaboratoryTest key={node} node={node} />;
            default:
                return;
        }
    };

    render() {
        const textStyle = {
            fontSize: '1.2rem',
            color: 'black',
        };
        const marginBottom = {
            marginBottom: 48,
        };
        return (
            <div className='qa-div' style={marginBottom}>
                <div>
                    {' '}
                    {this.state.question.trim() == 'NAME' ? (
                        ''
                    ) : (
                        <span style={textStyle}>
                            {this.state.question.trim()}
                        </span>
                    )}{' '}
                    <div className='qa-button space-top remove-shadow'>
                        {this.renderSwitch()}
                    </div>{' '}
                </div>
            </div>
        );
    }
}
interface DispatchProps {
    addFhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddFhPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & CreateResponseProps;

const mapDispatchToProps = {
    addFhPopOptions,
    blankQuestionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateResponse);

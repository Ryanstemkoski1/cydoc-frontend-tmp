import diseaseSynonyms from '@constants/diseaseSynonyms';
import { YesNoResponse } from '@constants/enums';
import { HpiStateProps, ResponseTypes } from '@constants/hpiEnums';
import { standardizeDiseaseNames } from '@constants/standardizeDiseaseNames';
import React from 'react';
import { connect } from 'react-redux';
import {
    AddFhPopOptionsAction,
    addFhPopOptions,
} from '@redux/actions/familyHistoryActions';
import {
    AddListInputAction,
    BlankQuestionChangeAction,
    ListTextHandleChangeAction,
    RemoveListInputAction,
    addListInput,
    blankQuestionChange,
    listTextHandleChange,
    removeListInput,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    isLabTestDictionary,
    isSelectOneResponse,
} from '@redux/reducers/hpiReducer';
import { ReviewOfSystemsState } from '@redux/reducers/reviewOfSystemsReducer';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import FamilyHistoryContent from '../../../familyhistory/FamilyHistoryContent';
import MedicalHistoryContent from '../../../medicalhistory/MedicalHistoryContent';
import MedicationsContent from '../../../medications/MedicationsContent';
import ReviewOfSystemsCategory from '../../../reviewofsystems/ReviewOfSystemsCategory';
import SurgicalHistoryContent from '../../../surgicalhistory/SurgicalHistoryContent';
import '../css/Button.css';
import style from './CreateResponse.module.scss';
import BodyLocation from './responseComponents/BodyLocation';
import HandleInput from './responseComponents/HandleInput';
import HandleNumericInput from './responseComponents/HandleNumericInput';
import HandleWriteInInput from './responseComponents/HandleWriteInInput';
import LaboratoryTest from './responseComponents/LaboratoryTest';
import ListText from './responseComponents/ListText';
import MultipleChoice from './responseComponents/MultipleChoice';
import ScaleInput from './responseComponents/ScaleInput';
import TimeInput from './responseComponents/TimeInput';
import YearInput from './responseComponents/YearInput';
import HandleDateInput from './responseComponents/HandleDateInput';
import YesNo from './responseComponents/YesNo';
import DSMDiagnosisPicker from '@screens/EditNote/content/dsmdiagnoses/DSMDiagnosisPicker';

interface CreateResponseProps {
    node: string;
    category: string;
}

interface CreateResponseState {
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
            startDate: new Date(),
            scale: 0,
            input: '',
            question: '',
            responseChoice: [],
        };
    }

    componentDidMount() {
        this.cleanQuestionText();
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
            .replace('DISEASE', category.toLowerCase())
            .replace(/ONLYIF\[.*]\s/, '') // remove "ONLYIF[**] " part from text
            .trim();
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
        const {
                node,
                hpi,
                addListInput,
                listTextHandleChange,
                removeListInput,
            } = this.props,
            { responseType } = hpi.nodes[node],
            blankTypes = [
                ResponseTypes.FH_BLANK,
                ResponseTypes.MEDS_BLANK,
                ResponseTypes.PMH_BLANK,
                ResponseTypes.PSH_BLANK,
            ];

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
                return (
                    <ListText
                        key={node}
                        nodeId={node}
                        onAddListItem={addListInput}
                        onChangeListItem={listTextHandleChange}
                        onRemoveListItem={removeListInput}
                        response={hpi.nodes[node].response}
                    />
                );

            case ResponseTypes.SELECTMANYDENSE:
            case ResponseTypes.SELECTONE:
                return (
                    <div className={`${style.response__wrap} flex-wrap`}>
                        {responseChoice.map((item: string, index: number) => {
                            const isOther = item.toLowerCase() === 'other';
                            return (
                                <div
                                    key={`${item}-${index}`}
                                    style={{
                                        display: 'flex',
                                        width: 'auto',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MultipleChoice
                                        name={
                                            item === 'yes'
                                                ? 'Yes'
                                                : item === 'no'
                                                  ? 'No'
                                                  : item.toLowerCase()
                                        }
                                        node={node}
                                    />
                                    {isOther && (
                                        <HandleWriteInInput
                                            name={item}
                                            node={node}
                                            options={responseChoice}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );

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
                    <ReviewOfSystemsCategory
                        key={''}
                        category={''}
                        selectManyState={formattedResponseChoice}
                        selectManyOptions={responseChoice}
                        node={node}
                    />
                );
            }

            case ResponseTypes.NUMBER:
                return <HandleNumericInput key={node} node={node} />;

            case ResponseTypes.YEAR:
                return <YearInput key={node} node={node} />;

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
                        hide={true}
                    />
                );

            case ResponseTypes.PMH_POP:
                return (
                    <MedicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={choices}
                        responseType={responseType}
                        currentYear={-1}
                        node={node}
                        hide={false}
                    />
                );
            case ResponseTypes.PMH_BLANK:
                return (
                    <MedicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseType={responseType}
                        currentYear={-1}
                        node={node}
                        hide={true}
                    />
                );

            case ResponseTypes.PSH_POP:
            case ResponseTypes.PSH_BLANK:
                return (
                    <SurgicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseType={responseType}
                        node={node}
                        hide={true}
                    />
                );
            case ResponseTypes.LABORATORY_TEST:
            case ResponseTypes.CBC:
            case ResponseTypes.BMP:
            case ResponseTypes.LFT:
                return <LaboratoryTest key={node} node={node} />;
            case ResponseTypes.PSYCHDXPICKER:
                return <DSMDiagnosisPicker key={node} node={node} />;
            case ResponseTypes.DATE: {
                return (
                    <HandleDateInput
                        id={node}
                        type={'date'}
                        defaultValue={
                            this.props.hpi.nodes[node].response as string
                        }
                        required={false}
                        placeholder={'DD/MM/YYYY'}
                        name={node}
                    />
                );
            }
            default:
                return;
        }
    };

    render() {
        const { node, hpi } = this.props;
        const isYesNoResponseType = [
            ResponseTypes.NO_YES,
            ResponseTypes.YES_NO,
        ].includes(hpi.nodes[node].responseType);
        return (
            <div
                className={`${style.response} ${
                    isYesNoResponseType
                        ? `${style.response__grid} isYesNo flex-wrap align-center`
                        : ''
                }`}
                style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                {this.state.question.trim() == 'NAME' ? (
                    ''
                ) : (
                    <h5>{this.state.question.trim()}</h5>
                )}
                <aside>{this.renderSwitch()}</aside>
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
    listTextHandleChange: (
        uuid: string,
        medId: string,
        textInput: string
    ) => ListTextHandleChangeAction;
    removeListInput: (uuid: string, medId: string) => RemoveListInputAction;
    addListInput: (medId: string) => AddListInputAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & CreateResponseProps;

const mapDispatchToProps = {
    addFhPopOptions,
    blankQuestionChange,
    addListInput,
    listTextHandleChange,
    removeListInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateResponse);

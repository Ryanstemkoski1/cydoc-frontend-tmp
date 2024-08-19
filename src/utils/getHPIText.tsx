import { YesNoResponse } from '@constants/enums';
import {
    BodyLocationType,
    NodeResponseType,
    LabTestType,
    ListTextInput,
    NodeInterface,
    ResponseTypes,
    SelectManyInput,
    SelectOneInput,
    TimeInput,
} from '@constants/hpiEnums';
import { doAllHPIWordReplacements } from './textGeneration/processing/handleHPIWordReplacements';
import { ChiefComplaintsState } from '@redux/reducers/chiefComplaintsReducer';
import { FamilyHistoryState } from '@redux/reducers/familyHistoryReducer';
import { HpiState } from '@redux/reducers/hpiReducer';
import { MedicalHistoryState } from '@redux/reducers/medicalHistoryReducer';
import { MedicationsState } from '@redux/reducers/medicationsReducer';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';
import { SurgicalHistoryElements } from '@redux/reducers/surgicalHistoryReducer';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { isHPIResponseValid } from './getHPIFormData';
import { splitByPeriod } from './textGeneration/common/textUtils';
import { HPI, fillAnswers } from './textGeneration/processing/fillHPIAnswers';
import {
    WholeNoteProps,
    GraphNode,
    extractHpiArray,
} from './textGeneration/extraction/extractHpi';

import { PatientPronouns } from '@constants/patientInformation';
import {
    capitalizeFirstLetter,
    splitByPeriod,
} from '@utils/textGeneration/common/textUtils';
import { replaceWordCaseSensitive } from '@utils/textGeneration/common/textUtils';

// TODO: add it applying 'getThirdPersonSingularForm'
const conjugateThirdPerson = (hpiString: string) => hpiString;

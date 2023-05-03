import { ROSActionTypes } from './reviewOfSystemsActions';
import { MedicalHistoryActionTypes } from './medicalHistoryActions';
import { SurgicalHistoryActionTypes } from './surgicalHistoryActions';
import { MedicationsActionTypes } from './medicationsActions';
import { AllergiesActionTypes } from './allergiesActions';
import { SocialHistoryActionTypes } from './socialHistoryActions';
import { FamilyHistoryActionTypes } from './familyHistoryActions';
import { PhysicalExamActionTypes } from './physicalExamActions';
import { PlanActionTypes } from './planActions';
import { HpiActionTypes } from './hpiActions';
import { WidgetActionTypes } from './widgetActions';
import { chiefComplaintsActionTypes } from './chiefComplaintsActions';
import { userViewActionTypes } from './userViewActions';
import { activeItemActionTypes } from './activeItemActions';
import { DisplayedNodesActionTypes } from './displayedNodesActions';

export type AllActionTypes =
    | ROSActionTypes
    | PhysicalExamActionTypes
    | WidgetActionTypes
    | MedicalHistoryActionTypes
    | SurgicalHistoryActionTypes
    | MedicationsActionTypes
    | AllergiesActionTypes
    | SocialHistoryActionTypes
    | FamilyHistoryActionTypes
    | PlanActionTypes
    | HpiActionTypes
    | chiefComplaintsActionTypes
    | userViewActionTypes
    | activeItemActionTypes
    | DisplayedNodesActionTypes;

import { initialPlanState } from 'redux/reducers/planReducer';
import { initialMedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { initialAllergiesState } from 'redux/reducers/allergiesReducer';
import { initialMedicationsState } from 'redux/reducers/medicationsReducer';
import { initialSurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';
import { initialFamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { initialSocialHistoryState } from 'redux/reducers/socialHistoryReducer';
import { initialReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import { initialHpiState } from 'redux/reducers/hpiReducer';
import { initialChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';

export const noteBody = {
    allergies: initialAllergiesState,
    medications: initialMedicationsState,
    surgicalHistory: initialSurgicalHistoryState,
    medicalHistory: initialMedicalHistoryState,
    familyHistory: initialFamilyHistoryState,
    socialHistory: initialSocialHistoryState,
    reviewOfSystems: initialReviewOfSystemsState,
    physicalExam: initialPhysicalExamState,
    hpi: initialHpiState,
    plan: initialPlanState,
    chiefComplaints: initialChiefComplaintsState,
};

export enum WhoCompletes {
    Clinician = 'Clinician',
    Staff = 'Staff',
    Patient = 'Patient',
    Cydoc_ai = 'Cydoc AI',
}

export enum TaskType {
    Smart_Form = 'Smart Form',
    Synthesize_All_forms_into_Report = 'Synthesize All Forms into Report',
}

export enum FormType {
    Form = 'Form',
    Diabetes = 'Diabetes Form',
    Evaluation = 'Evaluation Form',
    Symptoms_Today = 'Symptoms Today Form',
    After_Visit_Survey = 'After Visit Survey',
    Glucose_Management = 'Glucose Management Form',
}

export type AppointmentValueType = {
    whoCompletes: string | null;
    form: string | null;
};

export type AppointmentTemplateType = {
    header: string | null;
    body: AppointmentValueType[];
};

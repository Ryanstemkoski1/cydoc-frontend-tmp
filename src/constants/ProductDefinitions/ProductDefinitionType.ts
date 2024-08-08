export enum ProductName {
    SMART_PATIENT_INTAKE_FORM = 'SMART_PATIENT_INTAKE_FORM',
    ADVANCED_REPORT_GENERATION = 'ADVANCED_REPORT_GENERATION',
}

export interface ProductDefinitions {
    showAppointmentTemplates: boolean;
    showNewPatientGeneration: boolean;
    useAdvancedReportTextGeneration: boolean;
    displayedNodesCutOff: number;
}

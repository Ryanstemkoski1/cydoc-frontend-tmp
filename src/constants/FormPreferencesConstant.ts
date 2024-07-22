export const MAX_LIMIT_TO_ADD_DEFAULT_FORMS = 10;

export enum ProductType {
    SMART_PATIENT_INTAKE_FORM = 'SMART_PATIENT_INTAKE_FORM',
    ADVANCED_REPORT_GENERATION = 'ADVANCED_REPORT_GENERATION',
}

export enum DefaultFormType {
    SHOW_DEFAULT_FORMS = 'Show Default Forms',
    ENABLE_HPI_SUBJECTIVE_SECTION_GENERATION = 'Enable HPI/Subjective section generation',
}

export type CustomRadioLabelProps = {
    title: string;
    detail: string;
};

export type CustomSwitchProps = {
    label: string;
    tooltipTitle: string;
};

export const ProductRadioLabels = {
    [ProductType.SMART_PATIENT_INTAKE_FORM]: {
        title: 'Smart Patient Intake Form',
        detail: 'Patients complete the Smart Patient Intake Form after scanning a QR code or clicking a link. \nClinicians receive a generated note before a visit, saving 10+ minutes per visit.',
    },
    [ProductType.ADVANCED_REPORT_GENERATION]: {
        title: 'Advanced Report Generation',
        detail: 'Clinicians, staff, and/or patients can complete different forms at different times, which will then be compiled into a report.',
    },
};

export const DefaultFormSwitchLabels = {
    [DefaultFormType.SHOW_DEFAULT_FORMS]: {
        label: 'Show Default Forms',
        tooltipTitle:
            "When “Show default forms” is “On,” then every patient in your practice will be shown form(s) that you specify. For example, if Cydoc has created a custom form for your practice, you may choose “On” here in order to specify that you want all your patients to be shown your practice's custom form.",
    },
    [DefaultFormType.ENABLE_HPI_SUBJECTIVE_SECTION_GENERATION]: {
        label: 'Enable HPI/Subjective section generation',
        tooltipTitle:
            "When “Enable HPI/Subjective section generation” is “On”, then Cydoc will automatically interview each patient using medical reasoning to generate an HPI/Subjective section based on that patient's unique chief complaints.",
    },
};

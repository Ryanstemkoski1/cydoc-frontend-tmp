export const DIAGNOSIS_DEFAULT = {
    diagnosis: '',
    comment: '',
};

export const PRESCRIPTION_DEFAULT = {
    recipe_type: '',
    recipe_amount: '',
    signatura: '',
    comment: '',
};

export const PROCEDURES_DEFAULT = {
    procedure: '',
    when: '',
    comment: '',
};

export const REFERRAL_DEFAULT = {
    department: '',
    when: '',
    comment: '',
}

export const CONDITION_DEFAULT = {
    'name': '',
    'differential_diagnosis': [{...DIAGNOSIS_DEFAULT}],
    'prescriptions': [{...PRESCRIPTION_DEFAULT}],
    'procedures_and_services': [{...PROCEDURES_DEFAULT}],
    'referrals': [{...REFERRAL_DEFAULT}],
};

export const FORM_DEFAULTS = {
    "differential_diagnosis": {
        "default": DIAGNOSIS_DEFAULT, 
        "add_button_label": "diagnosis",
        "subheader": "Diagnosis",
        "main_value": "diagnosis",
    },
    "prescriptions": {
        "default": PRESCRIPTION_DEFAULT,
        "add_button_label": "prescription",
        "subheader": "Prescription",
        "main_value": "prescription",
    },
    "procedures_and_services": {
        "default": PROCEDURES_DEFAULT,
        "add_button_label": "procedure or service",
        "subheader": "Procedure",
        "main_value": "procedure",
    },
    "referrals": {
        "default": REFERRAL_DEFAULT,
        "add_button_label": "referral", 
        "subheader": "Department",
        "main_value": "department",
    },
};
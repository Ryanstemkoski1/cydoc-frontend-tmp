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
    'prescription': [{...PRESCRIPTION_DEFAULT}],
    'procedure': [{...PROCEDURES_DEFAULT}],
    'referral': [{...REFERRAL_DEFAULT}],
};


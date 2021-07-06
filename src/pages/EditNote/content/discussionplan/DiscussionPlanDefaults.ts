// TODO: Once DiseaseTag gets refactored, this file can be deleted
export const DIAGNOSIS_DEFAULT = {
    diagnosis: '',
    comment: '',
};

export const PRESCRIPTION_DEFAULT = {
    /* eslint-disable-next-line */
    recipe_type: '',
    /* eslint-disable-next-line */
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
};

export const CONDITION_DEFAULT = {
    name: '',
    /* eslint-disable-next-line */
    differential_diagnosis: [{ ...DIAGNOSIS_DEFAULT }],
    prescriptions: [{ ...PRESCRIPTION_DEFAULT }],
    /* eslint-disable-next-line */
    procedures_and_services: [{ ...PROCEDURES_DEFAULT }],
    referrals: [{ ...REFERRAL_DEFAULT }],
};

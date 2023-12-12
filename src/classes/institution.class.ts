export const favChiefComplaints = [
    'Annual Physical Exam',
    'Hypertension',
    'Diabetes',
    'Urinary Symptoms/UTI',
    'Upper Respiratory Infection Symptoms',
    'PHQ-9 for Depression',
    'Insomnia',
    'Hyperlipidemia',
    'Opiate Use',
    'Genital Symptoms/STI',
    'ADHD',
];

export enum InstitutionType {
    GYN = 'Gyn',
    ENDO = 'Endocrinology',
    DEFAULT = 'Default',
}

export const favComplaintsBasedOnInstituteType = {
    [InstitutionType.GYN]: [
        'Annual Gyn Exam/Well Woman Visit',
        'Birth Control Consultation',
        'Breast Concerns (Breast Pain, Breast Lump, and/or Nipple Discharge)',
        'Changes in Vaginal Discharge',
        'Difficulty Conceiving/Recurrent Pregnancy Loss/Infertility Consult',
        'Early Pregnancy Bleeding and/or Pain',
        'Genital Symptoms/STI',
        'Heavy Periods',
        'Hot Flashes',
        'Irregular Periods/More Frequent Periods/Less Frequent Periods',
        'Low Libido',
        'Painful Intercourse',
        'Painful Periods/Menstrual Cramping',
        'Pre-Conception Counseling',
        'Pregnancy Genetic Counseling',
        'Prenatal Care',
        'Vaginal Dryness',
    ],
    [InstitutionType.ENDO]: [
        'Diabetes',
        'Hyperlipidemia',
        'Hypertension',
        'Hypothyroidism',
        'Hyperthyroidism',
        'Weight Gain or Loss',
        'Fatigue',
    ],
    [InstitutionType.DEFAULT]: favChiefComplaints,
};

const InstitutionTypeMapping = {
    [InstitutionType.GYN]: [
        ' ob ',
        'gyn',
        'obstetrics',
        'gynecology',
        'natal',
        'birth',
        'women',
        'woman',
        'maternal',
        'fetal',
        'fetus',
        'baby',
        'infant',
    ],
    [InstitutionType.ENDO]: ['endocrin', 'draelos metabolic'],
    [InstitutionType.DEFAULT]: [],
};

export class Institution {
    id: string;
    name: string;
    type: InstitutionType;
    favComplaints: string[];
    constructor({ name, id }: { name: string; id: string }) {
        this.id = id;
        this.name = name;
        this.type = Institution.getInstitutionType(name);
        this.favComplaints = favComplaintsBasedOnInstituteType[this.type];
    }
    static getInstitutionType(institutionName = ''): InstitutionType {
        if (!institutionName) return InstitutionType.DEFAULT;
        institutionName = institutionName.toLowerCase();
        for (const [key, value] of Object.entries(InstitutionTypeMapping)) {
            for (let i = 0; i < value.length; ++i) {
                if (institutionName.includes(value[i])) {
                    return key as InstitutionType;
                }
            }
        }
        return InstitutionType.DEFAULT;
    }
}

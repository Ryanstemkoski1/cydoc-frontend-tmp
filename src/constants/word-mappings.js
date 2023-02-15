/**
 * This file contains a mapping of medical terms to help reduce redundancy. The way it works
 * is that all synonyms will map to the official term, including the word itself.

 * e.g.  heart attack -> myocardial infarction
 * e.g.  myocardial infarction -> myocardial infarction
 *
 * The purpose behind this is to "group" terms by their official name. So when this dictionary
 * expands, we can account for more than just one synonym, and it will be easy to check whether
 * one of the synonyms was present.
 */
export const MEDICAL_TERM_TRANSLATOR = {
    'heart attack': 'myocardial infarction',
    'high blood pressure': 'hypertension',
    'low blood pressure': 'hypotension',
    'shortness of breath': 'dyspnea',
    fainting: 'syncope',
    'high cholesterol': 'hypercholesterolemia',
    'high triglycerides': 'hypertriglyceridemia',
    phlegm: 'sputum',
    'slow heart rate': 'bradycardia',
    'slow heartbeat': 'bradycardia',
    'fast heart rate': 'tachycardia',
    'fast heartbeat': 'tachycardia',
    gallstones: 'cholelithiasis',
    sweating: 'diaphoresis',
    'vomiting blood': 'hematemesis',
    'heavy period': 'menorrhagia',
    'enlarged spleen': 'splenomegaly',
    'enlarged liver': 'hepatomegaly',
    'pain with urination': 'dysuria',
    'urgency with urination': 'urgency',
    'frequent urination': 'frequency',
    'blood in your urine': 'hematuria',
    itching: 'pruritus',
    'runny nose': 'rhinorrhea',
    pooping: 'defecation',
    'heart palpitations': 'palpitations',
    peeing: 'urinating',
    'drinking a lot of beverages': 'polydipsia',
    'peeing a lot': 'polyuria',
    'pus coming out of the eyes': 'purulent eye discharge',
    'eyes uncomfortable in bright light': 'photophobia',
    'cough with phlegm': 'productive cough',
    'clot in the lung': 'pulmonary embolism',
    'clot in the leg': 'DVT',
};

export const ABBREVIFY = {
    'acute coronary syndrome': 'ACS',
    'chronic obstructive pulmonary disease': 'COPD',
    'myocardial infarction': 'MI',
    'atherosclerotic cardiovascular disease': 'ASCVD',
    'benign prostatic hyperplasia': 'BPH',
    'coronary artery disease': 'CAD',
    'congestive heart failure': 'CHF',
    'cardiovascular disease': 'CVD',
    'end-stage renal disease': 'ESRD',
    'inflammatory bowel disease': 'IBD',
    'irritable bowel syndrome': 'IBS',
    osteoarthritis: 'OA',
    'obstructive sleep apnea': 'OSA',
    'pulmonary embolism': 'PE',
    'transient ischemic attack': 'TIA',
    'urinary tract infection': 'UTI',
    'upper respiratory infection': 'URI',
    'acute respiratory distress syndrome': 'ARDS',
    'gastroesophageal reflux disease': 'GERD',
    'mycobacterium avium complex': 'MAC',
    'postural orthostatic tachycardia syndrome': 'POTS',
};

const generateMedicalMapping = () => {
    const mapping = {};
    Object.keys(MEDICAL_TERM_TRANSLATOR).forEach((term) => {
        let value = MEDICAL_TERM_TRANSLATOR[term];
        mapping[term] = value;
        mapping[value] = value;
    });

    // For abbreviations, we want to map abbreviations to the actual term
    Object.keys(ABBREVIFY).forEach((term) => {
        let value = ABBREVIFY[term];
        mapping[value.toLowerCase()] = term;
    });
    return mapping;
};

export const medicalMapping = generateMedicalMapping();

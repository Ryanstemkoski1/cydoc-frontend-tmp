//key: unpreferred, value: preferred
const diseaseSynonyms: { [key: string]: string } = {
    'heart attack': 'myocardial infarction',
    'high blood pressure': 'hypertension',
    'low blood pressure': 'hypotension',
    'chest pain': 'angina',
    'shortness of breath': 'dyspnea',
    fainting: 'syncope',
    urination: 'micturition',
    urinate: 'micturate',
    'high cholesterol': 'hypercholesterolemia',
    hyperlipidemia: 'hypercholesterolemia',
    'high triglycerides': 'hypertriglyceridemia',
    phlegm: 'sputum',
    heartburn: 'gastroesophageal reflux disease',
    'slow heart rate': 'bradycardia',
    'fast heart rate': 'tachycardia',
    gallstones: 'cholelithiasis',
    sweating: 'diaphoresis',
    'vomiting blood': 'hematemesis',
    'heavy period': 'menorrhagia',
    'enlarged spleen': 'splenomegaly',
    'enlarged liver': 'hepatomegaly',
};

export default diseaseSynonyms;

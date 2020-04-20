export const allergies = {
    "fields": ["Inciting Agent", "Reaction", "Comments"],
    "state": [{ "Inciting Agent": "", "Reaction": "", "Comments": "" },
    { "Inciting Agent": "", "Reaction": "", "Comments": "" },
    { "Inciting Agent": "", "Reaction": "", "Comments": "" }]
};

export const medications = {
    "fields": ['Drug Name', 'Start Date', 'Schedule', 'Dose', 'Reason for Taking', "Side Effects" , 'Comments'],
    "state": [{ "Drug Name": "", "Start Date": "", "Schedule": "", "Dose": "", "Reason for Taking": "", "Side Effects": "", "Comments": "" },
    { "Drug Name": "", "Start Date": "", "Schedule": "", "Dose": "", "Reason for Taking": "", "Side Effects": "", "Comments": "" },
    { "Drug Name": "", "Start Date": "", "Schedule": "", "Dose": "", "Reason for Taking": "", "Side Effects": "", "Comments": "" }]
};

export const surgicalHistory = {
    "fields": ["Procedure", "Date", "Comments"],
    "state": [{ "Procedure": "", "Date": "", "Comments": "" },
    { "Procedure": "", "Date": "", "Comments": "" },
    { "Procedure": "", "Date": "", "Comments": "" }]
};

export const reviewOfSystems = {
    "state": {
        "General": {"Δ weight": "", "Fatigue": "", "Weakness": "", "Fevers": "", "Chills": "", "Night sweats": ""},
        "Eyes": {"Glasses": "", "Contacts": "", "Blurriness": ""},
        "Ears": {"Δ hearing": "", "Hearing loss": "", "Tinnitus": "", "Earache": "", "Discharge": ""},
        "Nose": {"Colds": "", "Stuffiness": "", "Sneezing": "", "Itching": "", "Allergy": "", "Nosebleed": ""},
        "Mouth": {"Δ teeth": "", "Bleeding gums": "", "Sore throat": "", "Hoarseness": ""},
        "Throat": {"Lumps": "", "Swelling": "", "Pain": "", "Stiffness": ""},
        "Respiratory": {"Dyspnea": "", "Dyspnea on exertion": "", "Nocturnal dyspnea": "", "Orthopnea": "", "Wheezing": "", "Cough": "", "Asthma": "", "Bronchitis": "", "Emphysema": "", "Pneumonia": "", "Tuberculosis": ""},
        "Cardiovascular/Hematological": {"Chest pain": "", "Palpitations": "", "High BP": "", "Low BP": "", "Murmurs": "", "Edema": "", "Varicose veins": "", "Claudication": "", "Easy bruising": "", "Easy bleeding": "", "Anemia": "", "Transfusions": ""},
        "Gastrointestinal": {"Δ appetite": "", "Nausea": "", "Vomiting": "", "Abdominal pain": "", "Dysphagia": "", "Heartburn": "", "Bloating": "", "Diarrhea": "", "Constipation": "", "Hematemesis": "", "Hemorrhoids": "", "Melena": "", "Hematochezia": ""},
        "Genitourinary": {"Urinary tract infection": "", "Δ stream": "", "Frequency": "", "Hesitancy": "", "Urgency": "", "Polyuria": "", "Hematuria": "", "Nocturia": "", "Incontinence": "", "Stones": ""},
        "Genital/Sexual/Gynecological": {"Discharge": "", "Sores": "", "Itching": "", "STD": "", "Contraception": "", "Hernias": "", "Testicular/vaginal pain": "", "Testicular mass": "", "Breast pain": "", "Breast masses": "", "Breast lumps": "", "Discharge": "", "Period irregularities": "", "Pregnancy complications": ""},
        "Musculoskeletal": {"Osteoarthritis": "", "Rheumatoid arthritis": "", "Joint stiffness": "", "Joint pain": "", "Joint swelling": "", "Muscle cramps": "", "Muscle weakness": "", "Muscle pain": ""},
        "Skin/Hair/Nails": {"Rashes": "", "Itching": "", "Dryness": "", "Δ hair": "", "Δ nails": "", "Sores": "", "Lumps": "", "Moles": ""},
        "Endocrine": {"Heat intolerance": "", "Cold intolerance": "","Excessive sweating": "","Polydipsia": "","Polyphagia": "","Hyperthyroidism": "","Hypothyroidism": "","Diabetes": "","Skin color change": "","Excess hair growth": ""},
        "Neuro": {"Headache": "","Δ vision": "","Double vision": "","Fainting/blackouts": "","Seizures": "","Paralysis": "","Numbness": "","Tingling": "","Loss of sensation": "","Vertigo/dizziness": "","Tremor": "","Difficulty walking": "","Δ coordination": "","Confusion": "","Memory loss": ""},
        "Psych": {"Anxiety": "", "Depression": "", "Suicide attempts": ""}
    }
}

export const physicalExam = {
    "state": {
        "Vitals": {"Systolic Blood Pressure": 0, "Diastolic Blood Pressure": 0, "Heart Rate": 0, "RR": 0, "Temperature": 0, "Oxygen Saturation": 0},
        "General": {"Height": 0, "Weight": 0},
        "Head": {"Normocephalic": false, "Atraumatic": false, "Abnormal Findings": ""},
        "Eyes": {"PERRLA": false, "Sclera anicteric": false, "No redness": false, "No discharge": false, "EOMI": false, "Visual acuity intact": false, "Visual fields normal": false, "Fundoscopy": "", "Abnormal Findings": ""},
        "Ears": {"Normal auditory acuity": false, "Normal Rinne": false, "Normal Weber": false, "Otoscopy": "", "Abnormal Findings": ""},
        "Nose/Throat": {"Oropharynx Clear": false, "MMM": false, "Tongue pink and moist": false, "Tongue protrudes midline": false, "Symmetric palate elevation": false, "Normal swallowing": false, "Normal phonation": false, "Internal/External Nose": "", "Abnormal Findings": ""},
        "Neck": {"Supple": false, "No Thyromegaly": false, "No Lymphadenopathy": false, "Abnormal Findings": ""},
        "Pulmonary": {"CTAB": false, "No wheezes, rales, or rhonchi": false, "Normal percussion": false, "No scars or skin lesion on back": false, "No CVAT": false, "Abnormal Findings": ""},
        "Cardiac": {"RRR": false, "Normal S1, S2": false, "No murmurs": false, "No rubs": false, "No gallops": false, "Normal PMI": false, "No bruits": false, "Normal JVP": false, "Abnormal Findings": ""},
        "Pulses": {"Normal brachial": false, "Normal radial": false, "Normal ulnar": false, "Normal dorsalis pedis": false, "Abnormal Findings": ""},
        "Gastrointestinal": {"Normal bowel sounds": false, "No bruits": false, "No hepatomegaly": false, "No splenomegaly": false, "Soft": false, "Nontender": false, "Nondistended": false, "No rebounding": false, "No guarding": false, "No masses": false, "Abnormal Findings": ""},
        "Tendon Reflexes": {"No dubbing": false, "No cyanosis": false, "No nail changes": false, "No edema": false, "Abnormal Findings": ""},
        "Extremities": {"Normal biceps": false, "Normal brachioradials": false, "Normal triceps": false, "Normal patellar": false, "Normal ankle jerk": false, "Normal plantar": false, "Abnormal Findings": ""},
        "Skin": {"Warm and dry": false, "No visible lesions": false, "No tenting": false, "Normal turgor": false, "Abnormal Findings": ""},
        "Lungs": {"Left Upper Lobe": {"wheezes": false, "rales": false, "rhonchi": false}, "Right Upper Lobe": {"wheezes": false, "rales": false, "rhonchi": false}, "Lingula": {"wheezes": false, "rales": false, "rhonchi": false}, "Right Middle Lobe": {"wheezes": false, "rales": false, "rhonchi": false}, "Left Lower Lobe": {"wheezes": false, "rales": false, "rhonchi": false}, "Right Lower Lobe": {"wheezes": false, "rales": false, "rhonchi": false}},
        "Abdomen": {"Right Upper Quadrant": {"tenderness": false, "rebound": false, "guarding": false}, "Left Upper Quadrant": {"tenderness": false, "rebound": false, "guarding": false}, "Right Lower Quadrant": {"tenderness": false, "rebound": false, "guarding": false}, "Left Lower Quadrant": {"tenderness": false, "rebound": false, "guarding": false}},
        "Pulse": [],
        "Reflex": [],
    }
}

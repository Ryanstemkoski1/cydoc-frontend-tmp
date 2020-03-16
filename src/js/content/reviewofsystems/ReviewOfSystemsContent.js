import React, { Component, Fragment } from 'react';
import { Grid, Button, Checkbox } from 'semantic-ui-react'

import ReviewOfSystemsCategory from './ReviewOfSystemsCategory'

//Component that manages the content for the Review of Systems section of the note
export default class ReviewOfSystemsContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            test: {
                "General": ["Δ weight", "Fatigue", "Weakness", "Fevers", "Chills", "Night sweats"],
                "Eyes": ["Glasses", "Contacts", "Blurriness"],
                "Ears": ["Δ hearing", "Hearing loss", "Tinnitus", "Earache", "Discharge"],
                "Nose": ["Colds", "Stuffiness", "Sneezing", "Itching", "Allergy", "Nosebleed"],
                "Mouth": ["Δ teeth", "Bleeding gums", "Sore throat", "Hoarseness"],
                "Throat": ["Lumps", "Swelling", "Pain", "Stiffness"],
                "Respiratory": ["Dyspnea", "Dyspnea on exertion", "Nocturnal dyspnea", "Orthopnea", "Wheezing", "Cough", "Asthma", "Bronchitis", "Emphysema", "Pneumonia", "Tuberculosis"],
                "Cardiovascular/Hematological": ["Chest pain", "Palpitations", "High BP", "Low BP", "Murmurs", "Edema", "Varicose veins", "Claudication", "Easy bruising", "Easy bleeding", "Anemia", "Transfusions"],
                "Gastrointestinal": ["Δ appetite", "Nausea", "Vomiting", "Abdominal pain", "Dysphagia", "Heartburn", "Bloating", "Diarrhea", "Constipation", "Hematemesis", "Hemorrhoids", "Melena", "Hematochezia"],
                "Genitourinary": ["Urinary tract infection", "Δ stream", "Frequency", "Hesitancy", "Urgency", "Polyuria", "Hematuria", "Nocturia", "Incontinence", "Stones"],
                "Genital/Sexual/Gynecological": ["Discharge", "Sores", "Itching", "STD", "Contraception", "Hernias", "Testicular/vaginal pain", "Testicular mass", "Breast pain", "Breast masses", "Breast lumps", "Discharge", "Period irregularities", "Pregnancy complications"],
                "Musculoskeletal": ["Osteoarthritis", "Rheumatoid arthritis", "Joint stiffness", "Joint pain", "Joint swelling", "Muscle cramps", "Muscle weakness", "Muscle pain"],
                "Skin/Hair/Nails": ["Rashes", "Itching", "Dryness", "Δ hair", "Δ nails", "Sores", "Lumps", "Moles"],
                "Endocrine": ["Heat intolerance", "Cold intolerance","Excessive sweating","Polydipsia","Polyphagia","Hyperthyroidism","Hypothyroidism","Diabetes","Skin color change","Excess hair growth"],
                "Neuro": ["Headache","Δ vision","Double vision","Fainting/blackouts","Seizures","Paralysis","Numbness","Tingling","Loss of sensation","Vertigo/dizziness","Tremor","Difficulty walking","Δ coordination","Confusion","Memory loss"],
                "Psych": ["Anxiety", "Depression", "Suicide attempts"]
            }
        }
    }


    generateList = (systemsCategories) => {
        return Object.keys(systemsCategories).map(
            (label) =>
                    <ReviewOfSystemsCategory category={label} options={systemsCategories[label]} />
        )
    }

    render() {
        return (
            <Fragment>
                <Grid columns={3} className="ui stackable grid" padded>
                    {this.generateList(this.state.test)}
                </Grid>
            </Fragment>
        );
    }
}
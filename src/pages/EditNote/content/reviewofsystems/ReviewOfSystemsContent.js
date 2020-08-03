import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import './ReviewOfSystems.css';
import ReviewOfSystemsCategory from './ReviewOfSystemsCategory';
import {ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP} from 'constants/breakpoints';

//Component that manages the content for the Review of Systems section of the note
export default class ReviewOfSystemsContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            test: {
                "General": ["Weight changes", "Fatigue", "Weakness", "Fevers", "Chills", "Night sweats"],
                "Eyes": ["Glasses", "Contacts", "Blurriness"],
                "Ears": ["Changes in hearing", "Hearing loss", "Tinnitus", "Earache", "Discharge"],
                "Nose": ["Colds", "Stuffiness", "Sneezing", "Itching", "Allergy", "Nosebleed"],
                "Mouth": ["Changes in teeth", "Bleeding gums", "Sore throat", "Hoarseness"],
                "Throat": ["Lumps", "Swelling", "Pain", "Stiffness"],
                "Respiratory": ["Dyspnea", "Dyspnea on exertion", "Nocturnal dyspnea", "Orthopnea", "Wheezing", "Cough", "Asthma", "Bronchitis", "Emphysema", "Pneumonia", "Tuberculosis"],
                "Cardiovascular/Hematological": ["Chest pain", "Palpitations", "High BP", "Low BP", "Murmurs", "Edema", "Varicose veins", "Claudication", "Easy bruising", "Easy bleeding", "Anemia", "Transfusions"],
                "Gastrointestinal": ["Changes in appetite", "Nausea", "Vomiting", "Abdominal pain", "Dysphagia", "Heartburn", "Bloating", "Diarrhea", "Constipation", "Hematemesis", "Hemorrhoids", "Melena", "Hematochezia"],
                "Genitourinary": ["Urinary tract infection", "Changes in stream", "Frequency", "Hesitancy", "Urgency", "Polyuria", "Hematuria", "Nocturia", "Incontinence", "Stones"],
                "Genital/Sexual/Gynecological": ["Discharge", "Sores", "Itching", "STD", "Contraception", "Hernias", "Testicular/vaginal pain", "Testicular mass", "Breast pain", "Breast masses", "Breast lumps", "Period irregularities", "Pregnancy complications"],
                "Musculoskeletal": ["Osteoarthritis", "Rheumatoid arthritis", "Joint stiffness", "Joint pain", "Joint swelling", "Muscle cramps", "Muscle weakness", "Muscle pain"],
                "Skin/Hair/Nails": ["Rashes", "Itching", "Dryness", "Changes in hair", "Changes in nails", "Sores", "Lumps", "Moles"],
                "Endocrine": ["Heat intolerance", "Cold intolerance","Excessive sweating","Polydipsia","Polyphagia","Hyperthyroidism","Hypothyroidism","Diabetes","Skin color change","Excess hair growth"],
                "Neurological": ["Headache","Changes in vision","Double vision","Fainting/blackouts","Seizures","Paralysis","Numbness","Tingling","Loss of sensation","Vertigo/dizziness","Tremor","Difficulty walking","Changes in coordination","Confusion","Memory loss"],
                "Psych": ["Anxiety", "Depression", "Suicide attempts"]
            }
        }
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    generateList = (systemsCategories) => {
        return Object.keys(systemsCategories).map(
            (label) =>
                    <ReviewOfSystemsCategory
                        key={label}
                        category={label}
                        options={systemsCategories[label]}
                    />
        )
    }

    render() {
        const { windowWidth } = this.state;
        
        let numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 4;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }
        
        return (
            <Masonry className='ros-container' breakpointCols={numColumns} columnClassName='ros-column'>
                {this.generateList(this.state.test)}
            </Masonry>
        );
    }
}
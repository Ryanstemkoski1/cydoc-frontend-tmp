import { get } from 'http';
import React from 'react';
import axios from 'axios';

const example = {1:['the patient has hypertension',''],
2:['the patient has had hypertension for ANSWER','10 years'],
3:['The patient suffers from the following comorbid conditions: ANSWER','diabetes, high cholesterol, heart attack'],
4:['their usual blood pressure reading is ANSWER','150/110'],
5:['the patient reports that recently their blood pressure has ANSWER','increased'],
6:['the patient monitors their blood pressure from home',''],
7:['the patient has the following questions about monitoring their blood pressure: ANSWER','how many times per day should I check my blood pressure'],
9:['the patient is taking antihypertensive medications','atenolol, torsemide'],
10:['The patient is suffering from medication side effects',''],
11:['the patient has experienced ANSWER.','dizziness and headaches sometimes in the morning'],
12:['The patient has the following questions about their medications: ANSWER','can I stop taking torsemide'],
13:['The patient is actively trying to reduce their blood pressure.',''],
14:['To reduce their blood pressure, the patient tries: ANSWER','I do yoga on Tuesdays and I try to stop eating salty foods'],
15:['The patient reports a stress level of ANSWER out of 10','5'],
16:['The patient\'s sources of stress are ANSWER','my job'],
17:['Additionally, the patient has a family history of ANSWER','high blood pressure'],
18:['The following barriers make it difficult for the patient to reduce their blood pressure: ANSWER','I work really long hours'],
19:['The patient believes that the clinician can help them overcome these barriers by: ANSWER','giving me better medicine']};

class HPINote extends React.Component {

    constructor() {
        super();
        this.state = {
            hpiText: ""
        }
    }

    // would setState here to assign hpiText to whatever the response is from this request
    componentDidMount() {
        axios.get('http://127.0.0.1:5000/hpi', { 
            params: {'HPI': example, "lastName": "Lee", "gender": "F", "title": "Ms."}, 
            headers: {"content-type": "application/json", "charset":"utf-8"}
        }).then(response => console.log(response));
    }

    render() {
        return (
            <div>
                {this.state.hpiText}
            </div>
        );
    }

}

export default HPINote;
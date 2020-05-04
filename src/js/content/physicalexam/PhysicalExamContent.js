import React, { Fragment } from 'react';
import { Form, Grid, Input, Button } from "semantic-ui-react";
import PhysicalExamGroup from './PhysicalExamGroup';
import constants from '../../constants/physical-exam-constants.json'
import HPIContext from '../../contexts/HPIContext';
import LungSounds from './widgets/LungSounds'
import AbdomenExam from './widgets/AbdomenExam';
import RightLeftWidget from './widgets/RightLeftWidget';
//import NumericInput from 'react-numeric-input';

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
    }

    render() {
        return (
           constants.sections.map((section) => 
               <PhysicalExamGroup name={section.name} rows={section.rows}/>
           )
        )
    }

}
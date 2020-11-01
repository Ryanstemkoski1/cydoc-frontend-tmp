import React from 'react'
import "../css/Button.css"
import ButtonTag from "./ButtonTag";
import YesNo from "./YesNo";
import HandleInput from "./HandleInput"
import HandleNumericInput from "./HandleNumericInput";
import TimeInput from "./TimeInput";
import FamilyHistoryContent from "../../../../familyhistory/FamilyHistoryContent";
import MedicalHistoryContent from "../../../../medicalhistory/MedicalHistoryContent";
import MedicationsContent from "../../../../medications/MedicationsContent";
import SurgicalHistoryContent from "../../../../surgicalhistory/SurgicalHistoryContent";
import HPIContext from 'contexts/HPIContext.js';
import ListText from "./listText";
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';

class QuestionAnswer extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            response_array: [],
            startDate: new Date(),
            scale: 0,
            input: ""
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

    render() {
        const { windowWidth } = this.state;
        const { responseType } = this.props;
        
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        let button_map = [];
        if (responseType === "YES-NO" || responseType === "NO-YES") {
            button_map.push(
                <YesNo
                    key={this.props.node}
                    node={this.props.node}
                /> )}
        else if (responseType === "SHORT-TEXT" || responseType === "LONG-TEXT") {
            button_map.push(<HandleInput key={this.props.node}
                                         node={this.props.node}
                                          />)
        }
        else if (responseType === 'TIME') {
            button_map.push(<TimeInput key={this.props.node}
                                       node={this.props.node}
                                        />)
        }
        else if (responseType === 'LIST-TEXT') {
            button_map.push(<ListText
                key={this.props.node}
                node={this.props.node}
                 />)
        }
        else if (responseType === 'CLICK-BOXES'|| responseType === 'MEDS-POP' || responseType === 'nan') {
            button_map = this.props.response_choice.map(item =>
                <ButtonTag
                    key={item}
                    name={item}
                    node={this.props.node}
                />
            )
        }
        else if (responseType === 'AGE') {
            button_map.push( <HandleNumericInput
                key={this.props.node}
                node={this.props.node}
                max={120}
            /> )}
        else if (responseType === "NUMBER") {
            button_map.push(<HandleNumericInput
                key={this.props.node}
                node={this.props.node}
                max={10}
            />)
        }
        else if (responseType === "FH-POP") {
            button_map.push(<FamilyHistoryContent
                key={this.props.node}
                response_choice={this.props.response_choice}
                fh_pop={true}
            />) 
        }
        else if (responseType === "PMH-POP") {
            button_map.push(<MedicalHistoryContent
                key={this.props.node}
                response_choice={this.props.response_choice}
                collapseTabs={collapseTabs}
            />)
        } 
        else if (responseType === "MEDS-BLANK") {
            button_map.push(<MedicationsContent
                key={this.props.node}
                pop={true}
                mobile={collapseTabs}
            />)
        }
        else if (responseType === "PSH-BLANK") {
            button_map.push(<SurgicalHistoryContent
                key={this.props.node}
                pop={true}
            />)
        }
        return (
            <div className='qa-div'> 
                <div> {this.props.question} <div className='qa-button'>{button_map}</div> </div>
            </div>
        )
    }
}
export default QuestionAnswer
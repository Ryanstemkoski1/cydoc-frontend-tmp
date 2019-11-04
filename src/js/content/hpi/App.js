import React, {Component} from 'react';
import './knowledgegraph/src/App.css';
import ButtonItem from "./knowledgegraph/src/ButtonItem.js"
import diseaseData from "./knowledgegraph/src/Diseases";
import PositiveDiseases from "./knowledgegraph/src/PositiveDiseases";
import DiseaseForm from "./knowledgegraph/src/DiseaseForm";

class App extends Component {
    constructor() {
        super()
        this.state = {
            diseaseArray: diseaseData,
            diseases_positive: [],
            step: 1
        }
        this.handler = this.handler.bind(this)
        this.tabHandler = this.tabHandler.bind(this)
    }

    handler(value, id) {
        var new_array = this.state.diseases_positive
        if (id === 1) {
            new_array = new_array.concat(value)
        }
        else if (id===-1) {
            new_array.splice(new_array.indexOf(value), 1)
        }
        this.setState({diseases_positive: new_array})
    }

    // Proceed to next step
    nextStep = () => {
        const { step } = this.state; //destructuring
        this.setState( {
            step: step + 1
        })
    }

    // Go back to previous step
    prevStep = () => {
        const { step } = this.state;
        this.setState( {
            step: step - 1
        })
    }

    continue = e => {
        e.preventDefault();
        this.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.prevStep();
    }

    tabHandler(evt, index) {
        this.setState({step: index+2})
        let tab_list = document.getElementsByClassName("tab")
        for (let i = 0; i < tab_list.length; i++) {
            tab_list[i].className = tab_list[i].className.replace(" active", "");
          }
        evt.currentTarget.className += " active"
        console.log(tab_list)
    }

    // Handle fields change

    handleChange = input => e => {
        this.setState({[input]: e.target.value})
    }

    render() {
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        const diseaseComponents = this.state.diseaseArray.map(item =>
            <ButtonItem
                key={item.id}
                disease_id={item.id}
                name={item.name}
                diseases_list={item.diseases}
                handler = {this.handler}
            />)
        const positiveDiseases = this.state.diseases_positive.map(disease =>
            <PositiveDiseases
                key={disease}
                name={disease}
            />
        );
        let diseaseTabs = this.state.diseases_positive.map((disease, index) =>
            <button
                key={index}
                className="tab"
                onClick={(evt) => this.tabHandler(evt, index)}
            >
                {disease}
            </button>
        );
        const { step } = this.state;

        switch(step) {
            case 1:
                return (
                    <div className="App">
                        {positiveDiseases}
                        <div className="diseaseComponents"> {diseaseComponents} </div>
                        <button onClick={this.continue} style={{float:'right', marginBottom: 20}}
                                className='NextButton'> &raquo; </button>
                    </div>
                    )
            case this.state.diseases_positive.length+2:
                return (
                    <div>
                        <h1> Success </h1>
                        <button onClick={this.back} className='NextButton'> &laquo; </button>
                    </div>)
            default:
                return (
                    <DiseaseForm
                        key={step-2}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        handleChange = {this.handleChange}
                        category = {this.state.diseases_positive[step-2]}
                        diseaseTabs = {diseaseTabs}
                    />
                    )
        }
    }
}

export default App;

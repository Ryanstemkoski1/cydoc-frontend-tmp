import React, {Component} from 'react';
import './App.css';
import ButtonItem from "./ButtonItem"
import diseaseData from "./Diseases";
import PositiveDiseases from "./PositiveDiseases";
import DiseaseForm from "./DiseaseForm";

class Intermediate extends Component {
    constructor() {
        super()
        this.state = {
            diseaseArray: diseaseData,
            diseases_positive: [],
            step: 1
        }
        this.handler = this.handler.bind(this)
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
        const { step } = this.state;
        this.setState( {
            step: step + 1
        })
    }

    //Go back to previous step
    prevStep = () => {
        const { step } = this.state;
        this.setState( {
            step: step - 1
        })
    }

    continue = e => {
        e.preventDefault();
        this.nextStep();
        // this.prevStep();
    }

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
        var positiveDiseases = this.state.diseases_positive.map(disease =>
            <PositiveDiseases
                key={disease}
                name={disease}
                status={this.state.disease_status}
            />
        )
        const { step } = this.state;

        switch(step) {
            case 1:
                return (
                    <div className="App">
                        {positiveDiseases}
                        <div className="diseaseComponents"> {diseaseComponents} </div>
                        <button onClick={this.continue}> Next </button>
                    </div>
                    )
            case 2:
                return (
                    <DiseaseForm
                    nextStep = {this.nextStep}
                    prevStep = {this.prevStep}
                    handleChange = {this.handleChange}
                    />
                    )
            case 3:
                return(<h1> Success </h1>)
        }
    }
}

export default Intermediate;

import React, {Component} from 'react';
import './knowledgegraph/src/css/App.css';
import ButtonItem from "./knowledgegraph/src/components/ButtonItem.js"
import diseaseData from "./knowledgegraph/src/components/data/Diseases";
import PositiveDiseases from "./knowledgegraph/src/components/PositiveDiseases";
import DiseaseForm from "./knowledgegraph/src/components/DiseaseForm";
import DiseasesNames from "./knowledgegraph/src/components/data/DiseasesNames";
import axios from "axios";
import Summary from "./knowledgegraph/src/Summary";
import API from "./knowledgegraph/src/API.js"

class HPIContent extends Component {
    constructor() {
        super()
        this.state = {
            diseaseArray: diseaseData,
            graphData: {},
            diseases_positive: [],
            step: 1,
            isLoaded: false,
            diseasesNames: DiseasesNames,
            hpi: {},
            children: []
        }
        this.handler = this.handler.bind(this)
        this.tabHandler = this.tabHandler.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleResponse = this.handleResponse.bind(this)
    }

    componentDidMount() {
        const data = API
        data.then(res => this.setState({isLoaded: true, graphData: res.data}))
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
    }

    // Handle fields change

    handleChange = input => e => {
        this.setState({[input]: e.target.value})
    }

    // receive the hpi dictionary and update dictionary
    handleResponse(dict, category) {
        var newDict = this.state.hpi
        newDict[category] = dict
        this.setState({hpi: newDict})
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
        // let categoryDict = {}
        const {step, graphData, isLoaded, diseasesNames} = this.state;
        switch(step) {
            case 1:
                return (
                    <div className="App">
                        {positiveDiseases}
                        <div className="diseaseComponents"> {diseaseComponents} </div>
                        <button onClick={this.continue} style={{float:'right'}} className='NextButton'> &raquo; </button>
                    </div>
                    )
            case this.state.diseases_positive.length+2:
                return (
                    <Summary
                        key={this.state.diseases_positive.length}
                        hpi={this.state.hpi}
                        back={this.back}
                    />
                    )
            default:
                if (isLoaded) {
                    let category = this.state.diseases_positive[step-2]
                    let parent_code = diseasesNames[category]
                    let category_code = graphData['nodes'][parent_code]['category']
                return (
                    <DiseaseForm
                        key={step-2}
                        graphData={this.state.graphData}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        handleChange = {this.handleChange}
                        category = {category}
                        diseaseTabs = {diseaseTabs}
                        handleResponse={this.handleResponse}
                        parent_code = {parent_code}
                        tab_category = {category_code}
                        newDict = {this.state.hpi[category_code]}
                    />
                    )}
                else {return <h1> Loading... </h1>}
        }
    }
}

export default HPIContent;

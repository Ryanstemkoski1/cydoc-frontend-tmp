import React, {Component} from 'react';
import {Menu, Container} from 'semantic-ui-react'
import './src/css/App.css';
import ButtonItem from "./src/components/ButtonItem.js"
import diseaseData from "./src/components/data/Diseases";
import PositiveDiseases from "./src/components/PositiveDiseases";
import DiseaseForm from "./src/components/DiseaseForm";
import DiseasesNames from "./src/components/data/DiseasesNames";
import API from "./src/API.js"
import {Grid} from "semantic-ui-react";
import HPIContext from "../../../contexts/HPIContext";

class HPIContent extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context) 
        this.state = {
            diseaseArray: diseaseData,
            graphData: {},
            isLoaded: false, 
            diseasesNames: DiseasesNames,
            children: [],
            activeItem: "",
            categories: {}
        }
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    componentDidMount() {
        const data = API
        data.then(res => {
            var categories = new Set()
            var nodes = res.data['nodes'] 
            for (var node in nodes) categories.add(nodes[node]["category"])
            this.setState({isLoaded: true, graphData: res.data, categories: categories})
        })}

    // Proceed to next step
    nextStep = () => {
        this.context.onContextChange("step", this.context['step'] + 1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][this.context['step']-1])
    }

    // Go back to previous step
    prevStep = () => {
        this.context.onContextChange("step", this.context['step'] - 1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][this.context['step']-1])
    }

    continue = e => {
        e.preventDefault();
        this.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.prevStep();
    }

    handleItemClick = (e, {name}) => { 
        this.context.onContextChange("step", this.context['positivediseases'].indexOf(name)+2) 
        this.context.onContextChange("activeHPI", name)
    }
    

    render() {
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        const diseaseComponents = this.state.diseaseArray.map(item =>
            <Grid.Column>
            <ButtonItem
                key={item.id}
                disease_id={item.id}
                name={item.name}
                diseases_list={item.diseases}
            />
            </Grid.Column>)
            const positiveDiseases = this.context["positivediseases"].map(disease =>
                <PositiveDiseases
                    key={disease} 
                    name={disease}
                />
            );

        const diseaseTabs = this.context['positivediseases'].map((name, index) => 
        <a>
        <Menu.Item
                key={index}
                name={name}
                active={this.context['activeHPI'] === name}
                onClick={this.handleItemClick}
                style={{borderColor: "white", fontSize: '13px'}}
                /></a>
        )

        const {graphData, isLoaded, diseasesNames} = this.state;
        var step = this.context['step']
        const positive_length = this.context['positivediseases'].length
        switch(step) {
            case 1:
                return (
                    <div className="App"> 
                        {positiveDiseases}
                        <Grid columns={2} padded className="ui stackable grid"> {diseaseComponents} </Grid> 
                        {positive_length > 0 ? <button onClick={this.continue} style={{float:'right'}} className='NextButton'> &raquo; </button>: ""}
                    </div>
                    )
            default:
                if (isLoaded) { 
                    let category = this.context['positivediseases'][step-2]
                    let parent_code = diseasesNames[category]
                    let category_code = graphData['nodes'][parent_code]['category']
                return (
                    <DiseaseForm
                        key={step-2}
                        graphData={graphData}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        category = {category}
                        diseaseTabs = {diseaseTabs}
                        parent_code = {parent_code}
                        tab_category = {category_code}
                        last = {true ? step === positive_length+1 : false}
                    />
                    )}
                else {return <h1> Loading... </h1>}
        }
    }
}

export default HPIContent;

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
            // diseases_positive: [],
            // step: 1,
            isLoaded: false, 
            diseasesNames: DiseasesNames,
            // hpi: {},
            children: [],
            activeItem: ""
        }
        // this.handler = this.handler.bind(this)
        // this.tabHandler = this.tabHandler.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    componentDidMount() {
        const data = API
        data.then(res => this.setState({isLoaded: true, graphData: res.data}))
    }

    // handler(value, id) {
    //     var new_array = this.state.diseases_positive
    //     if (id === 1 && new_array.indexOf(value) === -1) {
    //         new_array = new_array.concat(value)
    //     }
    //     else if (id===-1) {
    //         new_array.splice(new_array.indexOf(value), 1)
    //     }
    //     this.setState({diseases_positive: new_array})
    // }

    // Proceed to next step
    nextStep = () => {
        const { step } = this.state; //destructuring
        // this.setState( {
        //     step: step + 1
        // })
        this.context.onContextChange("step", this.context['step'] + 1)
    }

    // Go back to previous step
    prevStep = () => {
        const { step } = this.state;
        // this.setState( {
        //     step: step - 1
        // })
        this.context.onContextChange("step", this.context['step'] - 1)
    }

    continue = e => {
        e.preventDefault();
        this.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.prevStep();
    }

    // tabHandler(evt, index) {
    //     this.context.onContextChange("step", index+2)
    //     let tab_list = document.getElementsByClassName("tablinks")
    //     for (var i=0; i<tab_list.length; i++) {
    //         tab_list[i].className = tab_list[i].className.replace(" active", "")
    //     }
    //     evt.currentTarget.className += " active"
    // }

    handleItemClick = (e, {name}) => {
        this.context.onContextChange("step", this.context['positivediseases'].indexOf(name)+2)
        this.setState({ activeItem: name });
    }

    // receive the hpi dictionary and update dictionary
    // handleResponse(dict, category) {
    //     var newDict = this.state.hpi
    //     newDict[category] = dict
    //     this.setState({hpi: newDict})
    // }

    render() {
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        const diseaseComponents = this.state.diseaseArray.map(item =>
            <Grid.Column>
            <ButtonItem
                key={item.id}
                disease_id={item.id}
                name={item.name}
                diseases_list={item.diseases}
                // handler = {this.handler}
            />
            </Grid.Column>)
            const positiveDiseases = this.context["positivediseases"].map(disease =>
                <PositiveDiseases
                    key={disease} 
                    name={disease}
                    handler={this.handler}
                />
            );
        
        // let diseaseTabs = this.context['positivediseases'].map((disease, index) =>
        //     <button
        //         key={index}
        //         className="tablinks"
        //         onClick={(evt) => this.tabHandler(evt, index)}
        //     >
        //         {disease}
        //     </button>
        // ); 

        const diseaseTabs = this.context['positivediseases'].map((name, index) => 
        <Menu.Item
                key={index}
                name={name}
                active={this.state.activeItem === name}
                onClick={this.handleItemClick}
                style={{borderColor: "white", fontSize: '13px'}}
                />
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
            case positive_length+1:
                let category = this.context['positivediseases'][positive_length-1]
                let parent_code = diseasesNames[category]
                    let category_code = graphData['nodes'][parent_code]['category']
                return (
                    <DiseaseForm
                        key={step-2}
                        graphData={this.state.graphData}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        category = {category}
                        diseaseTabs = {diseaseTabs}
                        // handleResponse={this.handleResponse}
                        parent_code = {parent_code}
                        tab_category = {category_code}
                        // newDict = {this.state.hpi[category_code]}
                        last = {true}
                    />
                    )
            default:
                if (isLoaded) {
                    let category = this.context['positivediseases'][step-2]
                    let parent_code = diseasesNames[category]
                    let category_code = graphData['nodes'][parent_code]['category']
                return (
                    <DiseaseForm
                        key={step-2}
                        graphData={this.state.graphData}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        category = {category}
                        diseaseTabs = {diseaseTabs}
                        // handleResponse={this.handleResponse}
                        parent_code = {parent_code}
                        tab_category = {category_code}
                        // newDict = {this.state.hpi[category_code]}
                    />
                    )}
                else {return <h1> Loading... </h1>}
        }
    }
}

export default HPIContent;

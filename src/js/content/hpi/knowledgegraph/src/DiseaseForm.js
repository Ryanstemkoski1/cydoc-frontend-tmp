import React from 'react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import './App.css';
import DiseasesNames from './DiseasesNames';

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {

    constructor() {
        super()
        this.state = {
            diseasesNames: DiseasesNames,
            diseaseArray: [],
            responseDict: {},
        }
        this.handler = this.handler.bind(this)
    }

    handler(value, id, category, uid, question) {
        var newDict = this.state.responseDict
        if (!(uid in newDict)) {
                newDict[uid] = {
                    response: [],
                    category: category,
                    question: question
                }}
        if (id === 1) {
            newDict[uid]['response'] = newDict[uid]['response'].concat(value)
            }
        else if (id===-1) {
            newDict[uid]['response'].splice(newDict[uid]['response'].indexOf(value), 1)
        }
        this.setState({responseDict: newDict})
        this.props.handleResponse(this.state.responseDict, category)
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const {handleChange, graph, nodes, edges, category} = this.props;
        const {diseasesNames} = this.state;
        var questionMap = []
        const parent = diseasesNames[category]   // first item in graph
        const parent_values = graph[parent]
        for (var index in parent_values) {
            let num_key = parent_values[index].toString()
            let current_node = edges[num_key]['from']
            if (current_node in nodes) {
                if (index === parent_values.length - 1) {
                    questionMap.push(
                    <DiseaseFormQuestions
                        key={nodes[current_node]['uid']}
                        question = {nodes[current_node]['text']}
                        parent = {parent}
                        responseType = {nodes[current_node]['responseType']}
                        handler={this.handler}
                        category={nodes[parent]['category']}
                        uid={nodes[current_node]['uid']}
                        notLast = {false}
                    />
                )
                }
                else {questionMap.push(
                    <DiseaseFormQuestions
                        key={nodes[current_node]['uid']}
                        question = {nodes[current_node]['text']}
                        parent = {parent}
                        responseType = {nodes[current_node]['responseType']}
                        handler={this.handler}
                        category={nodes[parent]['category']}
                        uid={nodes[current_node]['uid']}
                        notLast = {true}
                    />
                )}}}
        return (
            <div>
                <div className="tabBar">
                    {this.props.diseaseTabs}
                </div>
                <h1 style={{marginLeft: 50}}> {this.props.category} </h1>
                {questionMap}
                <button onClick={this.back} style={{marginTop: 35}} className='NextButton'> &laquo; </button>
                <button onClick={this.continue} style={{float:'right', marginTop: 35}} className='NextButton'> &raquo; </button>
            </div>
        )
    }

}

export default DiseaseForm
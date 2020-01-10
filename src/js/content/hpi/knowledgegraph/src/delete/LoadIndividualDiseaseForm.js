import React from 'react';
import ChestPainData from "./ChestPainData";
import axios from 'axios'
import DiseaseFormQuestions from "../components/DiseaseFormQuestions";
import '../css/App.css';
import DiseasesNames from "./DiseasesNames";

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {

    constructor() {
        super()
        this.state = {
            diseaseArray: [],
            responseDict: {},
            isLoaded: false,
            diseasesNames: DiseasesNames
        }
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        var ending = this.props.category.toUpperCase().split(' ').join('_')
    axios.get('https://cydocgraph.herokuapp.com/graph/category/' + ending)
        .then(res =>
        this.setState({isLoaded: true,
            diseaseArray: res.data}))
    }

    handler(value, id, category, uid) {
        var newDict = this.state.responseDict
        if (!(uid in newDict)) {
                newDict[uid] = {
                    response: [],
                    category: category
                }}
        if (id === 1) {
            newDict[uid]['response'] = newDict[uid]['response'].concat(value)
            }
        else if (id===-1) {
            newDict[uid]['response'].splice(newDict[uid]['response'].indexOf(value), 1)
        }
        this.setState({responseDict: newDict})
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
    if (this.state.isLoaded) {
        const {handleChange} = this.props;
        let graph = this.state.diseaseArray['graph']
        let nodes = this.state.diseaseArray['nodes']
        let edges = this.state.diseaseArray['edges']
        var questionMap = []
        const parent = this.state.diseasesNames[this.props.category]   // first item in graph
        const parent_values = graph[parent]
        for (var index in parent_values) {
            let num_key = parent_values[index].toString()
            let current_node = edges[num_key]['from']
            if (current_node in nodes) {
                if (index == parent_values.length - 1) {
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
        else {return (<h1> loading </h1>)}
    }

}

export default DiseaseForm
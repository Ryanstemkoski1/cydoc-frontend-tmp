import React from 'react';
import { Button } from 'semantic-ui-react';
import ChestPainData from "./ChestPainData";
import DiseaseFormQuestions from "../components/DiseaseFormQuestions";
import '../css/App.css';

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {

    constructor() {
        super()
        this.state = {
            diseaseArray: ChestPainData,
            chestPain: [],
            responseDict: {}
        }
        this.handler = this.handler.bind(this)
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
        if (this.props.category === "Chest Pain") {
        const {handleChange} = this.props;
        let graph = this.state.diseaseArray['graph']
        let nodes = this.state.diseaseArray['nodes']
        let edges = this.state.diseaseArray['edges']
        var questionMap = []
        const parent = Object.keys(graph)[0]
        let last = Object.keys(graph)[Object.keys(graph).length-1]
        let notLast = true
        for (var n in Object.keys(graph)) {
            let current_node = Object.keys(graph)[n]
            if (current_node === last) {
                        notLast = false
                    }
            if (current_node === parent) {
                questionMap.push(
                    <DiseaseFormQuestions
                        key={nodes[current_node]['text']}
                        question = {nodes[current_node]['text']}
                        parent = {parent}
                        responseType = {nodes[current_node]['responseType']}
                        handler={this.handler}
                        category={nodes[parent]['category']}
                        uid={nodes[current_node]['uid']}
                        notLast = {notLast}
                    />
                )}
            else {
                // Will have to consider child questions by using a child question
                // child component file
                let edgeList = graph[current_node]
                for (let edge in edgeList) {
                    let edgeIndex = edgeList[edge]
                    questionMap.push(
                        <DiseaseFormQuestions
                            key = {nodes[current_node]['text']}
                            question = {nodes[current_node]['text']}
                            parent = {edges[edgeIndex]['from']}
                            responseType = {nodes[current_node]['responseType']}
                            handler = {this.handler}
                            category={nodes[parent]['category']}
                            uid={nodes[current_node]['uid']}
                            notLast={notLast}
                        />)
                }}}}
        return (
            <div>
                <div className="tabBar">
                    {this.props.diseaseTabs}
                </div>
                <h1 style={{marginLeft: 50}}> {this.props.category} </h1>
                {questionMap}
                <Button
                    circular
                    icon='angle double left'
                    className='next-button'
                    onClick={this.back}
                />
                <Button
                    circular
                    icon='angle double right'
                    className='next-button'
                    onClick={this.continue}
                />
            </div>
        )
    }
}

export default DiseaseForm
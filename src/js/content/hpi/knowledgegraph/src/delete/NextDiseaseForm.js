import React from 'react';
import DiseaseFormQuestions from "../components/DiseaseFormQuestions";
import '../css/App.css';
import DiseasesNames from './DiseasesNames';
import axios from "axios";

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {

    constructor() {
        super()
        this.state = {
            diseasesNames: DiseasesNames,
            diseaseArray: {},
            responseDict: {},
            isLoaded: false,
            functionLoad: false,
            questionMap: [],
            childrenDict: {},
            children_loaded: false,
            children_list: [],
            display_checklist: []
        }
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        var ending = this.props.category_code
        axios.get('https://cydocgraph.herokuapp.com/graph/category/' + ending)
            .then(res =>
                this.setState({isLoaded: true,
                    diseaseArray: res.data}))
    }

    handler(value, id, category, uid, question, child) {
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
        // this.props.handleResponse(this.state.responseDict, category, this.state.new_categories)
        console.log(this.state.questionMap) // the problem lies here fix it
        if (child !== "" && child in this.state.questionMap) {
            var newMap = this.state.questionMap
            newMap.splice(child+1, 0, this.state.childrenDict[child])
            delete this.state.childrenDict[child]
            this.setState({questionMap: newMap})
        }
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    function() {
        if (this.state.isLoaded) {
            const {handleChange, category, parent_code, category_code} = this.props;
            var children_list = []
            const {diseaseArray} = this.state;
            let graph = diseaseArray['graph']
            let nodes = diseaseArray['nodes']
            let edges = diseaseArray['edges']
            var questionMap = []
            var children_dict = {}
            const parent_values = graph[parent_code]
            for (var index in parent_values) {
                let num_key = parent_values[index].toString()
                let current_node = edges[num_key]['from']
                let children = false
                if (current_node in nodes) {
                    if (graph[current_node].length > 0) children = true
                    if (index === parent_values.length - 1) { // if last index
                        questionMap.push(
                            <DiseaseFormQuestions
                                key={nodes[current_node]['uid']}
                                question={nodes[current_node]['text']}
                                parent={parent_code}
                                responseType={nodes[current_node]['responseType']}
                                handler={this.handler}
                                category={category}
                                uid={nodes[current_node]['uid']}
                                notLast={false}
                                children={children}
                                current_node={index}
                            />
                        )
                    } else {
                        questionMap.push(
                            <DiseaseFormQuestions
                                key={nodes[current_node]['uid']}
                                question={nodes[current_node]['text']}
                                parent={parent_code}
                                responseType={nodes[current_node]['responseType']}
                                handler={this.handler}
                                category={category}
                                uid={nodes[current_node]['uid']}
                                notLast={true}
                                children={children}
                                current_node={index}
                            />
                        )
                    }
                    if (children) {
                        for (var new_index in graph[current_node]) {
                            let new_edge_index = graph[current_node][new_index].toString()
                            let new_current_node = edges[new_edge_index]['from']
                            if (new_current_node in nodes) {
                                children_dict[index] = (
                                    <DiseaseFormQuestions
                                        key={nodes[new_current_node]['uid']}
                                        question={nodes[new_current_node]['text']}
                                        parent={parent_code}
                                        responseType={nodes[new_current_node]['responseType']}
                                        handler={this.handler}
                                        category={category}
                                        uid={nodes[new_current_node]['uid']}
                                        notLast={true}/>
                                )
                            }
                        }
                    }
                } else { // if the current_node is not in the list of nodes
                    children_list.push(current_node)
                }
            }
            this.props.handleResponse(this.state.responseDict, this.props.category, children_list)
            this.setState({questionMap: questionMap, functionLoad: true, childrenDict: children_dict})
        }
    }

    render() {
        let newMap = []
        if (!this.state.functionLoad) {
            this.function()
            newMap = this.state.questionMap
        }
        else {
            for (const item in this.state.questionMap) {
                newMap.push(this.state.questionMap[item])
            }
        }
        return (
            <div>
                <div className="tabBar">
                    {this.props.diseaseTabs}
                </div>
                <h1 style={{marginLeft: 50}}> {this.props.category} </h1>
                {newMap}
                <button onClick={this.back} style={{marginTop: 35}} className='NextButton'> &laquo; </button>
                <button onClick={this.continue} style={{float:'right', marginTop: 35}} className='NextButton'> &raquo; </button>
            </div>
        )
    }

}

export default DiseaseForm
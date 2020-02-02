import React from 'react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import '../css/App.css';
import DiseasesNames from './data/DiseasesNames';
import HPIContext from "../../../../../contexts/HPIContext";

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = {
            diseasesNames: DiseasesNames,
            functionLoad: false,
            // responseDict: this.props.newDict === undefined ? {} : this.props.newDict,
            questionMap: {}
        }
        // this.handler = this.handler.bind(this)
        let values = this.context['hpi']
        values[this.props.tab_category] = {}
        this.context.onContextChange("hpi", values)
    }

    componentDidMount() {
        this.function()
    }

    // handler(value, id, category_code, uid, question, child, category_name, response_type) {
    //     // if (child) {
    //     //     let new_map = this.state.questionMap
    //     //     new_map[uid]['display_children'] = true
    //     //     this.setState({questionMap: new_map})
    //     // }
    //     let newDict = this.state.responseDict
    //     if (!(uid in newDict)) {
    //             newDict[uid] = {
    //                 response: [],
    //                 category: category_code,
    //                 category_name: category_name,
    //                 question: question,
    //                 response_type: response_type
    //             }}
    //     if (id === 1) {
    //         newDict[uid]['response'] = newDict[uid]['response'].concat(value)
    //         }
    //     else if (id===-1) {
    //         newDict[uid]['response'].splice(newDict[uid]['response'].indexOf(value), 1)
    //     }
    //     else if (id===2) {  // input-text
    //         newDict[uid]['response'] = [value]
    //     }
    //     else if (id===3) {  // date-time
    //         newDict[uid]['response'] = ['date-time', value]
    //     }
    //     this.setState({responseDict: newDict})
    //     this.props.handleResponse(this.state.responseDict, category_code)
    // }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    function() {
        const {category, parent_code, graphData, tab_category} = this.props;
        let graph = graphData['graph']
        let nodes = graphData['nodes']
        let edges = graphData['edges']
        var questionMap = {}
        const parent_values = graph[parent_code]
        // let tab_category = nodes[parent_code]['category']
        for (var index in parent_values) {
            let num_key = parent_values[index].toString()
            let current_node = edges[num_key]['from']
            let uid = nodes[current_node]['uid']
            // let current_node_category = nodes[current_node]['category']
            let children = false
                let current_node_values = graph[current_node]
                if (current_node_values.length > 0) children = true
                questionMap[uid] = {
                    'question': <DiseaseFormQuestions
                        key={uid}
                        question={nodes[current_node]['text']}
                        responseType={nodes[current_node]['responseType']}
                        // handler={this.handler}
                        category={category}
                        uid={uid}
                        notLast={true}
                        children={children}
                        current_node={current_node}
                        category_code = {tab_category}
                        // responseDict={this.state.responseDict}
                    />
                }
                let values = this.context['hpi']
                values[tab_category][uid] = {
                    'category': tab_category,
                    'category_name': category,
                    'question': nodes[current_node]['text'],
                    'response': "",
                    'response_type': "",
                    'display_children': false,
                }
                this.context.onContextChange("hpi", values)
                // check if the current node in the graph has children that we need to look for
                if (children) {
                    questionMap[uid]['display_children'] = false
                    questionMap[uid]['children'] = {}
                    for (var new_index in current_node_values) {
                        // the first edge index from the first child
                        let new_edge_index = current_node_values[new_index].toString()
                        // the child's node
                        let new_current_node = edges[new_edge_index]['from']
                        questionMap[uid]['children'][new_current_node] = {
                        'question': <DiseaseFormQuestions
                                    key={nodes[new_current_node]['uid']}
                                    question={nodes[new_current_node]['text']}
                                    responseType={nodes[new_current_node]['responseType']}
                                    // handler={this.handler}
                                    category={category}
                                    uid={nodes[new_current_node]['uid']}
                                    notLast={true}
                                    current_node={current_node}
                                    category_code = {tab_category}
                                    // responseDict={this.state.responseDict}
                        />
                        // }
                    }
                    let values = this.context['hpi']
                    values[tab_category][nodes[new_current_node]['uid']] = {
                    'category': tab_category,
                    'category_name': category,
                    'question': nodes[new_current_node]['text'],
                    'response': "",
                    'response_type': "",
                    'display_children': false
                    }
                    this.context.onContextChange("hpi", values) 
                 } } }
        this.setState({questionMap: questionMap, functionLoad: true})
        // this.props.handleResponse(this.state.responseDict, tab_category)
    }

    render() {
        const {functionLoad, questionMap} = this.state
        let newMap = []
        if (functionLoad) {
            for (const uid in questionMap) {
                let current_value = questionMap[uid]
                let question = current_value['question']
                newMap.push(question)
                if (this.context["hpi"][this.props.tab_category][uid]['display_children']) {
                    if (current_value['children']['type']) newMap.push(current_value['children'])
                        else {
                            for (const child_node in current_value['children']) {
                                newMap.push(current_value['children'][child_node]['question']) }
                         } }
                }
                // if ('display_children' in current_value) {
                //     if (current_value['display_children']) {
                //          } } 
                        }
        return (
            <div>
                <div className="tabBar">
                    {this.props.diseaseTabs}
                </div>
                <h1 style={{marginLeft: 30}}> {this.props.category} </h1>
                <div style={{marginLeft: 30}}>{newMap} </div>
                <button onClick={this.back} style={{marginTop: 35, marginBottom: 35}} className='NextButton'> &laquo; </button>
                {this.props.last ? "" :
                    <button onClick={this.continue}
                            style={{float:'right', marginTop: 35, marginBottom: 35}}
                            className='NextButton'> &raquo; </button>}
            </div>
        )
    }

}

export default DiseaseForm
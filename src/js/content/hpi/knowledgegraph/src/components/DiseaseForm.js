import React from 'react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import '../css/App.css';
import DiseasesNames from './data/DiseasesNames';

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            diseasesNames: DiseasesNames,
            functionLoad: false,
            responseDict: this.props.newDict === undefined ? {} : this.props.newDict,
            questionMap: {}
        }
        this.handler = this.handler.bind(this)
    }
    // static contextType = responseContext;

    componentDidMount() {
        this.function()
    }

    handler(value, id, category_code, uid, question, parent_node, child, category_name, response_type) {
        if (child) {
            let new_map = this.state.questionMap
            new_map[parent_node]['display_children'] = true
            this.setState({questionMap: new_map})
        }
        let newDict = this.state.responseDict
        if (!(uid in newDict)) {
                newDict[uid] = {
                    response: [],
                    category: category_code,
                    category_name: category_name,
                    question: question,
                    response_type: response_type
                }}
        if (id === 1) {
            newDict[uid]['response'] = newDict[uid]['response'].concat(value)
            }
        else if (id===-1) {
            newDict[uid]['response'].splice(newDict[uid]['response'].indexOf(value), 1)
        }
        else if (id===2) {
            newDict[uid]['response'] = [value]
        }
        else if (id===3) {
            newDict[uid]['response'] = ['date-time', value]
        }
        this.setState({responseDict: newDict})
        this.props.handleResponse(this.state.responseDict, category_code)
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
        const {handleChange, category, parent_code, graphData, tab_category} = this.props;
        let graph = graphData['graph']
        let nodes = graphData['nodes']
        let edges = graphData['edges']
        var questionMap = {}
        const parent_values = graph[parent_code]
        // let tab_category = nodes[parent_code]['category']
        for (var index in parent_values) {
            let num_key = parent_values[index].toString()
            let current_node = edges[num_key]['from']
            // let current_node_category = nodes[current_node]['category']
            let children = false
            // check if the current question being asked is a child question from another category.
            // if (current_node_category !== tab_category) {
            //     questionMap[current_node] = {
            //         'question': <DiseaseFormQuestions
            //             key={nodes[current_node]['uid']}
            //             question={nodes[current_node]['text']}
            //             responseType={nodes[current_node]['responseType']}
            //             handler={this.handler}
            //             category={category}
            //             uid={nodes[current_node]['uid']}
            //             notLast={true}
            //             children={true}
            //             current_node={current_node}
            //             category_code = {current_node_category}
            //         />,
            //         'display_children': false,
            //         'children': {}
            //     }
            //     const other_parent_values = graph[current_node]
            //     for (var new_index in other_parent_values) {
            //         let new_key = other_parent_values[new_index].toString()
            //         let new_node = edges[new_key]['from']
            //         questionMap[current_node]['children'][new_node] = {
            //             'question': <DiseaseFormQuestions
            //                 key={nodes[new_node]['uid']}
            //                 question={nodes[new_node]['text']}
            //                 responseType={nodes[new_node]['responseType']}
            //                 handler={this.handler}
            //                 category={category}
            //                 uid={nodes[new_node]['uid']}
            //                 notLast={true}
            //                 current_node={current_node}
            //                 accordion={true}
            //                 category_code = {tab_category}
            //             />
            //         } }
            //     let current_category = Object.keys(this.state.diseasesNames).find(
            //         key => this.state.diseasesNames[key] === current_node)
            //     questionMap[current_node]['children'] = <Accordian
            //         key={current_node_category}
            //         category={current_category}
            //         current_children={questionMap[current_node]['children']}
            //     />
            // }
            // else {
                let current_node_values = graph[current_node]
                if (current_node_values.length > 0) children = true
                questionMap[current_node] = {
                    'question': <DiseaseFormQuestions
                        key={nodes[current_node]['uid']}
                        question={nodes[current_node]['text']}
                        responseType={nodes[current_node]['responseType']}
                        handler={this.handler}
                        category={category}
                        uid={nodes[current_node]['uid']}
                        notLast={true}
                        children={children}
                        current_node={current_node}
                        category_code = {tab_category}
                        responseDict={this.state.responseDict}
                    />
                }
                // check if the current node in the graph has children that we need to look for
                if (children) {
                    questionMap[current_node]['display_children'] = false
                    questionMap[current_node]['children'] = {}
                    for (var new_index in current_node_values) {
                        // the first edge index from the first child
                        let new_edge_index = current_node_values[new_index].toString()
                        // the child's node
                        let new_current_node = edges[new_edge_index]['from']
                        questionMap[current_node]['children'][new_current_node] = {
                        'question': <DiseaseFormQuestions
                                    key={nodes[new_current_node]['uid']}
                                    question={nodes[new_current_node]['text']}
                                    responseType={nodes[new_current_node]['responseType']}
                                    handler={this.handler}
                                    category={category}
                                    uid={nodes[new_current_node]['uid']}
                                    notLast={true}
                                    current_node={current_node}
                                    category_code = {tab_category}
                                    responseDict={this.state.responseDict}
                        />
                        // }
                    } } } }
        this.setState({questionMap: questionMap, functionLoad: true})
        this.props.handleResponse(this.state.responseDict, tab_category)
    }

    render() {
        const {functionLoad, questionMap} = this.state
        let newMap = []
        if (functionLoad) {
            for (const node in questionMap) {
                let current_value = questionMap[node]
                let question = current_value['question']
                newMap.push(question)
                if ('display_children' in current_value) {
                    if (current_value['display_children']) {
                        if (current_value['children']['type']) newMap.push(current_value['children'])
                        else {
                            for (const child_node in current_value['children']) {
                                newMap.push(current_value['children'][child_node]['question']) }
                         } } } } }
        return (
            <div>
                <div className="tabBar">
                    {this.props.diseaseTabs}
                </div>
                <h1 style={{marginLeft: 50}}> {this.props.category} </h1>
                {newMap}
                <button onClick={this.back} style={{marginTop: 35, marginBottom: 35}} className='NextButton'> &laquo; </button>
                <button onClick={this.continue} style={{float:'right', marginTop: 35, marginBottom: 35}} className='NextButton'> &raquo; </button>
            </div>
        )
    }

}

export default DiseaseForm
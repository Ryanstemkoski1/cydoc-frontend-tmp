import React from 'react';
import { Menu, Button, Dropdown } from 'semantic-ui-react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import '../css/App.css';
import HPIContext from 'contexts/HPIContext.js';
import Accordian from "./accordian"
import { DISEASE_TABS_MED_BP, DISEASE_TABS_SMALL_BP } from 'constants/breakpoints';
import '../../HPI.css';
import diseaseCodes from '../../../../../../../constants/diseaseCodes'

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = {
            functionLoad: false, // true when knowledge graph is processed
            question_map: {}, // stores question components for each node 
            response_types: { "CLICK-BOXES": [], "MEDS-POP": [], "TIME": ["", ""], "LIST-TEXT":  {1: "", 2: "", 3: ""}} // can we improve upon this 
        }
        let values = this.context['hpi']
        // if there a way for me to add this directly to HPIContext?
        if (!('nodes' in values)) { 
            values['nodes'] = {} 
            values['questionOrder_to_node'] = {}
            values['parent_to_child_questionOrder'] = {}
            this.context.onContextChange("hpi", values)
        } 
    }

    componentDidMount() {
        this.process_knowledge_graph()
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    first_page = e => {
        e.preventDefault()
        this.props.first_page()
    }

    last_page = e => {
        e.preventDefault()
        this.props.last_page()
    }

    // organizes child nodes in order based on their questionOrder attribute
    questionOrder(list_edges, nodes, edges, cat_code) {
        var child_ranks = []
        for (var edge_idx in list_edges) {
            var edge = list_edges[edge_idx]
            var node = edges[edge.toString()]['from']
            var question_order = parseInt(nodes[node]['questionOrder'])
            if (!(question_order)) question_order = child_ranks.length + 2 //remove when Pacemaker has a questionOrder property
            var curr_cat = node.substring(0, 3)
            // weigh the child category if it is different from the parent's category
            if (curr_cat !== cat_code) {
                var weight = curr_cat.charCodeAt(0) + curr_cat.charCodeAt(1) + curr_cat.charCodeAt(2) // weigh based on unicode sum of prefix
                question_order += weight 
            }
            child_ranks.push([question_order, node]) 
        }
        child_ranks.sort() 
        var rank_child = child_ranks.map(( rank ) => rank[0]) // sort based on questionOrder
        var child_nodes = child_ranks.map(( rank ) => rank[1]) // child nodes are in order based on the order of the questionOrder
        return [rank_child, child_nodes] 
     }

    // processes knowledge graph to determine order of questions in HPI based on questionOrder attribute of nodes
    process_knowledge_graph() { // TODO: does this also need a set to keep track of nodes like for traversal()
        const {graphData, parent_node} = this.props
        var values = this.context['hpi']
        var graph = graphData['graph']
        var nodes = graphData['nodes']
        var edges = graphData['edges']
        var cat_code = parent_node.substring(0, 3)
        if (cat_code in values['questionOrder_to_node']) return // if the questionOrder_to_node was already made, then don't need to process knowledge graph again
        var questionOrder_to_node = {} 
        var parent_to_child_questionOrder = {}
        var question_map = {}
        var queue = [parent_node]
        while (queue.length) { 
            var curr_node = queue.shift() 
            var rank = parseInt(nodes[curr_node]['questionOrder'])
            if (!(rank)) rank = Object.keys(questionOrder_to_node).length + 1 // remove when Pacemaker has questionOrder attribute 
            var curr_category = curr_node.substring(0, 3)
            var uid = nodes[curr_node]['uid']
            if (curr_category !== cat_code) {
                var weight = curr_category.charCodeAt(0) + curr_category.charCodeAt(1) + curr_category.charCodeAt(2)
                rank += weight 
            }
            parent_to_child_questionOrder[rank] = curr_node 
            var edges_list = graph[curr_node] 
            var child_array = this.questionOrder(edges_list, nodes, edges, cat_code) 
            var child_order = child_array[0]
            var child_nodes = child_array[1]
            questionOrder_to_node[rank] = child_order 
            queue = queue.concat(child_nodes)
            if (!(curr_node in values['nodes'])){
                values['nodes'][curr_node] = nodes[curr_node] 
                var response_type = nodes[curr_node]['responseType']
                // use saved response so when going back to a page, the answers aren't wiped out 
                values['nodes'][curr_node]['response'] = response_type in this.state.response_types ? this.state.response_types[response_type] : ""
            }
            question_map[curr_node] = <DiseaseFormQuestions key={uid} node={curr_node} category={cat_code}/>
        }
        values['questionOrder_to_node'][cat_code] = questionOrder_to_node 
        values['parent_to_child_questionOrder'][cat_code] = parent_to_child_questionOrder 
        this.context.onContextChange('hpi', values)
        this.setState({question_map: question_map, functionLoad: true})
    }

    // checks if all of the children are of a different category than the parent node. If so, they are displayed in an accordion
    check_accordion(child_edges) {
        const {parent_node} = this.props
        var cat_code = parent_node.substring(0,3)
        var parent_to_child_questionOrder = this.context['hpi']['parent_to_child_questionOrder'][cat_code]
        const {question_map} = this.state
        var child_questions = []
        for (var i in child_edges) {
            var edge = child_edges[i] 
            var child_node = parent_to_child_questionOrder[edge]
            var child_cat = child_node.substring(0, 3)
            if (child_cat === cat_code) return false 
            child_questions.push(question_map[child_node])
        }  
        return <Accordian child_questions={child_questions}/>
    }

    // iterates through question components in order of their questionOrder to be displayed on the HPI interview page
    traversal() { 
        // TODO: Include Accordian for cases with different category children questions 
        const {question_map} = this.state
        var values = this.context['hpi']
        var cat_code = this.props.parent_node.substring(0, 3)
        var questionOrder_to_node = values['questionOrder_to_node'][cat_code]
        var parent_to_child_questionOrder = values['parent_to_child_questionOrder'][cat_code]
        var question_arr = [] 
        var traversed = new Set() 
        var stack = [1]   
        while (stack.length) {  
            var curr_edge = stack.pop() 
            if (traversed.has(curr_edge)) continue // sublinear performance, but is there a way to be even more efficient with checking for traversal?
            traversed.add(curr_edge)
            var curr_node = parent_to_child_questionOrder[curr_edge] 
            var child_edges = (values['nodes'][curr_node]['response'] === "Yes" || curr_edge === 1) ? questionOrder_to_node[curr_edge]: []
            child_edges.sort()
            child_edges.reverse()
            var child_map = child_edges.length ? this.check_accordion(child_edges): false
            question_arr.push(question_map[curr_node])
            if (child_map) question_arr.push(child_map) 
            else stack = stack.concat(child_edges)
        }
        question_arr.shift() 
        return question_arr
    }

    render() {
        const {diseaseTabs, windowWidth, parent_node} = this.props;
        const collapseTabs = diseaseTabs.length >= 10
            || (diseaseTabs.length >= 5 && windowWidth < DISEASE_TABS_MED_BP)
            || windowWidth < DISEASE_TABS_SMALL_BP;

        var question_arr = []
        if (this.state.functionLoad) { 
            question_arr = this.traversal()
        }

        var category = Object.keys(diseaseCodes).find(key => diseaseCodes[key] === parent_node.substring(0,3)) 

        return (
            <div>
                {collapseTabs ?
                    <Dropdown
                        text={category}
                        options={diseaseTabs}
                        selection
                        fluid
                        scrolling={false}
                    />
                    : <Menu tabular borderless items={diseaseTabs} className='disease-menu'/>
                }

                <div className='arrow-buttons'>
                    <div className='next-button'> 
                        <Button 
                            circular
                            icon = 'angle double left'
                            onClick = {this.first_page}
                        />
                        <Button
                            circular
                            icon='angle left'
                            onClick={this.back}
                        /> 
                    </div>
                    {this.props.last ? "" :
                        <div className = 'next-button'> 
                            <Button
                                circular
                                icon='angle right'
                                onClick={this.continue}
                            /> 
                            <Button 
                                circular
                                icon = 'angle double right'
                                onClick = {this.last_page}
                        />
                        </div>
                    }
                </div>
                    <h1 className='category-header'>{category}</h1>
                    <div className='question-map'>{question_arr} </div>

            </div>
        )
    }
}

export default DiseaseForm
import React, { Fragment } from 'react';
import {Menu, Container} from 'semantic-ui-react'
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
            questionMap: {}
        }
        let values = this.context['hpi']
        if (!(this.props.tab_category in values)) {
            values[this.props.tab_category] = {}
            this.context.onContextChange("hpi", values)
        }
    }

    componentDidMount() {
        this.function()
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
        const {category, parent_code, graphData, tab_category} = this.props;
        let graph = graphData['graph']
        let nodes = graphData['nodes']
        let edges = graphData['edges']
        var questionMap = {}
        const parent_values = graph[parent_code]
        for (var index in parent_values) {
            let num_key = parent_values[index].toString()
            let current_node = edges[num_key]['from']
            let uid = nodes[current_node]['uid']
            let children = false
                let current_node_values = graph[current_node]
                if (current_node_values.length > 0) children = true
                questionMap[uid] = {
                    'question': <DiseaseFormQuestions
                        key={uid}
                        question={nodes[current_node]['text']}
                        responseType={nodes[current_node]['responseType']}
                        category={category}
                        uid={uid}
                        notLast={true}
                        children={children}
                        current_node={current_node}
                        category_code = {tab_category}
                    />
                }
                let values = this.context['hpi']
                if (!(uid in values[tab_category])){
                    values[tab_category][uid] = {
                        'category': tab_category,
                        'category_name': category,
                        'question': nodes[current_node]['text'],
                        'response': "",
                        'response_type': "",
                        'display_children': false,
                    }
                    this.context.onContextChange("hpi", values)
                }
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
                                    key={nodes[new_current_node][uid]}
                                    question={nodes[new_current_node]['text']}
                                    responseType={nodes[new_current_node]['responseType']}
                                    category={category}
                                    uid={nodes[new_current_node][uid]}
                                    notLast={true}
                                    current_node={current_node}
                                    category_code = {tab_category}
                        />
                    }
                    let values = this.context['hpi']
                    if (!([nodes[new_current_node][uid]] in values[tab_category])) {
                        values[tab_category][nodes[new_current_node][uid]] = {
                            'category': tab_category,
                            'category_name': category,
                            'question': nodes[new_current_node]['text'],
                            'response': "",
                            'response_type': "",
                            'display_children': false
                            }
                            this.context.onContextChange("hpi", values) 
                    } } } }
        this.setState({questionMap: questionMap, functionLoad: true})
    }

    myFunction() {
        var x = document.getElementById("hpinav");
        if (x.className === "topnav") {
            x.className = "ui vertical text menu"
            x.style.cssText = "margin-left: 60px;"
        } else {
          x.className = "topnav";
          x.style.cssText = "margin-left: 0px;"
        }
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
                        }
        return (
            <div>
                <Menu tabular>
                    <div className="topnav" id='hpinav'> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                        <Container style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: "100%", height: "100%", overflowX: 'auto'}}>
                            {this.props.diseaseTabs}
                        </Container>
                        <a href="javascript:void(0);" className="icon" onClick={this.myFunction}>
                            <i className="fa fa-bars"></i>
                        </a>
                    </div>
                </Menu>
                
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
import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import '../css/App.css';
import HPIContext from 'contexts/HPIContext.js';
import ChildAccordian from "./accordian";
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
            questionMap: {}, // stores question components for each node
            responseTypes: { "CLICK-BOXES": [], "MEDS-POP": [], "TIME": ["", ""], "LIST-TEXT":  {1: "", 2: "", 3: ""}} // can we improve upon this
        }
        let values = this.context['hpi']
        // if there a way for me to add this directly to HPIContext?
        if (!('nodes' in values)) {
            values['nodes'] = {}
            values['questionOrderToNode'] = {}
            values['parentToChildQuestionOrder'] = {}
            this.context.onContextChange("hpi", values)
        }
    }

    componentDidMount() {
        this.processKnowledgeGraph()
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    firstPage = e => {
        e.preventDefault()
        this.props.firstPage()
    }

    lastPage = e => {
        e.preventDefault()
        this.props.lastPage()
    }

    // organizes child nodes in order based on their questionOrder attribute
    questionOrder(listEdges, nodes, edges, catCode) {
        var childRanks = []
        for (var edgeIdx in listEdges) {
            var edge = listEdges[edgeIdx]
            var node = edges[edge.toString()]['from']
            var quesOrder = parseInt(nodes[node]['questionOrder'])
            if (!(quesOrder)) quesOrder = childRanks.length + 2 //remove when Pacemaker has a questionOrder property
            var currCat = node.substring(0, 3)
            // weigh the child category if it is different from the parent's category
            if (currCat !== catCode) {
                var weight = currCat.charCodeAt(0) + currCat.charCodeAt(1) + currCat.charCodeAt(2) // weigh based on unicode sum of prefix
                quesOrder += weight
            }
            childRanks.push([quesOrder, node])
        }
        childRanks = childRanks.sort((a,b) => a - b)
        var rankChild = childRanks.map(( rank ) => rank[0]) // sort based on questionOrder
        var childNodes = childRanks.map(( rank ) => rank[1]) // child nodes are in order based on the order of the questionOrder
        return [rankChild, childNodes]
     }

    // processes knowledge graph to determine order of questions in HPI based on questionOrder attribute of nodes
    processKnowledgeGraph() { // TODO: does this also need a set to keep track of nodes like for traversal()
        const {graphData, parentNode} = this.props
        var values = this.context['hpi']
        var graph = graphData['graph']
        var nodes = graphData['nodes']
        var edges = graphData['edges']
        var catCode = parentNode.substring(0, 3)
        var questionOrderToNode = {}
        var parentToChildQuestionOrder = {}
        var questionMap = {}
        var queue = [parentNode]
        while (queue.length) {
            var currNode = queue.shift()
            var rank = parseInt(nodes[currNode]['questionOrder'])
            if (!(rank)) rank = Object.keys(questionOrderToNode).length + 1 // remove when Pacemaker has questionOrder attribute
            var currCategory = currNode.substring(0, 3)
            var uid = nodes[currNode]['uid']
            if (currCategory !== catCode) {
                var weight = currCategory.charCodeAt(0) + currCategory.charCodeAt(1) + currCategory.charCodeAt(2)
                rank += weight
            }
            parentToChildQuestionOrder[rank] = currNode
            var edgesList = graph[currNode]
            var childArray = this.questionOrder(edgesList, nodes, edges, catCode)
            var childOrder = childArray[0]
            var childNodes = childArray[1]
            questionOrderToNode[rank] = childOrder
            queue = queue.concat(childNodes)
            if (!(currNode in values['nodes'])){
                values['nodes'][currNode] = nodes[currNode]
                var responseType = nodes[currNode]['responseType']
                // use saved response so when going back to a page, the answers aren't wiped out
                values['nodes'][currNode]['response'] = responseType in this.state.responseTypes ? this.state.responseTypes[responseType] : ""
            }
            questionMap[currNode] = <DiseaseFormQuestions key={uid} node={currNode} category={catCode}/>
        }
        values['questionOrderToNode'][catCode] = questionOrderToNode
        values['parentToChildQuestionOrder'][catCode] = parentToChildQuestionOrder
        /*values['nodes']['PEM0010'] = {
          bodySystem: "CVRESP",
          category: "PULMONARY_EMBOLISM",
          creationTime: "2020-03-30 18:28:08.135102+00:00",
          medID: "PEM0010",
          noteSection: "HPI",
          questionOrder: "10.0",
          response: "",
          responseType: "SCALE1TO10",
          text: "New Question",
          uid: "82903nrflkajsd903290"
        }
        values['questionOrderToNode']['PEM'][1].unshift(10);
        values['parentToChildQuestionOrder']['PEM'][10] = "PEM0010";
        questionMap['PEM0010'] = <DiseaseFormQuestions key='82903nrflkajsd903290' node='PEM0010' category='PEM'/>*/

        this.context.onContextChange('hpi', values)
        this.setState({questionMap: questionMap, functionLoad: true})
    }

    // checks if all of the children are of a different category than the parent node. If so, they are displayed in an accordion
    checkAccordion(childEdges) {
        const {parentNode} = this.props
        var catCode = parentNode.substring(0,3)
        var parentToChildQuestionOrder = this.context['hpi']['parentToChildQuestionOrder'][catCode]
        const {questionMap} = this.state
        var childQuestions = []
        for (var i in childEdges) {
            var edge = childEdges[i]
            var childNode = parentToChildQuestionOrder[edge]
            var childCat = childNode.substring(0, 3)
            if (childCat === catCode) return false
            childQuestions.push(questionMap[childNode])
        }
        return <ChildAccordian childQuestions={childQuestions}/>
    }

    // iterates through question components in order of their questionOrder to be displayed on the HPI interview page
    traversal() {
        // TODO: Include Accordian for cases with different category children questions
        const {questionMap} = this.state
        var values = this.context['hpi']
        var catCode = this.props.parentNode.substring(0, 3)
        var questionOrderToNode = values['questionOrderToNode'][catCode]
        var parentToChildQuestionOrder = values['parentToChildQuestionOrder'][catCode]
        var questionArr = []
        var traversed = new Set()
        var stack = [1]
        while (stack.length) {
            var currEdge = stack.pop()
            if (traversed.has(currEdge)) continue // sublinear performance, but is there a way to be even more efficient with checking for traversal?
            traversed.add(currEdge)
            var currNode = parentToChildQuestionOrder[currEdge]
            var childEdges = (values['nodes'][currNode]['response'] === "Yes" || currEdge === 1) ? questionOrderToNode[currEdge]: []
            childEdges = childEdges.sort((a,b) => b - a) // numerical sort by comparison - .sort() in JavaScript is alphabetical
            var childMap = childEdges.length ? this.checkAccordion(childEdges): false
            questionArr.push(questionMap[currNode])
            if (childMap) questionArr.push(childMap)
            else stack = stack.concat(childEdges)
        }
        questionArr.shift()
        return questionArr
    }

    render() {
        const {diseaseTabs, windowWidth, parentNode} = this.props;
        const collapseTabs = diseaseTabs.length >= 10
            || (diseaseTabs.length >= 5 && windowWidth < DISEASE_TABS_MED_BP)
            || windowWidth < DISEASE_TABS_SMALL_BP;

        var questionArr = []
        if (this.state.functionLoad) {
            questionArr = this.traversal()
        }

        var category = Object.keys(diseaseCodes).find(key => diseaseCodes[key] === parentNode.substring(0,3))

        return (
            <div>
                {collapseTabs ?
                    <Dropdown
                        text={category}
                        options={diseaseTabs}
                        selection
                        fluid
                        scrolling={false}
                        id='disease-menu'
                    />
                  : <Menu pointing items={diseaseTabs} /> //id='disease-menu' //className='disease-menu'
                }
                    <div className="ui segment">
                    <h1 className='category-header'>{category}</h1>
                    <div className='question-map'>{questionArr} </div>
                    </div>

            </div>
        )
    }
}



export default DiseaseForm

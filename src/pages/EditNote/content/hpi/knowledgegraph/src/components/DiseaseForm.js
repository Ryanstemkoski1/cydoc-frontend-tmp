import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import DiseaseFormQuestions from "./DiseaseFormQuestions";
import '../css/App.css';
import HPIContext from 'contexts/HPIContext.js';
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
        var edgeToQuestionOrder = {} 
        for (var edgeIdx in listEdges) {
            var edge = listEdges[edgeIdx]
            var node = edges[edge.toString()]['from']
            var quesOrder = parseInt(nodes[node]['questionOrder'])
            if (!(quesOrder)) quesOrder = node.substring(node.length-1, node.length) //remove when Pacemaker has a questionOrder property
            var currCat = node.substring(0, 3)
            // weigh the child category if it is different from the parent's category
            if (currCat !== catCode) {
                var newQuesOrder = parseInt(currCat.charCodeAt(0).toString() + currCat.charCodeAt(1).toString() + currCat.charCodeAt(2).toString() + quesOrder.toString()) // weigh based on unicode sum of prefix
                edgeToQuestionOrder[edge] = newQuesOrder
                quesOrder = edge 
            }
            childRanks.push([quesOrder, node]) 
        }
        childRanks = childRanks.sort((a,b) => a[0] - b[0])
        var rankChild = childRanks.map(( rank ) => rank[0] in edgeToQuestionOrder ? edgeToQuestionOrder[rank[0]] : rank[0] ) // sort based on questionOrder
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
            // if (currNode in values['nodes'] && values['nodes'][currNode]['currCategory'] !== catCode) continue // prevent repeated questions in future parts of HPI form
            var rank = parseInt(nodes[currNode]['questionOrder'])
            if (!(rank)) rank = currNode.substring(currNode.length-1, currNode.length) // remove when Pacemaker has questionOrder attribute 
            var currCategory = currNode.substring(0, 3)
            var uid = nodes[currNode]['uid']
            if (currCategory !== catCode) { // if the child category differs from the parent category, use the UTF-16 numbers to create a new unique number
                rank = parseInt(currCategory.charCodeAt(0).toString() + currCategory.charCodeAt(1).toString() + currCategory.charCodeAt(2).toString() + rank.toString())
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
                values['nodes'][currNode]['currCategory'] = catCode
            }
            questionMap[currNode] = <DiseaseFormQuestions key={uid} node={currNode} category={catCode}/>
        }
        values['questionOrderToNode'][catCode] = questionOrderToNode 
        values['parentToChildQuestionOrder'][catCode] = parentToChildQuestionOrder
        this.context.onContextChange('hpi', values)
        this.setState({questionMap: questionMap, functionLoad: true})
    }

    // iterates through question components in order of their questionOrder to be displayed on the HPI interview page
    traversal() {
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
            if (traversed.has(currEdge) || !(Object.keys(parentToChildQuestionOrder).length)) continue // sublinear performance, but is there a way to be even more efficient with checking for traversal?
            traversed.add(currEdge)
            var currNode = parentToChildQuestionOrder[currEdge]
            if (!(currNode)) continue
            // if statement to remove any selected categories that were already questioned as child questions
            // if (currNode.substring(0,3) !== catCode && currNode.substring(currNode.length-1) === '1' && (this.context['positivediseases']).includes(currNode.substring(0,3))) { 
            //     this.context['positivediseases'].splice(this.context['positivediseases'].indexOf(currNode.substring(0,3)), 1) 
            // }
            var childEdges = (('response' in values['nodes'][currNode] && values['nodes'][currNode]['response'] === "Yes") || values['nodes'][currNode]['text'] === 'nan' || currEdge === 1) ? questionOrderToNode[currEdge] : []
            if (values['nodes'][currNode]['text'] !== 'nan') questionArr.push(questionMap[currNode])
            if (childEdges[childEdges.length-1] > childEdges[0]) childEdges.reverse()
            stack = stack.concat(childEdges)
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
                    />
                    : <Menu tabular borderless items={diseaseTabs} className='disease-menu'/>
                }
                    <div className='question-map'>{questionArr} </div>

            </div>
        )
    }
}

export default DiseaseForm
/**
 * Returns the answerInfo object associated with the given type 
 * @param {String} type: the question's response type
 */
export const getAnswerInfo = (type) => {
    if (type === 'YES-NO' || type === 'NO-YES') {
        return {
            yesResponse: '',
            noResponse: '',
        }
    } else if (type === 'SHORT-TEXT'
    || type === 'NUMBER'
    || type === 'TIME'
    || type === 'LIST-TEXT') {
        return {
            startResponse: '',
            endResponse: '',
        }
    } else if (type === 'CLICK-BOXES') {
        return {
            options: ['', '', ''],
            startResponse: '',
            endResponse: '',
        }
    } else if (type.startsWith('FH')
    || type.startsWith('PMH')
    || type.startsWith('PSH')
    || type.startsWith('MEDS')) {
        return {
            options: [],
        }
    }
}

/**
 * Returns a randomly generated node qid based on the disease code
 * @param {String} diseaseCode: 3-character abbreviation of the disease
 * @param {*} numQuestions: number of questions in the context
 */
export const createNodeId = (diseaseCode, numQuestions) => {
    const randomId = Math.floor(Math.random() * 9000000000) + 1000000000;
    const numZeros = 4 - numQuestions.toString().length;
    return diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();
}


/**
 * Sorts the list of edges in place, given a mapping of nodes
 * @param {Array[Object]} edgeList 
 * @param {Array[Object]} edges 
 * @param {Object} nodes 
 */
export const sortEdges = (edgeList, edges, nodes) => {
    edgeList.sort((a, b) => {
        const nodeA = parseFloat(nodes[edges[a].from].questionOrder);
        const nodeB = parseFloat(nodes[edges[b].from].questionOrder);
        
        if (nodeA < nodeB) {
            return -1;
        } else if (nodeA > nodeB) {
            return 1;
        } else {
            return 0;
        }
    });
}

/**
 * Given the node's responseType, text, and answerInfo, parse the text for the options, 
 * if appropriate, and mutate the node's answerInfo directly.
 * Returns the parsed text.
 * 
 * @param {String} responseType 
 * @param {String} text 
 * @param {Object} answerInfo 
 * @param {String} category 
 */
export const parseQuestionText = (responseType, text, answerInfo, category) => {
    if (text === 'nan') {
        text = `Root for ${category.replace("_", " ").toLowerCase()} (This question has no text, only follow-up questions)`;
    }
    
    if (
        responseType === 'CLICK-BOXES' 
        || responseType.endsWith('POP')
        || responseType === 'nan'
    ) {
        let click = text.search('CLICK');
        let selectStart = text.search('\\[');
        let selectEnd = text.search('\\]');
        let choices;
        if (click > -1) { // options are indicated by CLICK[...]
            choices = text.slice(click + 6, selectEnd);
            text = text.slice(0, click);
        } else { // options are indicated by [...]
            if (selectStart > 0) {
                choices = text.slice(selectStart + 1, selectEnd);
                text = text.slice(0, selectStart);
            }
        }
        choices = choices.split(",").map(response => response.trim());
        answerInfo.options = choices;
    }
    return text;
}

/**
 * Replace all occurences of SYMPTOM or DISEASE with the given category
 * 
 * @param {String} text 
 * @param {String} category 
 */
export const parsePlaceholder = (text, category) => {
    let placeholder = text.search(/SYMPTOM|DISEASE/);
    if (placeholder > -1) {
        text = text.substring(0, placeholder) 
            + category.replace("_", " ").toLowerCase() 
            + text.substring(placeholder +7);
    }
    return text;
}

/**
 * Adds all direct children question of the given parent directly
 * to the graph object itself.
 * 
 * Returns the updated numQuestions and numEdges count.
 */
export const addChildrenNodes = (
    parentId,
    children, 
    category,
    diseaseCode, 
    graphData,
    contextData,
) => {
    let { 
        numQuestions,
        numEdges,
        contextEdges,
        contextGraph,
        contextNodes
    } = contextData;
    const { graph, edges, nodes } = graphData;

    // Create edges and nodes for every new question
    for (let edge of children) {
        const childId = createNodeId(diseaseCode, numQuestions);
        
        const nodeId = edges[edge].from;
        let responseType = nodes[nodeId].responseType;
        let text = nodes[nodeId].text;
        let answerInfo = getAnswerInfo(responseType);
        
        // Preprocess the text to prepopulate the answerinfo if necessary
        // or replace instances of SYMPTOM and DISEASE
        text = parsePlaceholder(text, category);
        text = parseQuestionText(responseType, text, answerInfo, nodes[nodeId].category);
        contextNodes[childId] = {
            text,
            answerInfo,
            responseType,
            id: childId,
            order: numQuestions,
            hasChildren: graph[nodeId].length > 0,
            originalId: nodeId,
            hasChanged: false,
            parent: parentId,
        }

        contextEdges[numEdges] = {
            from: parentId,
            to: childId,
        }

        contextGraph[childId] = [];
        contextGraph[parentId].push(numEdges)
        numEdges++;
        numQuestions++;
    }
    return { numEdges, numQuestions };
}

/**
 * Walk up the knowledge graph and update all imported nodes
 * to hasChanged=true to indicate not to use the original ID anymore
 * 
 * @param {Object} nodes 
 * @param {String} qid 
 */
export const updateParent = (nodes, qid) => {
    if (qid && !nodes[qid].hasChanged) {
        nodes[qid].hasChanged = true;
        updateParent(nodes, nodes[qid].parent);
    }
}
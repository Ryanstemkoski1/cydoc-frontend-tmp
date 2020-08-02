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
 * Given the node's responseType, text, and answerInfo, 
 * parse the text for the options, if appropriate, and mutate the
 * node's answerInfo directly. 
 * 
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
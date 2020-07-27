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
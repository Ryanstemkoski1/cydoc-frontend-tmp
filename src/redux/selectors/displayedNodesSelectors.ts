import { displayedNodesCutOff } from 'constants/displayedNodesCutOff';
import { YesNoResponse } from 'constants/enums';
import { ResponseTypes } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';

function traverseNodes(
    currNodes: string[],
    state: CurrentNoteState,
    cutOff: number
) {
    const { graph, nodes } = state.hpi;
    let nodesArr: string[] = [],
        stack = currNodes,
        totalNodes = stack;
    while (stack.length) {
        const currNode = stack.pop();
        if (!currNode) continue;
        if (nodes[currNode].text != 'nan') nodesArr = [...nodesArr, currNode];
        const childEdges =
            (totalNodes.length - currNodes.length < cutOff &&
                nodes[currNode].responseType == ResponseTypes.YES_NO &&
                nodes[currNode].response == YesNoResponse.Yes) ||
            (nodes[currNode].responseType == ResponseTypes.NO_YES &&
                nodes[currNode].response == YesNoResponse.No)
                ? graph[currNode]
                      .slice(0, cutOff - (totalNodes.length - currNodes.length))
                      .reverse()
                : [];
        stack = [...stack, ...childEdges];
        totalNodes = [...totalNodes, ...childEdges];
    }
    return nodesArr;
}

export function nodesToDisplayInOrder(
    currCat: string,
    state: CurrentNoteState
): string[] {
    const { chiefComplaints, hpi } = state,
        [firstOrderNodesMap, totalNodes] = firstOrderNodes(state) as [
            {
                [chiefComplaint: string]: string[];
            },
            string[]
        ];
    if (totalNodes.length < displayedNodesCutOff) {
        let nodesArr = totalNodes, // for the count
            nodesSoFar: string[] = [];
        while (nodesArr.length < displayedNodesCutOff) {
            for (let i = 0; i < Object.keys(chiefComplaints).length; i++) {
                const chiefComplaint = Object.keys(chiefComplaints)[i],
                    currNodesArr = traverseNodes(
                        firstOrderNodesMap[chiefComplaint],
                        state,
                        displayedNodesCutOff - nodesArr.length
                    ).filter((node) => !nodesSoFar.includes(node));
                if (chiefComplaint == currCat) return currNodesArr;
                nodesArr = [
                    ...new Set([
                        ...nodesArr,
                        ...currNodesArr.filter(
                            (node) => hpi.nodes[node].text != 'nan'
                        ),
                    ]),
                ];
                nodesSoFar = [...new Set([...nodesSoFar, ...currNodesArr])];
            }
        }
    }
    return firstOrderNodesMap[currCat]; // at the very least display all first order nodes
}

export function firstOrderNodes(state: CurrentNoteState) {
    const { chiefComplaints, hpiHeaders, hpi } = state,
        firstOrderNodesMap: { [chiefComplaint: string]: string[] } = {},
        { graph, order, nodes } = hpi;
    let totalNodes: string[] = [];
    Object.keys(chiefComplaints).map((chiefComplaint) => {
        const category = Object.keys(hpiHeaders.parentNodes[chiefComplaint])[0],
            parentNode = hpiHeaders.parentNodes[chiefComplaint][category],
            newNodes = graph[order[parentNode]['1']]
                .reduce((prevVal, node) => {
                    let newNodes = prevVal;
                    if (
                        ['GENERAL', 'PAIN'].includes(nodes[node].category) ||
                        nodes[node].text == 'nan'
                    )
                        newNodes = [...newNodes, ...graph[node]];
                    return newNodes;
                }, graph[order[parentNode]['1']] as string[])
                .filter((node) => !totalNodes.includes(node));
        firstOrderNodesMap[chiefComplaint] = newNodes.slice().reverse();
        totalNodes = [...totalNodes, ...newNodes].filter(
            (node) => nodes[node].text != 'nan'
        );
    });
    return [firstOrderNodesMap, totalNodes];
}

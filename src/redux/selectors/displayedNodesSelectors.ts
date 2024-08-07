import { displayedNodesCutOff } from '@constants/displayedNodesCutOff';
import { YesNoResponse } from '@constants/enums';
import {
    ResponseTypes,
    SelectManyInput,
    SelectOneInput,
} from '@constants/hpiEnums';
import { CurrentNoteState } from '@redux/reducers';
import { isHPIResponseValid } from '@utils/getHPIFormData';
import { getNodeConditions } from '@utils/getHPIText';

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
        if (nodes[currNode]?.text != 'nan') nodesArr = [...nodesArr, currNode];

        let childNodes = graph[currNode]
            ?.slice(0, cutOff - (totalNodes.length - currNodes.length))
            .reverse();

        const isValidResponseResult = isHPIResponseValid(
            nodes[currNode]?.response,
            nodes[currNode]?.responseType
        );

        if (
            [
                ResponseTypes.SELECTMANY,
                ResponseTypes.SELECTONE,
                ResponseTypes.SELECTMANYDENSE,
            ].includes(nodes[currNode]?.responseType) &&
            isValidResponseResult
        ) {
            const childNodesToDisplay: string[] = [];
            const response = nodes[currNode]?.response as
                | SelectManyInput
                | SelectOneInput;
            const validNodeResponse = Object.keys(response).filter(
                (key) => response[key]
            );

            for (const childNode of childNodes) {
                const conditions = getNodeConditions(nodes[childNode]);
                if (
                    conditions.some((item) => validNodeResponse.includes(item))
                ) {
                    childNodesToDisplay.push(childNode);
                }
            }

            childNodes = childNodesToDisplay;
        }

        const childEdges =
            (totalNodes.length - currNodes.length < cutOff &&
                nodes[currNode]?.responseType == ResponseTypes.YES_NO &&
                nodes[currNode]?.response == YesNoResponse.Yes) ||
            (nodes[currNode]?.responseType == ResponseTypes.NO_YES &&
                nodes[currNode]?.response == YesNoResponse.No) ||
            (nodes[currNode]?.responseType == ResponseTypes.SELECTMANY &&
                isValidResponseResult) ||
            (nodes[currNode]?.responseType == ResponseTypes.SELECTONE &&
                isValidResponseResult)
                ? childNodes
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
    const { chiefComplaints, hpi, productDefinition } = state,
        [firstOrderNodesMap, totalNodes] = firstOrderNodes(state) as [
            {
                [chiefComplaint: string]: string[];
            },
            string[],
        ];
    let loopCount = 0;

    // Ensure maxLimit defaults to displayedNodesCutOff to avoid being null.
    const maxLimit =
        productDefinition.definitions?.displayedNodesCutOff ??
        displayedNodesCutOff;

    if (totalNodes.length < maxLimit) {
        let nodesArr = totalNodes, // for the count
            nodesSoFar: string[] = [];
        while (nodesArr.length < maxLimit && loopCount < maxLimit) {
            loopCount++;
            for (let i = 0; i < Object.keys(chiefComplaints).length; i++) {
                const chiefComplaint = Object.keys(chiefComplaints)[i],
                    currNodesArr = traverseNodes(
                        firstOrderNodesMap[chiefComplaint],
                        state,
                        maxLimit - nodesArr.length
                    ).filter((node) => !nodesSoFar.includes(node));
                /** Sort currNodesArr based on displayOrder if available.*/
                currNodesArr.sort((a, b) => {
                    const nodeA = hpi.nodes[a] as { displayOrder?: number };
                    const nodeB = hpi.nodes[b] as { displayOrder?: number };
                    if (
                        nodeA?.displayOrder !== undefined &&
                        nodeB?.displayOrder !== undefined
                    ) {
                        return nodeA.displayOrder - nodeB.displayOrder;
                    }
                    return 0; // If displayOrder is not defined, maintain order
                });
                if (chiefComplaint == currCat) return currNodesArr;
                nodesArr = [
                    ...new Set([
                        ...nodesArr,
                        ...currNodesArr.filter(
                            (node) => hpi.nodes[node]?.text != 'nan'
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
            parentNode = hpiHeaders.parentNodes[chiefComplaint][category];
        let newNodes: string[] = [];
        if (order && order[parentNode] && order[parentNode]['1']) {
            newNodes = graph[order[parentNode]['1']]
                .reduce((prevVal, node) => {
                    let currNodes = prevVal;
                    const i = currNodes.findIndex((n) => n == node);
                    if (nodes[node]?.text == 'nan')
                        currNodes = [
                            ...currNodes.slice(0, i + 1),
                            ...graph[node],
                            ...currNodes.slice(i + 1, currNodes.length),
                        ];
                    return currNodes;
                }, graph[order[parentNode]['1']] as string[])
                .filter((node) => !totalNodes.includes(node));
        }
        firstOrderNodesMap[chiefComplaint] = newNodes.slice().reverse();
        totalNodes = [...totalNodes, ...newNodes].filter(
            (node) => nodes[node]?.text != 'nan'
        );
    });
    return [firstOrderNodesMap, totalNodes];
}

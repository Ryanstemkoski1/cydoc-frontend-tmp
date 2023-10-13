import axios from 'axios';
import { graphClientURL } from 'constants/api';

// TODO - use this function on files where we fetch data from knowledge graph api for particular chiefcomplaint
/**
 * Load data for passed chiefcomplaint name from knowledge graph api
 * @param chiefcomplaint as string
 * @returns response payload
 */
export const getChiefComplaintData = async (chiefcomplaint: string) => {
    if (!chiefcomplaint) {
        return;
    }
    const response = await axios.get(
        graphClientURL + '/graph/category/' + chiefcomplaint + '/4'
    );
    return response.data;
};

/**
 * Load all chiefcomplaints data from Knowledge Graph api
 * @param chiefcomplaints
 * @returns responses payload for all chiefcomplaints
 */
export async function loadChiefComplaintsData(chiefcomplaints: string[]) {
    const dataLoadingPromises: Promise<any>[] = [];

    chiefcomplaints.forEach((chiefcomplaint) =>
        dataLoadingPromises.push(getChiefComplaintData(chiefcomplaint))
    );

    const values = await Promise.all([...dataLoadingPromises]);
    return values;
}

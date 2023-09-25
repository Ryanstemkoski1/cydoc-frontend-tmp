import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';

export function getSelectedChiefCompliants(
    currentChiefCompliants: ChiefComplaintsState
) {
    return Object.keys(currentChiefCompliants);
}

function useSelectedChiefComplaints() {
    const chiefComplaints = useSelector(
        (state: CurrentNoteState) => state.chiefComplaints
    );

    return useMemo(
        () => getSelectedChiefCompliants(chiefComplaints),
        [chiefComplaints]
    );
}
export default useSelectedChiefComplaints;

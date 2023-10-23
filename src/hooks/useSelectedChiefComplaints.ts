import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';

export function getSelectedChiefCompliants(
    currentChiefCompliants: ChiefComplaintsState
) {
    return Object.keys(currentChiefCompliants);
}

export function useSelectedPinnedChiefComplaints() {
    const userSurveyState = useSelector(
        (state: CurrentNoteState) => state.userView.userSurvey
    );

    const pinnedChiefComplaints = Object.keys(
        userSurveyState.nodes['6'].response ?? {}
    );

    const selectedChiefComplaints = useSelectedChiefComplaints();

    return useMemo(
        () =>
            selectedChiefComplaints.filter((el) =>
                pinnedChiefComplaints.includes(el)
            ),
        [pinnedChiefComplaints, selectedChiefComplaints]
    );
}

export function useListTextChiefComplaints() {
    const userSurveyState = useSelector(
        (state: CurrentNoteState) => state.userView.userSurvey
    );

    const pinnedChiefComplaints = Object.keys(
        userSurveyState.nodes['6'].response ?? {}
    );

    const selectedChiefComplaints = useSelectedChiefComplaints();

    return useMemo(
        () =>
            selectedChiefComplaints.filter(
                (item) => !pinnedChiefComplaints.includes(item)
            ),
        [pinnedChiefComplaints, selectedChiefComplaints]
    );
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

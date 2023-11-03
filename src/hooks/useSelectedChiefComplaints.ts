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
    const chiefComplaints = useSelector(
        (state: CurrentNoteState) => state.chiefComplaints
    );

    return useMemo(() => {
        const pinnedChiefComplaints = Object.keys(
            userSurveyState?.nodes?.['6']?.response ?? {}
        );

        const selectedChiefComplaints = Object.keys(chiefComplaints);

        return selectedChiefComplaints.filter((el) =>
            pinnedChiefComplaints.includes(el)
        );
    }, [userSurveyState, chiefComplaints]);
}

export function useListTextChiefComplaints() {
    const userSurveyState = useSelector(
        (state: CurrentNoteState) => state.userView.userSurvey
    );

    const chiefComplaints = useSelector(
        (state: CurrentNoteState) => state.chiefComplaints
    );

    return useMemo(() => {
        const pinnedChiefComplaints = Object.keys(
            userSurveyState?.nodes?.['6']?.response ?? {}
        );
        const selectedChiefComplaints = Object.keys(chiefComplaints);

        return selectedChiefComplaints.filter(
            (item) => !pinnedChiefComplaints.includes(item)
        );
    }, [userSurveyState, chiefComplaints]);
}

function useSelectedChiefComplaints() {
    const chiefComplaints = useSelector(
        (state: CurrentNoteState) => state.chiefComplaints
    );
    return useMemo(() => Object.keys(chiefComplaints), [chiefComplaints]);
}

export default useSelectedChiefComplaints;

import {
    PhysicalExamState,
    PhysicalExamSectionState,
    PhysicalExamSection,
    Vitals,
    Findings,
} from 'redux/reducers/physicalExamReducer';
import { CurrentNoteState } from 'redux/reducers/index';

export function selectPhysicalExamState(
    state: CurrentNoteState
): PhysicalExamState {
    return state.physicalExam;
}

export function selectVitals(state: CurrentNoteState): Vitals {
    return state.physicalExam.vitals;
}

export function selectSectionTitles(state: CurrentNoteState): string[] {
    return Object.keys(state.physicalExam.sections);
}

export function selectSection(
    state: CurrentNoteState,
    section: string
): PhysicalExamSection {
    return state.physicalExam.sections[section];
}

export function selectAllSections(
    state: CurrentNoteState
): PhysicalExamSectionState {
    return state.physicalExam.sections;
}

export function selectFindings(
    state: CurrentNoteState,
    section: string,
    finding: string
): Findings {
    return state.physicalExam.sections[section].findings[finding];
}

export function selectComments(
    state: CurrentNoteState,
    section: string
): string {
    return state.physicalExam.sections[section].comments;
}

import { FAMILY_HISTORY_ACTION } from '../actions/actionTypes';
import { FamilyHistoryActionTypes } from '../actions/familyHistoryActions';
import { YesNoResponse } from '../../constants/enums';
import { v4 } from 'uuid';
import { FamilyOption } from 'constants/familyHistoryRelations';

export interface FamilyHistoryState {
    [index: string]: FamilyHistoryCondition;
}

export interface FamilyHistoryCondition {
    condition: string;
    hasAfflictedFamilyMember: YesNoResponse;
    familyMembers: FamilyHistoryMembers;
}

export interface FamilyHistoryMembers {
    [index: string]: FamilyHistoryMember;
}

export interface FamilyHistoryMember {
    member: FamilyOption;
    causeOfDeath: YesNoResponse;
    living: YesNoResponse;
    comments: string;
}

export const initialFamilyHistoryState: FamilyHistoryState = {
    [v4()]: {
        condition: 'Type II Diabetes',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
    [v4()]: {
        condition: 'Myocardial Infarction',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
    [v4()]: {
        condition: 'Hypertension',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
    [v4()]: {
        condition: 'Hypercholesteremia',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
    [v4()]: {
        condition: 'Depression',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
    [v4()]: {
        condition: 'HIV',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {
            [v4()]: {
                member: FamilyOption.None,
                causeOfDeath: YesNoResponse.None,
                living: YesNoResponse.None,
                comments: '',
            },
        },
    },
};

export function familyHistoryReducer(
    state = initialFamilyHistoryState,
    action: FamilyHistoryActionTypes
): FamilyHistoryState {
    switch (action.type) {
        case FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION: {
            const { conditionIndex, optionSelected } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    hasAfflictedFamilyMember:
                        state[conditionIndex].hasAfflictedFamilyMember ==
                        optionSelected
                            ? YesNoResponse.None
                            : optionSelected,
                },
            };
        }
        case FAMILY_HISTORY_ACTION.ADD_FAMILY_MEMBER: {
            const { conditionIndex } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    familyMembers: {
                        ...state[conditionIndex].familyMembers,
                        [v4()]: {
                            member: FamilyOption.None,
                            causeOfDeath: YesNoResponse.None,
                            living: YesNoResponse.None,
                            comments: '',
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.DELETE_FAMILY_MEMBER: {
            const { conditionIndex, familyMemberIndex } = action.payload;
            const numFamilyMembers = Object.keys(
                state[conditionIndex].familyMembers
            ).length;
            if (numFamilyMembers === 1) {
                // Only one family member listed
                // We want to just clear the one member to "delete" it
                return {
                    ...state,
                    [conditionIndex]: {
                        ...state[conditionIndex],
                        familyMembers: {
                            [familyMemberIndex]: {
                                member: FamilyOption.None,
                                causeOfDeath: YesNoResponse.None,
                                living: YesNoResponse.None,
                                comments: '',
                            },
                        },
                    },
                };
            } else {
                const {
                    [familyMemberIndex]: deleted,
                    ...newFamilyHistoryMembers
                } = state[conditionIndex].familyMembers;
                return {
                    ...state,
                    [conditionIndex]: {
                        ...state[conditionIndex],
                        familyMembers: newFamilyHistoryMembers,
                    },
                };
            }
        }
        case FAMILY_HISTORY_ACTION.UPDATE_MEMBER: {
            const {
                conditionIndex,
                familyMemberIndex,
                newMember,
            } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    familyMembers: {
                        ...state[conditionIndex].familyMembers,
                        [familyMemberIndex]: {
                            ...state[conditionIndex].familyMembers[
                                familyMemberIndex
                            ],
                            member: newMember,
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.TOGGLE_CAUSE_OF_DEATH_OPTION: {
            const {
                conditionIndex,
                familyMemberIndex,
                optionSelected,
            } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    familyMembers: {
                        ...state[conditionIndex].familyMembers,
                        [familyMemberIndex]: {
                            ...state[conditionIndex].familyMembers[
                                familyMemberIndex
                            ],
                            causeOfDeath:
                                state[conditionIndex].familyMembers[
                                    familyMemberIndex
                                ].causeOfDeath == optionSelected
                                    ? YesNoResponse.None
                                    : optionSelected,
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.TOGGLE_LIVING_OPTION: {
            const {
                conditionIndex,
                familyMemberIndex,
                optionSelected,
            } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    familyMembers: {
                        ...state[conditionIndex].familyMembers,
                        [familyMemberIndex]: {
                            ...state[conditionIndex].familyMembers[
                                familyMemberIndex
                            ],
                            living:
                                state[conditionIndex].familyMembers[
                                    familyMemberIndex
                                ].living == optionSelected
                                    ? YesNoResponse.None
                                    : optionSelected,
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.UPDATE_COMMENTS: {
            const {
                conditionIndex,
                familyMemberIndex,
                newComments,
            } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    familyMembers: {
                        ...state[conditionIndex].familyMembers,
                        [familyMemberIndex]: {
                            ...state[conditionIndex].familyMembers[
                                familyMemberIndex
                            ],
                            comments: newComments,
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.ADD_CONDITION: {
            return {
                ...state,
                [v4()]: {
                    condition: '',
                    hasAfflictedFamilyMember: YesNoResponse.None,
                    familyMembers: {
                        [v4()]: {
                            member: FamilyOption.None,
                            causeOfDeath: YesNoResponse.None,
                            living: YesNoResponse.None,
                            comments: '',
                        },
                    },
                },
            };
        }
        case FAMILY_HISTORY_ACTION.UPDATE_CONDITION_NAME: {
            const { conditionIndex, newCondition } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    ...state[conditionIndex],
                    condition: (state[conditionIndex].condition = newCondition),
                },
            };
        }

        case FAMILY_HISTORY_ACTION.ADD_FH_POP_OPTIONS: {
            const { conditionIndex, conditionName } = action.payload;
            return {
                ...state,
                [conditionIndex]: {
                    condition: conditionName,
                    hasAfflictedFamilyMember: YesNoResponse.None,
                    familyMembers: {
                        [v4()]: {
                            member: FamilyOption.None,
                            causeOfDeath: YesNoResponse.None,
                            living: YesNoResponse.None,
                            comments: '',
                        },
                    },
                },
            };
        }

        default: {
            return state;
        }
    }
}

// TODO (AL): Consider turning types into an enum when typescript gets merged
// Listed in order of frequency of use
export const questionTypes = {
    YES_NO: 'YES-NO',
    NO_YES: 'NO-YES',
    SELECTONE: 'SELECTONE',
    SELECTMANY: 'SELECTMANY',
    SHORT_TEXT: 'SHORT-TEXT',
    PMH: 'PMH',
    TIME: 'TIME',
    NUMBER: 'NUMBER',
    LIST_TEXT: 'LIST-TEXT',
    FH: 'FH',
    MEDS: 'MEDS',
    BODY_LOCATION: 'BODYLOCATION',
    PSH: 'PSH',
};

export const questionTypeMapping = {
    basic: {
        [questionTypes.NUMBER]: 'Number',
        [questionTypes.TIME]: 'Age or Duration',
        [questionTypes.BODY_LOCATION]: 'Body Location',
        [questionTypes.YES_NO]: 'Yes/No',
        [questionTypes.NO_YES]: 'No/Yes',
        [questionTypes.SHORT_TEXT]: 'Short Text',
        [questionTypes.SELECTONE]: 'Single Selection',
        [questionTypes.SELECTMANY]: 'Multiple Selection',
        [questionTypes.LIST_TEXT]: 'List',
    },
    advanced: {
        [questionTypes.FH]: 'Family History',
        [questionTypes.PMH]: 'Past Medical History',
        [questionTypes.MEDS]: 'Medications',
        [questionTypes.PSH]: 'Past Surgical History',
    },
};

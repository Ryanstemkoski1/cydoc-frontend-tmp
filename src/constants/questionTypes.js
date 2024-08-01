// TODO (AL): Consider turning types into an enum when typescript gets merged
// Listed in order of frequency of use
export const questionTypes = {
    YES_NO: 'YES-NO',
    NO_YES: 'NO-YES',
    SELECTONE: 'SELECTONE',
    SELECTMANY: 'SELECTMANY',
    SELECTMANYDENSE: 'SELECTMANYDENSE',
    SHORT_TEXT: 'SHORT-TEXT',
    PMH: 'PMH',
    TIME: 'TIME',
    YEAR: 'YEAR',
    NUMBER: 'NUMBER',
    DATE: 'DATE',
    LIST_TEXT: 'LIST-TEXT',
    FH: 'FH',
    MEDS: 'MEDS',
    BODY_LOCATION: 'BODYLOCATION',
    PSH: 'PSH',
    AGEATEVENT: 'AGEATEVENT',
    PSYCHDXPICKER: 'PSYCHDXPICKER',
    PRONOUN: 'PRONOUN',
};

export const questionTypeMapping = {
    basic: {
        [questionTypes.NUMBER]: 'Number',
        [questionTypes.AGEATEVENT]: 'Age At Event',
        [questionTypes.TIME]: 'Age or Duration',
        [questionTypes.DATE]: 'Date',
        [questionTypes.YEAR]: 'Year',
        [questionTypes.BODY_LOCATION]: 'Body Location',
        [questionTypes.YES_NO]: 'Yes/No',
        [questionTypes.NO_YES]: 'No/Yes',
        [questionTypes.SHORT_TEXT]: 'Short Text',
        [questionTypes.SELECTONE]: 'Single Selection',
        [questionTypes.SELECTMANY]: 'Multiple Selection',
        [questionTypes.SELECTMANYDENSE]: 'Multiple Selection (Dense)',
        [questionTypes.LIST_TEXT]: 'List',
        [questionTypes.PRONOUN]: 'Pronoun',
    },
    advanced: {
        [questionTypes.FH]: 'Family History',
        [questionTypes.PMH]: 'Past Medical History',
        [questionTypes.MEDS]: 'Medications',
        [questionTypes.PSH]: 'Past Surgical History',
        [questionTypes.PSYCHDXPICKER]: 'DSM-5 Diagnoses',
    },
};

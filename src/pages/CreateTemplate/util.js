export const getAnswerInfo = (type) => {
    if (type === 'YES-NO' || type === 'NO-YES') {
        return {
            yesResponse: '',
            noResponse: '',
        }
    } else if (type === 'SHORT-TEXT'
    || type === 'NUMBER'
    || type === 'TIME'
    || type === 'LIST-TEXT') {
        return {
            startResponse: '',
            endResponse: '',
        }
    } else if (type === 'CLICK-BOXES') {
        return {
            options: ['', '', ''],
            startResponse: '',
            endResponse: '',
        }
    } else if (type.startsWith('FH')
    || type.startsWith('PMH')
    || type.startsWith('PSH')
    || type.startsWith('MEDS')) {
        return {
            options: [],
        }
    }
}
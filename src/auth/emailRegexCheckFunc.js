import emailsRegex from './authorizedEmails';

const emailRegexCheckFunc = async (email) => {
    let output = false;
    for (let val of emailsRegex) {
        const regex = new RegExp(val);
        if (!regex.test(email)) {
            output = true;
        } else if (regex.test(email)) {
            output = false;
        }
    }
    return output;
};
export default emailRegexCheckFunc;

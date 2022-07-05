import emailsRegex from './authorizedEmails';

const isEmailValid = (email) => {
    // Return true if meets regex criteria
    for (let val of emailsRegex) {
        const regex = new RegExp(val);
        if (regex.test(email)) {
            return true;
        }
    }

    // Check if any allowed domain identifiers are used after the @ sign
    const emailDomain = email.split('@')[1];
    const allowedDomainIdentifiers = [
        'health',
        'medicine',
        'medical',
        'hospital',
        'clinic',
    ];
    return allowedDomainIdentifiers.some((i) => emailDomain.indexOf(i) > 0);
};

export default isEmailValid;

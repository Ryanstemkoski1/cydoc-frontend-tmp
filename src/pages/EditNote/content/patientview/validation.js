import * as yup from 'yup';

const formSchema = {
    cellPhoneNumber: yup.lazy((value) =>
        value === ''
            ? yup.string()
            : yup.string().matches(/^\d{10}$/gm, 'Enter a valid phone number')
    ),
    email: yup.string().email('Email address must be a valid email'),
    address: yup.object({
        addressLine1: yup.string(),
        addressLine2: yup.string(),
        city: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup
                      .string()
                      .matches(
                          /^[A-Za-z\s]*$/,
                          'City should contain alphabets only'
                      )
        ),
        state: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup
                      .string()
                      .matches(
                          /^[A-Za-z\s]*$/,
                          'State should contain alphabets only'
                      )
        ),
        zipCode: yup.lazy((value) =>
            value === '' ? yup.string() : yup.number()
        ),
    }),
    isInsured: yup.bool(),
    insuranceInfo: yup.object({
        insuranceCompanyName: yup.string(),
        insuranceCompanyPhoneNumber: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup
                      .string()
                      .matches(/^\d{10}$/gm, 'Enter a valid phone number')
        ),
        policyHolderName: yup.string(),
        policyHolderRelationship: yup.string(),
        policyHolderDOB: yup.string(),
        policyHolderEmployer: yup.string(),
        policyHolderEmployed: yup.bool(),
        policyHolderSSN: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup.string().matches(/^\d{9}$/gm, 'Enter a valid SSN')
        ),
        policyHolderID: yup.string(),
        group: yup.string(),
    }),
    race: yup.array().of(yup.string()),
    ethnicity: yup.string(),
    genderIdentity: yup.array().of(yup.string()),
    sex: yup.string(),
    preferredPronouns: yup.string(),
    title: yup.string(),
};

export const formValidation = yup.object().shape(formSchema);

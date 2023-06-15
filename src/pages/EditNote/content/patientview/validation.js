import * as yup from 'yup';

const formSchema = {
    cellPhoneNumber: yup.lazy((value) =>
        value === ''
            ? yup.string()
            : yup
                  .string()
                  .matches(
                      /^\(\d{3}\)\d{3}-\d{4}$/gm,
                      'Enter a valid phone number'
                  )
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
                          /^[a-zA-Z]+$/,
                          'City should contain alphabets only'
                      )
        ),
        state: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup
                      .string()
                      .matches(
                          /^[a-zA-Z]+$/,
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
                      .matches(
                          /^\(\d{3}\)\d{3}-\d{4}$/gm,
                          'Enter a valid insurance company phone number'
                      )
        ),
        policyHolderName: yup.string(),
        policyHolderRelationship: yup.string(),
        policyHolderDOB: yup.string(),
        policyHolderEmployer: yup.string(),
        policyHolderEmployed: yup.bool(),
        policyHolderSSN: yup.lazy((value) =>
            value === ''
                ? yup.string()
                : yup
                      .string()
                      .matches(
                          /([0-9]{3})-([0-9]{2})-([0-9]{4})/gm,
                          'Enter a valid SSN'
                      )
        ),
        policyHolderID: yup.string(),
        group: yup.string(),
    }),
    race: yup.string(),
    ethnicity: yup.string(),
    genderIdentity: yup.string(),
    sex: yup.string(),
    preferredPronouns: yup.string(),
    title: yup.string(),
};

export const formValidation = yup.object().shape(formSchema);

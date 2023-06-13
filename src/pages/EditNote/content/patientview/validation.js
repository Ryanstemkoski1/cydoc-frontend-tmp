import * as yup from 'yup';

const formSchema = {
    cellPhoneNumber: yup.string().required('Phone Number required'),
    email: yup.string().required('Email id required'),
    address: yup.object({
        addressLine1: yup.string().required('Address Line 1 required'),
        addressLine2: yup.string().required('Address Line 2 required'),
        city: yup.string().required('City required'),
        state: yup.string().required('State required'),
        zipCode: yup.string().required('ZipCode required'),
    }),
    isInsured: yup.bool(),
    insuranceInfo: yup.object({
        insuranceCompanyName: yup.string(),
        insuranceCompanyPhoneNumber: yup.string(),
        policyHolderName: yup.string(),
        policyHolderRelationship: yup.string(),
        policyHolderDOB: yup.string(),
        policyHolderEmployer: yup.string(),
        policyHolderEmployed: yup.bool(),
        policyHolderSSN: yup.string(),
        policyHolderID: yup.string(),
        group: yup.string(),
    }),
    race: yup.string().required('Race required'),
    ethnicity: yup.string().required('Ethnicity required'),
    genderIdentity: yup.string().required('Gender Identity required'),
    sex: yup.string().required('Sex required'),
    preferredPronouns: yup.string().required('Preferred Pronouns required'),
    title: yup.string().required('Title required'),
};

export const formValidation = yup.object().shape(formSchema);

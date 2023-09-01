export type AmplifyDependentResourcesAttributes = {
    auth: {
        CydocAmplifyAuth: {
            AppClientID: 'string';
            AppClientIDWeb: 'string';
            CreatedSNSRole: 'string';
            UserPoolArn: 'string';
            UserPoolId: 'string';
            UserPoolName: 'string';
        };
    };
    function: {
        CydocAmplifyAuthPreSignup: {
            Arn: 'string';
            LambdaExecutionRole: 'string';
            LambdaExecutionRoleArn: 'string';
            Name: 'string';
            Region: 'string';
        };
    };
};

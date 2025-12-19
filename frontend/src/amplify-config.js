import { Amplify } from 'aws-amplify';

const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
        }
    },
    API: {
        REST: {
            BlogApi: {
                endpoint: import.meta.env.VITE_API_URL,
                region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
            }
        }
    }
};

Amplify.configure(amplifyConfig);

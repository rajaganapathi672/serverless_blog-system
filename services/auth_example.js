/**
 * Example of how to enforce Admin-only access within a Lambda handler.
 * API Gateway + Cognito Authorizer handles the signature validation.
 * The handler verifies the user's group.
 */
exports.handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const groups = claims['cognito:groups'] || "";

    // Enforce Admin Group
    if (!groups.includes("Admins")) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: "Access Denied: Admins Only" })
        };
    }

    // Process logic here...
};

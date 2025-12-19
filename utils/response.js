const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};

exports.success = (body) => {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(body),
    };
};

exports.error = (statusCode, message) => {
    return {
        statusCode,
        headers,
        body: JSON.stringify({ error: message }),
    };
};

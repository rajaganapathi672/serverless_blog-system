const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const queryParams = event.queryStringParameters || {};
        const limit = parseInt(queryParams.limit) || 10;
        const nextToken = queryParams.cursor ? JSON.parse(Buffer.from(queryParams.cursor, 'base64').toString('utf-8')) : undefined;

        const params = {
            TableName: TABLE_NAME,
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :status",
            ExpressionAttributeValues: {
                ":status": "STATUS#PUBLISHED"
            },
            Limit: limit,
            ScanIndexForward: false, // Newest first
            ExclusiveStartKey: nextToken
        };

        const result = await docClient.send(new QueryCommand(params));

        const response = {
            items: result.Items,
            nextCursor: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : null
        };

        return success(response);

    } catch (err) {
        console.error("ListPosts Error:", err);
        return error(500, "Internal Server Error");
    }
};

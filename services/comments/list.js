const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const { postId } = event.pathParameters || {};

        if (!postId) return error(400, "Missing postId");

        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": `POST#${postId}`,
                ":sk": "COMMENT#"
            }
        };

        const result = await docClient.send(new QueryCommand(params));

        return success(result.Items);

    } catch (err) {
        console.error("ListComments Error:", err);
        return error(500, "Internal Server Error");
    }
};

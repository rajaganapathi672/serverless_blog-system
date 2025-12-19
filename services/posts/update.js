const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const { postId } = event.pathParameters || {};
        const body = JSON.parse(event.body);
        const { title, content, status } = body;

        if (!postId) return error(400, "Missing postId");

        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        if (title) {
            updateExpression.push("#title = :title");
            expressionAttributeNames["#title"] = "title";
            expressionAttributeValues[":title"] = title;
        }
        if (content) {
            updateExpression.push("#content = :content");
            expressionAttributeNames["#content"] = "content";
            expressionAttributeValues[":content"] = content;
        }
        if (status) {
            updateExpression.push("#status = :status");
            expressionAttributeNames["#status"] = "status";
            expressionAttributeValues[":status"] = status;
        }

        updateExpression.push("updatedAt = :updatedAt");
        expressionAttributeValues[":updatedAt"] = new Date().toISOString();

        if (updateExpression.length === 1) {
            return error(400, "No fields to update");
        }

        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `POST#${postId}`,
                SK: "METADATA"
            },
            UpdateExpression: "SET " + updateExpression.join(", "),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };

        const result = await docClient.send(new UpdateCommand(params));

        return success(result.Attributes);

    } catch (err) {
        console.error("UpdatePost Error:", err);
        return error(500, "Internal Server Error");
    }
};

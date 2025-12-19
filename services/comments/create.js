const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { v4: uuidv4 } = require("uuid");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const { postId } = event.pathParameters || {};
        const body = JSON.parse(event.body);
        const { user, content } = body;

        if (!postId || !content) {
            return error(400, "Missing required fields");
        }

        const commentId = uuidv4();
        const createdAt = new Date().toISOString();

        const item = {
            PK: `POST#${postId}`,
            SK: `COMMENT#${commentId}`,
            type: "Comment",
            commentId,
            user: user || "Anonymous",
            content,
            createdAt
        };

        await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        }));

        return success(item);

    } catch (err) {
        console.error("AddComment Error:", err);
        return error(500, "Internal Server Error");
    }
};

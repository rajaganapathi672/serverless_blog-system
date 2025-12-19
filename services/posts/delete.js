const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const { postId } = event.pathParameters || {};

        if (!postId) return error(400, "Missing postId");

        // Note: usage of transactional delete is recommended to remove SLUG item + Comments
        // For simplicity in this step, we just delete the post metadata. 
        // A complete implementation would first fetch the slug to delete it too.

        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `POST#${postId}`,
                SK: "METADATA"
            }
        };

        await docClient.send(new DeleteCommand(params));

        return success({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("DeletePost Error:", err);
        return error(500, "Internal Server Error");
    }
};

const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const { slug } = event.pathParameters || {};

        if (!slug) return error(400, "Missing slug");

        // 1. Resolve Slug to Post ID
        const slugParams = {
            TableName: TABLE_NAME,
            Key: {
                PK: `SLUG#${slug}`,
                SK: `SLUG#${slug}`
            }
        };

        const slugResult = await docClient.send(new GetCommand(slugParams));
        if (!slugResult.Item) {
            return error(404, "Post not found");
        }

        const postId = slugResult.Item.postId;

        // 2. Fetch Post Metadata
        const postParams = {
            TableName: TABLE_NAME,
            Key: {
                PK: `POST#${postId}`,
                SK: "METADATA"
            }
        };

        const postResult = await docClient.send(new GetCommand(postParams));
        if (!postResult.Item) {
            return error(404, "Post data missing");
        }

        return success(postResult.Item);

    } catch (err) {
        console.error("GetPost Error:", err);
        return error(500, "Internal Server Error");
    }
};

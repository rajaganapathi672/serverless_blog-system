const { docClient } = require("../../utils/db");
const { success, error } = require("../../utils/response");
const { v4: uuidv4 } = require("uuid");
const { TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME || "BlogTable";

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { title, content, slug, author, status } = body;

        if (!title || !slug || !content) {
            return error(400, "Missing required fields: title, slug, content");
        }

        const postId = uuidv4();
        const createdAt = new Date().toISOString();
        const postStatus = status || "DRAFT";

        const postItem = {
            PK: `POST#${postId}`,
            SK: "METADATA",
            type: "Post",
            postId,
            slug,
            title,
            content,
            author: author || "Admin",
            status: postStatus,
            createdAt,
            updatedAt: createdAt
        };

        // Add GSI attributes if published
        if (postStatus === "PUBLISHED") {
            postItem.GSI1PK = "STATUS#PUBLISHED";
            postItem.GSI1SK = createdAt;
        }

        postItem.GSI2PK = `AUTHOR#${postItem.author}`;
        postItem.GSI2SK = createdAt;

        const slugItem = {
            PK: `SLUG#${slug}`,
            SK: `SLUG#${slug}`,
            type: "Slug",
            postId
        };

        const command = new TransactWriteCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: TABLE_NAME,
                        Item: postItem
                    }
                },
                {
                    Put: {
                        TableName: TABLE_NAME,
                        Item: slugItem,
                        ConditionExpression: "attribute_not_exists(PK)"
                    }
                }
            ]
        });

        await docClient.send(command);

        return success({ message: "Post created successfully", postId, slug });
    } catch (err) {
        console.error("CreatePost Error:", err);
        if (err.name === "TransactionCanceledException") {
            return error(409, "Slug already exists");
        }
        return error(500, "Internal Server Error");
    }
};

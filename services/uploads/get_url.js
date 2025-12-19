const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { success, error } = require("../../utils/response");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.MEDIA_BUCKET_NAME;

exports.handler = async (event) => {
    try {
        const contentType = event.queryStringParameters?.contentType;

        if (!contentType) {
            return error(400, "Missing contentType parameter");
        }

        const fileId = uuidv4();
        const extension = contentType.split("/")[1];
        const key = `uploads/${fileId}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        return success({
            uploadUrl,
            fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
        });

    } catch (err) {
        console.error("GetUploadURL Error:", err);
        return error(500, "Internal Server Error");
    }
};

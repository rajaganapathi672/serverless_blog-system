# Serverless Blog Platform

A high-performance, fully serverless blogging system built with AWS SAM, Node.js, and React.

## 🚀 Overview
The Serverless Blog Platform is a technical demonstration of modern cloud-native architectures. It leverages AWS managed services to provide a scalable, secure, and cost-effective blogging solution with zero server management over-head.

## 📊 Key Metrics & Advantages

### 📈 Scalability
- **Elastic Compute**: Uses AWS Lambda and API Gateway, scaling automatically from zero to thousands of concurrent requests.
- **Micro-Millisecond Latency**: Amazon DynamoDB provides fixed performance regardless of traffic volume using Single-Table Design.
- **Global Edge Delivery**: Integrated with Amazon CloudFront to serve frontend assets with low latency worldwide.

### 💰 Cost Efficiency
- **Pure Pay-per-Use**: Zero idle costs. Billing is based strictly on request count and execution duration.
- **Free Tier Optimized**: Fits 100% within the AWS Free Tier for startups and personal use cases.
- **Serverless Storage**: Utilizing S3 and DynamoDB is 80-90% more cost-effective than traditional EC2+RDS setups.

### 🛡 Security
- **Identity Management**: Secure authentication via Amazon Cognito with JWT validation.
- **Access Control**: Granular group-based authorization (Admins only) for write/delete operations.
- **Least Privilege**: Strict IAM policies ensure each component has the absolute minimum permissions required.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js 18, AWS SDK v3, AWS Lambda.
- **Infrastructure**: AWS SAM (CloudFormation).
- **Database**: DynamoDB (Single-Table Design).
- **Auth/Storage**: Cognito, S3, CloudFront.

## � Future Scope
- **Full-Text Search**: Integration with Amazon OpenSearch for post content indexing.
- **Analytics Dashboard**: Real-time traffic monitoring and user engagement tracking.
- **Content Moderation**: Admin workflow for approving or flagging user comments.
- **Automated CI/CD**: Zero-downtime deployment pipelines via GitHub Actions.

## ⚙️ Getting Started
1. **Prerequisites**: AWS CLI, SAM CLI, Node.js.
2. **Setup**: `npm install` in frontend, update `.env.example`.
3. **Deploy**: `sam build && sam deploy --guided`.


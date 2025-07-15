# CC Intelligence UI - AWS Deployment Guide

This guide explains how to deploy the CC Intelligence UI React frontend to AWS using CDK.

## Prerequisites

1. **AWS CLI** installed and configured
2. **Node.js** (version 18 or higher)
3. **AWS CDK** installed globally: `npm install -g aws-cdk`
4. **AWS credentials** configured with appropriate permissions

## Environment Setup

Create a `.env` file in the project root with the following variables:

```bash
# API Configuration
VITE_API_ENDPOINT=https://your-cc-orchestrator1-api-endpoint.com
VITE_API_KEY=your-cc-orchestrator1-api-key

# AWS Configuration (optional - will use default profile and region if not set)
AWS_PROFILE=default
AWS_REGION=us-west-2
```

## Deployment

### Deploy the Application

```bash
# Deploy using npm script
npm run deploy

# Or deploy directly with options
./deploy --profile your-aws-profile --region us-west-2
```

The deployment process will:
1. Build the CDK infrastructure
2. Deploy S3 bucket and CloudFront distribution
3. Build the React frontend
4. Upload files to S3
5. Invalidate CloudFront cache
6. Display the website URL

### Destroy the Application

```bash
# Destroy using npm script
npm run destroy

# Or destroy directly with options
./destroy --profile your-aws-profile --region us-west-2
```

## AWS Resources Created

The deployment creates the following AWS resources:

- **S3 Bucket**: For static website hosting
- **S3 Bucket**: For CloudFront access logs
- **CloudFront Distribution**: For global content delivery
- **Origin Access Control (OAC)**: For secure S3 access

## Architecture

```
Internet → CloudFront → S3 Bucket (Static Website)
                    ↓
                S3 Bucket (Logs)
```

## Cost Considerations

- **S3 Storage**: ~$0.023 per GB per month
- **CloudFront**: ~$0.085 per GB for first 10 TB
- **CloudFront Requests**: ~$0.0075 per 10,000 requests
- **S3 Requests**: ~$0.0004 per 1,000 requests

## Security Features

- **Origin Access Control**: S3 bucket is not publicly accessible
- **HTTPS Only**: All traffic redirected to HTTPS
- **SSL/TLS**: Automatic SSL certificate management

## Monitoring

- **CloudFront Logs**: Stored in dedicated S3 bucket
- **CloudWatch**: Automatic metrics for CloudFront and S3

## Troubleshooting

### CDK Bootstrap Required

If you see a bootstrap error, run:
```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Permission Errors

Ensure your AWS credentials have permissions for:
- CloudFormation
- S3
- CloudFront
- IAM

### Build Errors

Make sure all dependencies are installed:
```bash
npm ci
cd infrastructure && npm ci
```

## Development vs Production

For production deployments, consider:
- Using a custom domain with Route 53
- Setting up CI/CD pipeline
- Adding monitoring and alerting
- Implementing security headers
- Using AWS WAF for additional protection

## Support

For issues with the cc-orchestrator1 API, refer to the parent project documentation.
For deployment issues, check the AWS CloudFormation console for detailed error messages. 
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CcIntelligenceStack } from '../lib/cc-intelligence-stack';

const app = new cdk.App();

new CcIntelligenceStack(app, 'CcIntelligenceStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  description: 'CC Intelligence UI infrastructure with S3 and CloudFront'
}); 
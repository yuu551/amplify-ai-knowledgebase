import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, knowledgeBaseLambda } from './data/resource';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  knowledgeBaseLambda,
});

// Bedrock Knowledge Base接続のためのIAM権限を追加
backend.knowledgeBaseLambda.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:RetrieveAndGenerate',
      'bedrock:Retrieve',
      'bedrock:InvokeModel'
    ],
    resources: [
      `arn:aws:bedrock:us-east-1:*:knowledge-base/${process.env.KNOWLEDGE_BASE_ID || 'YOUR_KNOWLEDGE_BASE_ID'}`,
      'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0'
    ]
  })
);

console.log('Lambda function configured with Bedrock permissions');

// HTTP DataSource for Knowledge Base
const KnowledgeBaseDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "KnowledgeBaseDataSource",
  `https://bedrock-agent-runtime.us-east-1.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

// Grant permissions to the HTTP DataSource
KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "bedrock:Retrieve",
    ],
    resources: [
      `arn:aws:bedrock:us-east-1:*:knowledge-base/${process.env.KNOWLEDGE_BASE_ID || 'YOUR_KNOWLEDGE_BASE_ID'}`,
    ],
  })
);

console.log('HTTP DataSource configured for Bedrock Knowledge Base');
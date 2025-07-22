// amplify/data/knowledgeBaseLambda.ts
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import type { Schema } from './resource';

export const handler: Schema["queryKnowledgeBase"]["functionHandler"] = async (event) => {
  console.log('Knowledge Base Lambda invoked with event:', JSON.stringify(event, null, 2));
  
  const { query } = event.arguments;
  
  if (!query) {
    console.log('Query parameter is missing');
    return {
      response: null,
      sourceDocuments: [],
      error: 'Query is required'
    };
  }

  console.log('Processing query:', query);

  const client = new BedrockAgentRuntimeClient({ 
    region: 'us-east-1'
  });

  try {
    console.log('Creating RetrieveAndGenerateCommand with parameters');
    
    const command = new RetrieveAndGenerateCommand({
      input: {
        text: query
      },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID || 'YOUR_KNOWLEDGE_BASE_ID',
          modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0'
        }
      }
    });

    console.log('Sending command to Bedrock Agent Runtime');

    const response = await client.send(command);
    console.log('Received response from Bedrock:', JSON.stringify(response, null, 2));
    
    // ソース文書の抽出を改善
    const sourceDocuments: string[] = [];
    if (response.citations) {
      for (const citation of response.citations) {
        if (citation.retrievedReferences) {
          for (const ref of citation.retrievedReferences) {
            if (ref.location?.s3Location?.uri) {
              sourceDocuments.push(ref.location.s3Location.uri);
            } else if (ref.content?.text) {
              // S3 URIがない場合は、コンテンツの最初の50文字を表示
              sourceDocuments.push(ref.content.text.substring(0, 50) + '...');
            }
          }
        }
      }
    }
    
    const result = {
      response: response.output?.text || 'No response generated',
      sourceDocuments: sourceDocuments,
      error: null
    };
    
    console.log('Returning result:', JSON.stringify(result, null, 2));
    return result;

  } catch (error) {
    console.error('Bedrock error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, null, 2)
    });
    
    return {
      response: null,
      sourceDocuments: [],
      error: error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown error occurred'
    };
  }
};
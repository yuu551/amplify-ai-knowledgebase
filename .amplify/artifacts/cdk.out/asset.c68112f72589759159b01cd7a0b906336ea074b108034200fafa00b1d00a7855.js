// amplify/data/knowledgeBaseResolver.js
export function request(ctx) {
  const { query } = ctx.arguments;
  
  return {
    operation: 'Invoke',
    payload: {
      actionGroup: 'bedrock',
      function: 'retrieveAndGenerate',
      parameters: {
        input: {
          text: query
        },
        retrieveAndGenerateConfiguration: {
          type: 'KNOWLEDGE_BASE',
          knowledgeBaseConfiguration: {
            knowledgeBaseId: '0MCINIZTSW',
            modelArn: 'arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0'
          }
        }
      }
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    return {
      error: ctx.error.message,
      response: null
    };
  }

  const result = ctx.result;
  
  return {
    response: result.output?.text || 'No response generated',
    sourceDocuments: result.citations?.map(citation => ({
      content: citation.generatedResponsePart?.textResponsePart?.text || '',
      metadata: citation.retrievedReferences?.map(ref => ({
        source: ref.location?.s3Location?.uri || '',
        score: ref.metadata?.score || 0
      })) || []
    })) || [],
    error: null
  };
}
export function request(ctx) {
  const { input } = ctx.args;
  return {
    resourcePath: "/knowledgebases/EQ7FTLNFVM/retrieve",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retrievalQuery: {
          text: input
        }
      }),
    },
  };
}

export function response(ctx) {
  const result = JSON.parse(ctx.result.body);
  
  // Extract the text content and source information from the retrieval results
  if (result.retrievalResults && result.retrievalResults.length > 0) {
    const response = result.retrievalResults
      .map(item => item.content?.text || '')
      .filter(text => text.length > 0)
      .join('\n\n');
    
    const sourceDocuments = result.retrievalResults
      .map(item => item.location?.s3Location?.uri || item.location?.type || 'Unknown source')
      .filter((source, index, self) => self.indexOf(source) === index); // Remove duplicates
    
    return JSON.stringify({
      response: response || 'No relevant information found.',
      sourceDocuments: sourceDocuments,
      error: null
    });
  }
  
  return JSON.stringify({
    response: null,
    sourceDocuments: [],
    error: 'No results found from knowledge base.'
  });
}
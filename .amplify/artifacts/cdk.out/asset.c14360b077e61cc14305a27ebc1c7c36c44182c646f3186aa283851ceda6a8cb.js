import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { args, request } = ctx;
  const { graphqlApiEndpoint } = ctx.stash;
  const userAgent = createUserAgent(request);

  const selectionSet = 'associatedUserMessageId contentBlockDeltaIndex contentBlockDoneAtIndex contentBlockIndex contentBlockText contentBlockToolUse { toolUseId name input } conversationId id stopReason owner errors { errorType message } p';

  const streamingResponseMutation = {
    name: 'createAssistantResponseStreamChat',
    inputTypeName: 'CreateConversationMessageChatAssistantStreamingInput',
    selectionSet,
  };

  const currentMessageId = ctx.stash.defaultValues.id;

  const modelConfiguration = {
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    systemPrompt: "You are a helpful AI assistant with access to a knowledge base. Use the search tool to find relevant information to answer user questions.",
    inferenceConfiguration: undefined,
  };

  const clientTools = args.toolConfiguration?.tools?.map((tool) => {
    return { ...tool.toolSpec };
  });
  const dataTools = [{"name":"searchKnowledgeBase","description":"Search the knowledge base for relevant information to answer user questions","inputSchema":{"json":{"type":"object","properties":{"query":{"type":"string","description":"A UTF-8 character sequence."}},"required":["query"]}},"graphqlRequestInputDescriptor":{"selectionSet":"response sourceDocuments error","propertyTypes":{"query":"String!"},"queryName":"queryKnowledgeBase"}}];
  const toolsConfiguration = { dataTools, clientTools };

  const messageHistoryQuery = {
    getQueryName: 'getConversationMessageChat',
    getQueryInputTypeName: 'ID',
    listQueryName: 'listConversationMessageChats',
    listQueryInputTypeName: 'ModelConversationMessageChatFilterInput',
    listQueryLimit: undefined,
  };

  const authHeader = request.headers['authorization'];
  const payload = {
    conversationId: args.conversationId,
    currentMessageId,
    responseMutation: streamingResponseMutation,
    graphqlApiEndpoint,
    modelConfiguration,
    request: {
      headers: {
        authorization: authHeader,
        'x-amz-user-agent': userAgent,
      }
    },
    messageHistoryQuery,
    toolsConfiguration,
    streamResponse: true,
  };

  return {
    operation: 'Invoke',
    payload,
    invocationType: 'Event',
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.appendError(ctx.error.message, ctx.error.type);
  }
  const response = {
    __typename: 'ConversationMessageChat',
    id: ctx.stash.defaultValues.id,
    conversationId: ctx.args.conversationId,
    role: 'user',
    content: ctx.args.content,
    aiContext: ctx.args.aiContext,
    toolConfiguration: ctx.args.toolConfiguration,
    createdAt: ctx.stash.defaultValues.createdAt,
    updatedAt: ctx.stash.defaultValues.updatedAt,
  };
  return response;
}

function createUserAgent(request) {
  const packageMetadata = 'amplify-graphql-conversation-transformer#1.1.12';
  let userAgent = request.headers['x-amz-user-agent'];
  if (userAgent) {
    userAgent = `${userAgent} md/${packageMetadata}`;
  } else {
    userAgent = `lib/${packageMetadata}`;
  }
  return userAgent;
}
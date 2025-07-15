import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

// 実際のBedrock Knowledge Base連携
export const knowledgeBaseLambda = defineFunction({
  name: 'knowledgeBaseLambda',
  entry: './knowledgeBaseLambda.ts',
  timeoutSeconds: 30, // Bedrock応答のために30秒に延長
  memoryMB: 256, // メモリも少し増やす
});

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    completed: a.boolean().default(false),
  })
  .authorization((allow) => [allow.owner()]),

  // Knowledge Base Query
  queryKnowledgeBase: a.query()
    .arguments({ query: a.string().required() })
    .returns(a.customType({
      response: a.string(),
      sourceDocuments: a.string().array(),
      error: a.string()
    }))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(knowledgeBaseLambda)),

  // AI Conversation with Knowledge Base integration (Lambda version)
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: 'You are a helpful AI assistant with access to a knowledge base. Use the search tool to find relevant information to answer user questions.',
    tools: [
      a.ai.dataTool({
        name: 'searchKnowledgeBase',
        description: 'Search the knowledge base for relevant information to answer user questions',
        query: a.ref('queryKnowledgeBase'),
      }),
    ],
  })
  .authorization((allow) => allow.owner()),

  // Knowledge Base Query (HTTP DataSource version)
  queryKnowledgeBaseHttp: a.query()
    .arguments({ input: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.custom({
      dataSource: "KnowledgeBaseDataSource",
      entry: "./resolvers/kbResolver.js"
    })),

  // AI Conversation with Knowledge Base integration (HTTP DataSource version)
  chatHttp: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: 'You are a helpful AI assistant with access to a knowledge base. Use the search tool to find relevant information to answer user questions.',
    tools: [
      a.ai.dataTool({
        name: 'searchDocumentation',
        description: 'Performs a similarity search over the documentation',
        query: a.ref('queryKnowledgeBaseHttp'),
      }),
    ],
  })
  .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
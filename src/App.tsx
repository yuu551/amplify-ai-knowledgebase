import { Authenticator } from '@aws-amplify/ui-react';
import { AIConversation, createAIHooks } from '@aws-amplify/ui-react-ai';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useState } from 'react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();
const { useAIConversation } = createAIHooks(client);

// Knowledge Base Chat Component with AI Conversation (Lambda version)
function KnowledgeBaseChatLambda() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  return (
    <div style={{ height: '600px', overflow: 'hidden' }}>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={sendMessage}
      />
    </div>
  );
}

// Knowledge Base Chat Component with AI Conversation (HTTP DataSource version)
function KnowledgeBaseChatHttp() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chatHttp');

  return (
    <div style={{ height: '600px', overflow: 'hidden' }}>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={sendMessage}
      />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<'lambda' | 'http'>('lambda');

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header with sign out */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3 max-w-6xl">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                  🤖 Knowledge Base AI Assistant
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user?.signInDetails?.loginId}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('lambda')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'lambda'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🔧</span>
                    <span>Lambda関数版</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Lambda + Bedrock API</p>
                </button>

                <button
                  onClick={() => setActiveTab('http')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'http'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🌐</span>
                    <span>HTTPデータソース版</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Direct Bedrock API</p>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'lambda' && (
                  <div>
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Lambda関数版 - Knowledge Base Chat
                      </h2>
                      <p className="text-gray-600">
                        Lambda関数を使用してBedrock Knowledge Baseに接続します。
                      </p>
                    </div>
                    <KnowledgeBaseChatLambda />
                  </div>
                )}
                
                {activeTab === 'http' && (
                  <div>
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        HTTPデータソース版 - Knowledge Base Chat
                      </h2>
                      <p className="text-gray-600">
                        AppSyncのHTTPデータソースを使用して直接Bedrock APIに接続します。
                      </p>
                    </div>
                    <KnowledgeBaseChatHttp />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
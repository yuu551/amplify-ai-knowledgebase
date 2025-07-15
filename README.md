# Amplify + Vite + React + TypeScript + Tailwind + Knowledge Base Template

A modern full-stack template with AWS Amplify backend, AI-powered Knowledge Base (RAG), and Vite + React + TypeScript frontend, styled with Tailwind CSS.

## Features

- ✅ **Vite + React + TypeScript** - Modern development setup
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **AWS Amplify** - Backend with authentication and data
- ✅ **Authentication** - User sign-up/sign-in ready
- ✅ **Data Models** - Todo model with CRUD operations
- ✅ **Knowledge Base RAG** - AI-powered document search and chat
- ✅ **AI Conversation** - Chat interface with knowledge retrieval

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Amplify Backend
```bash
npm run sandbox
# Or manually: npx ampx sandbox
```

This will:
- Deploy your backend to AWS
- Generate `amplify_outputs.json` configuration file
- Watch for changes and auto-deploy

### 3. Start Frontend (in another terminal)
```bash
npm run dev
```

### 4. Open Your Browser
Navigate to `http://localhost:5173`

## Project Structure

```
├── amplify/                 # Amplify backend configuration
│   ├── auth/resource.ts     # Authentication setup
│   ├── data/resource.ts     # Data models and schema
│   └── backend.ts           # Backend configuration
├── src/
│   ├── App.tsx              # Main app with authentication
│   ├── main.tsx             # App entry point with Amplify config
│   └── index.css            # Tailwind CSS imports
├── package.json
└── vite.config.ts           # Vite + Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run sandbox` - Start Amplify backend sandbox
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Adding Features

This template is ready for you to extend with additional features:

- Add more data models in `amplify/data/resource.ts`
- Create new React components
- Extend the UI with more Tailwind components
- Add Amplify AI Kit functionality later

## Authentication

The app includes AWS Cognito authentication out of the box. Users can:
- Sign up with email
- Sign in/out
- Access their own data (owner-based authorization)

## Data Models

The template includes:
- **Todo model** - Simple task management with CRUD operations  
- **Knowledge Base Query** - Custom query for RAG functionality
- **AI Conversation** - Chat interface with knowledge base integration

## Knowledge Base (RAG) Configuration

This template includes a pre-configured Amazon Bedrock Knowledge Base integration:

### Knowledge Base Setup
- **Knowledge Base ID**: `0MCINIZTSW` (configured in `amplify/data/knowledgeBaseResolver.js`)
- **AI Model**: Claude 3.5 Sonnet
- **Region**: ap-northeast-1

### Usage
1. Navigate to the "Knowledge Base" tab in the app
2. Use the sample questions or ask your own questions
3. The AI will search the knowledge base and provide answers with sources

### Customization
To use your own knowledge base:
1. Update the knowledge base ID in `amplify/data/knowledgeBaseResolver.js`
2. Modify the system prompt in `amplify/data/resource.ts`
3. Update the region in `amplify/backend.ts` if needed

## Architecture

```
├── Frontend (React + TypeScript)
│   ├── Todo App - Basic CRUD operations
│   └── Knowledge Base Chat - AI-powered Q&A
├── Backend (AWS Amplify)
│   ├── Authentication (Cognito)
│   ├── Data API (AppSync + DynamoDB)
│   └── Knowledge Base Integration (Bedrock)
└── AI Features
    ├── RAG with Amazon Bedrock Knowledge Base
    └── Conversation API with tool integration
```

## Deployment

To deploy to production:
1. Set up an AWS account with Bedrock access
2. Configure AWS credentials
3. Ensure your knowledge base is accessible in the target region
4. Use `npx ampx deploy` for production deployment

---

Happy coding! 🚀
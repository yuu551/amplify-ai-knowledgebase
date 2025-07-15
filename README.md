# 🤖 Amplify AI Knowledge Base

AWS AmplifyのAI Kitを使用したKnowledge Base統合アプリケーションです。2つの異なる実装方式を比較できます。

## 🚀 機能

- **Lambda関数版**: Lambda関数を使用してBedrock Knowledge Baseに接続
- **HTTPデータソース版**: AppSyncのHTTPデータソースを使用して直接Bedrock APIに接続
- **AIConversation**: AmplifyのAI KitのデフォルトUIコンポーネントを使用
- **認証**: Cognito User Poolsによるユーザー認証
- **リアルタイム**: GraphQLによるリアルタイム通信

## 🏗️ アーキテクチャ

### Lambda関数版
```
React App → AppSync GraphQL → Lambda Function → Bedrock Knowledge Base
```

### HTTPデータソース版
```
React App → AppSync GraphQL → HTTP DataSource → Bedrock Knowledge Base
```

## 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **UI**: Amplify UI React + AI Components
- **バックエンド**: AWS Amplify (Gen 2)
- **AI/ML**: Amazon Bedrock + Claude 3.5 Sonnet
- **認証**: Amazon Cognito
- **API**: AWS AppSync (GraphQL)
- **スタイリング**: Tailwind CSS

## 📦 セットアップ

### 前提条件
- Node.js 18+
- AWS CLI設定済み
- Amplify CLI v6+

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/yuu551/amplify-ai-knowledgebase.git
cd amplify-ai-knowledgebase
```

2. 依存関係をインストール
```bash
npm install
```

3. Amplifyサンドボックスを開始
```bash
npm run sandbox
```

4. 開発サーバーを開始
```bash
npm run dev
```

## 🔧 設定

### Knowledge Base設定
`amplify/data/resolvers/kbResolver.js`でKnowledge Base IDを更新してください：
```javascript
resourcePath: "/knowledgebases/YOUR_KB_ID/retrieve"
```

`amplify/backend.ts`でKnowledge Base ARNを更新してください：
```typescript
"arn:aws:bedrock:us-east-1:*:knowledge-base/YOUR_KB_ID"
```

## 📁 プロジェクト構造

```
amplify-ai-knowledgebase/
├── amplify/
│   ├── auth/                 # Cognito認証設定
│   ├── data/
│   │   ├── resolvers/        # カスタムリゾルバー
│   │   ├── knowledgeBaseLambda.ts  # Lambda関数
│   │   └── resource.ts       # データスキーマ
│   └── backend.ts           # バックエンド設定
├── src/
│   ├── App.tsx              # メインアプリケーション
│   ├── main.tsx             # エントリーポイント
│   └── index.css            # スタイル
└── package.json
```

## 🎯 使用方法

1. アプリケーションにサインアップ/サインイン
2. タブを切り替えて2つの実装を比較
   - **Lambda関数版**: 従来のサーバーレス関数アプローチ
   - **HTTPデータソース版**: 直接API統合アプローチ
3. 質問を入力してKnowledge Baseから回答を取得

## 📊 2つの実装方式の比較

| 項目 | Lambda関数版 | HTTPデータソース版 |
|------|-------------|-------------------|
| **実装複雑度** | 高（Lambda関数が必要） | 低（リゾルバーのみ） |
| **レスポンス時間** | やや遅い（コールドスタート） | 速い（直接API） |
| **コスト** | Lambda実行料金 | AppSync料金のみ |
| **デバッグ** | CloudWatch Logs | AppSync Logs |
| **カスタマイズ性** | 高（任意の処理可能） | 中（リゾルバー内のみ） |

## 🚀 デプロイ

### サンドボックス環境
```bash
npm run sandbox
```

### 本番環境
```bash
npm run deploy
```

## 🛡️ セキュリティ

- Cognito User Poolsによる認証
- IAM権限による適切なリソースアクセス制御
- オーナーベースのデータアクセス制御

## 📝 ライセンス

MIT License
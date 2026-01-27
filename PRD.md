# 项目名称: TrendScout AI (Alpha 趋势星探) - 黑客松 MVP

## 1. 产品概述 (Product Overview)

**TrendScout AI** 是一个基于 Solana 的 SocialFi 辅助工具，属于 "Alpha Hunter Tools" 赛道。
它解决了加密货币市场中“信息过载”和“吹牛无凭据”的问题。
**核心价值：** 利用 AI 快速评估推文/代币的病毒传播潜力，并将用户的“早期发现”通过智能合约永久记录在链上（盖戳存证）。

## 2. 核心用户流程 (Core User Flow)

1.  **连接钱包：** 用户连接 Solana 钱包 (Phantom/Solflare)。
2.  **输入目标：** 用户在巨大的搜索框中粘贴 Trends.fun 或 Twitter 的 URL。
3.  **AI 分析：** 系统调用 AI 接口，分析该内容的 Meme 潜力和风险，返回 0-100 的评分。
4.  **链上盖戳 (Stamp)：** 用户点击“盖戳存证 (Stamp Alpha)”按钮，签署交易。
5.  **生成凭证：** 交易成功后，前端展示一张“已认证”的卡片（包含链上数据），用户可截图分享。

## 3. 技术栈规范 (Strict Tech Stack)

所有生成的代码必须严格遵守以下技术选型：

- **前端框架：** Next.js 14+ (App Router), TypeScript.
- **UI 组件库：** Tailwind CSS, Lucide React (图标).
- **区块链后端：** Solana Anchor Framework (Rust). **注意：仅部署在 Devnet。**
- **钱包交互：** `@solana/wallet-adapter-react`.
- **AI 引擎：** Vercel AI SDK (`generateObject` 模式) + Google AI (gemini).

## 4. 功能详细需求 (Feature Requirements)

**遵循所有的 rules**

### 4.1 智能合约 (Solana Anchor Program)

**目标：** **按照 solana-anchor-rules 写合约，**构建一个极简的存储合约，不涉及代币发行，只存数据。

- **Instruction (指令):** `stamp_alpha`
- **Account (账户结构 - AlphaStamp):**
  - `finder`: Pubkey (发现者的钱包地址)
  - `url`: String (被分析的 URL，前端需截断或哈希处理以限制在 100 字节内)
  - `score`: u8 (AI 给出的分数，0-100)
  - `timestamp`: i64 (链上时间)
- **PDA 设计 (地址派生):**
  - Seeds: `[b"alpha", user.key().as_ref(), url_fragment.as_bytes()]`
  - 说明：确保同一个用户对同一个 URL 只能盖戳一次。

### 4.2 前端界面 (Frontend & UI)

**设计风格：** **按照 frontend-vibe-rules 写前端及 UI**

- **组件 1: The Scanner (扫描器)**
  - 居中的大输入框，带有发光边框效果。
  - Placeholder: "粘贴 Trends.fun 链接检测 Alpha..."
- **组件 2: The Gauge (仪表盘)**
  - 半圆形仪表，显示 AI 评分。
  - 颜色逻辑：<50 (红色/Rekt), 50-79 (黄色/Mid), 80+ (绿色/Alpha)。
- **组件 3: Action Buttons (操作区)**
  - 如果未连接钱包 -> 显示 "Connect Wallet"。
  - 如果已连接 + 已分析 -> 显示 "Stamp On-Chain (盖戳)"。
  - (可选) 集成 Jupiter Terminal Widget 用于一键买入。

### 4.3 AI 服务 (Backend API)

**目标：** **按照 ai-logic-rules 写 AI 服务**

- **Endpoint:** `/api/analyze`
- **Prompt 逻辑：**
  - 角色：激进的 Meme 币投资经理。
  - 输入：URL 和 (模拟的) 页面内容。
  - 输出：JSON 格式。
- **Mock 数据策略 (重要):**
  - 如果 API 调用失败或未配置 Key，必须返回以下 Mock 数据以保证演示顺畅：
  ```json
  {
    "score": 88,
    "analysis": "Elon Musk 刚关注了这个话题，且持币地址分散。典型的金狗形态。",
    "risk_level": "LOW",
    "tags": ["Celebrity", "High Volume"]
  }
  ```

## 5. 数据结构定义 (Data Schemas)

**Type: AIResponse**

```typescript
interface AnalysisResult {
  score: number; // 0-100
  analysis: string; // 简短评语 (<100 chars)
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
}
```

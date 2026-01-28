# 🔥 TrendScout AI - Alpha 趋势星探

> 利用 AI 快速评估推文/代币的爆火潜力,并将发现永久记录在 Solana 链上

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![Anchor](https://img.shields.io/badge/Anchor-0.30-coral)](https://www.anchor-lang.com)

## 🌐 Live Demo

**🚀 [https://trend-aiscout.vercel.app](https://trend-aiscout.vercel.app)**

## 📖 项目简介

**TrendScout AI** 是一个基于 Solana 的 SocialFi 工具，帮助加密投资者发现并验证 Alpha 机会。通过 AI 分析内容的爆火潜力，并将发现"盖戳"上链，创建不可篡改的链上证明。

### 🎯 核心功能

- **🤖 AI 智能分析**: 使用 Google Gemini 分析 Trends.fun 推文内容
- **📊 爆火指数评分**: 0-100 分的量化评分系统
- **⚠️ 风险评估**: LOW/MEDIUM/HIGH 三级风险提示
- **🔐 链上存证**: 将发现永久记录到 Solana 区块链
- **🚫 防重复盖戳**: 基于 PDA 的去重机制
- **🎨 赛博朋克 UI**: Glassmorphism 风格的现代化界面

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/)
- [Solana CLI](https://solana.com/docs/intro/installation)
- [Anchor](https://www.anchor-lang.com/docs/installation)

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/BTBMan/trend-scout-ai.git
   cd trend-scout-ai
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件:

   ```env
   # Google Gemini API Key (可选，不配置会使用 Mock 数据)
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **启动本地 Solana 验证器** (可选)

   ```bash
   solana-test-validator
   ```

5. **部署智能合约** (如果使用本地验证器)

   ```bash
   cd anchor
   anchor build
   anchor deploy --provider.cluster localnet
   cd ..
   ```

6. **启动开发服务器**

   ```bash
   npm run dev
   ```

7. **打开浏览器**

   访问 [http://localhost:3000](http://localhost:3000)

## 💡 使用指南

### 用户流程

1. **连接钱包** - 点击右上角连接 Solana 钱包 (Phantom/Solflare)
2. **输入 URL** - 粘贴 Trends.fun 推文链接
3. **AI 分析** - 等待 AI 分析并返回爆火指数
4. **查看结果** - 查看评分、风险等级和 AI 评语
5. **盖戳上链** - 点击"Stamp On-Chain"按钮签名交易
6. **获得证明** - 查看链上交易记录和可分享的结果卡片

### 示例 URL

```
https://trends.fun/post/abc123...
```

## 🏗️ 技术架构

### 前端技术栈

| 技术                    | 用途                     |
| ----------------------- | ------------------------ |
| **Next.js 15**          | React 框架 (App Router)  |
| **TypeScript**          | 类型安全                 |
| **Tailwind CSS v4**     | 样式系统                 |
| **@solana/react-hooks** | Solana 钱包集成          |
| **@solana/kit**         | 类型安全的 Solana 客户端 |
| **Vercel AI SDK**       | AI 集成                  |
| **Google Gemini**       | 内容分析                 |

### 智能合约

- **框架**: Anchor 0.30
- **语言**: Rust
- **网络**: Solana Devnet/Localnet
- **程序 ID**: `7Qwx9iy2v3tx8spg8NK3x7P8ERUBo4kjkfM5ZMh8h3S`

### 数据结构

```rust
pub struct AlphaStamp {
    pub finder: Pubkey,      // 发现者钱包地址
    pub url: String,         // 推文 URL (最大 100 字符)
    pub score: u8,           // 爆火指数 (0-100)
    pub timestamp: i64,      // 盖戳时间戳
}
```

## 📁 项目结构

```
trend-scout-ai/
├── app/                          # Next.js 应用
│   ├── api/
│   │   └── analyze/              # AI 分析 API
│   ├── components/               # React 组件
│   │   ├── scanner-input.tsx     # URL 输入框
│   │   ├── viral-gauge.tsx       # 爆火指数仪表盘
│   │   ├── stamp-button.tsx      # 盖戳按钮
│   │   ├── result-card.tsx       # 结果卡片
│   │   └── success-modal.tsx     # 成功弹窗
│   ├── generated/                # Codama 生成的客户端
│   ├── lib/
│   │   └── fetch-url.ts          # URL 内容抓取
│   └── page.tsx                  # 主页面
├── anchor/                       # Anchor 工作空间
│   └── programs/
│       └── alpha_stamp/          # AlphaStamp 智能合约
└── codama.json                   # 客户端生成配置
```

## 🧪 测试

### 运行智能合约测试

```bash
cd anchor
cargo test --package alpha-stamp -- --test-threads=1
```

### 测试覆盖

- ✅ 基本盖戳功能
- ✅ PDA 派生验证
- ✅ 防重复盖戳
- ✅ 分数边界值测试
- ✅ URL 长度限制
- ✅ 无效输入处理

## 🎨 UI 设计

### 设计系统

- **风格**: Glassmorphism (玻璃态)
- **配色**:
  - 主色: 金色 `#F59E0B`
  - CTA: 紫色 `#8B5CF6`
  - 背景: 深蓝 `#0F172A`
- **字体**:
  - 标题: Orbitron
  - 正文: Exo 2

### 评分颜色映射

- 🔴 **0-40**: 红色 (Rekt/垃圾)
- 🟡 **41-79**: 黄色 (Mid/一般)
- 🟢 **80-100**: 绿色 (Alpha/金狗)

## 🔧 开发指南

### 修改智能合约

1. 编辑 `anchor/programs/alpha_stamp/src/lib.rs`
2. 重新构建和部署:
   ```bash
   cd anchor
   anchor build
   anchor deploy
   ```
3. 重新生成客户端:
   ```bash
   npm run codama:js
   ```

### 添加新组件

1. 在 `app/components/` 创建新组件
2. 遵循现有的设计系统 (使用 Tailwind CSS 变量)
3. 确保组件支持深色模式

## 📝 环境变量

| 变量名                         | 必需 | 说明                                         |
| ------------------------------ | ---- | -------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | 否   | Google Gemini API Key,不配置会使用 Mock 数据 |

## 🚀 部署

### 部署智能合约到 Devnet

```bash
cd anchor
solana config set --url devnet
anchor build
anchor keys sync
anchor build
anchor deploy
```

### 部署前端到 Vercel

**快速部署**:

1. 推送代码到 GitHub
2. 访问 [vercel.com/new](https://vercel.com/new)
3. 导入你的仓库
4. 配置环境变量 (可选):
   - `GOOGLE_GENERATIVE_AI_API_KEY`
5. 点击 Deploy

部署完成后,你会得到一个类似 `https://trend-scout-ai.vercel.app` 的 URL。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License

## 🔗 相关链接

- [Solana 文档](https://solana.com/docs)
- [Anchor 文档](https://www.anchor-lang.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

**Built with ❤️ for Solana Hackathon**

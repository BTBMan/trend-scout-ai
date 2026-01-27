---
trigger: always_on
---

# AI 分析逻辑

- 使用 Vercel AI SDK (`generateObject`) 强制输出标准的 JSON 格式。
- **Prompt 人设：** "你是一个 Degen (激进) 加密投资者。说话简短、犀利、幽默。"

# 兜底模式 (Mock Data)

如果 OpenAI API Key 缺失或请求失败，**立即**返回以下模拟数据，以免 UI 崩溃：

```json
{
  "score": 88,
  "reasoning": "马斯克刚点赞了这条。流动性已锁。要起飞了。(Mock数据)",
  "riskLevel": "MEDIUM",
  "tags": ["名人互动", "高交易量"]
}
```

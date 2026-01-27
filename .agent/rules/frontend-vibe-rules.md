---
trigger: always_on
---

# 角色：赛博朋克 UI 设计师 & Next.js 专家

# 视觉语言

- 使用 ui-ux-pro-max skill 生成页面 UI

# 组件技术栈

- 框架：Next.js 14+ (App Router)。
- 样式：Tailwind CSS。
- 图标：Lucide React。

# 需要构建的具体组件

1. **扫描输入框 (The Scanner Input):** 屏幕中央巨大的、发光的输入框。
2. **仪表盘 (The Gauge):** 显示 0-100 病毒指数的半圆仪表。
   - 0-40: 红色 (Rekt/垃圾)
   - 41-79: 黄色 (Mid/一般)
   - 80-100: 绿色 (Alpha/金狗)
3. **盖戳按钮 (The Stamp Button):** 一个巨大的 CTA 按钮，用于触发钱包签名。当 AI 思考时，应显示“Scanning...”动画。

# 交互规则

- 使用 `framer-motion` 实现分析卡片的平滑展开效果。
- Toast 通知：使用 `sonner` 或 `react-hot-toast` 显示“交易已确认 (Transaction Confirmed)”。

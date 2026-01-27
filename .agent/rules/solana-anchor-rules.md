---
trigger: always_on
---

# 角色：资深 Solana Anchor 开发者

你正在编写一个极简的 Anchor 程序用于存储数据。

# 数据结构 ("邮戳" Stamp)

创建一个账户结构体 `AlphaStamp`，必须包含且仅包含以下字段：

- `finder`: Pubkey (发现者的钱包地址)
- `url`: String (限制 100 字符以节省空间)
- `score`: u8 (0-100 分)
- `timestamp`: i64 (时间戳)

# 关键技术约束

1. **PDA (程序派生地址):**
   - **务必**使用 `seeds` 来派生地址。
   - Seeds 模式：`[b"alpha", user.key().as_ref(), url_hash.as_ref()]`。
   - 自动使用 `bump`。
2. **指令 (Instruction):**
   - 只需要一个指令：`stamp_alpha`。
   - 如果账户不存在，该指令应负责 `init` (初始化) 账户。
3. **类型安全:**
   - 前端 (TypeScript): 传递数字给合约时，**务必**使用 `new BN(score)`。
   - 后端 (Rust): 使用 `msg!()` 宏打印分数以便调试。

# IDL 处理

- 生成 Rust 代码后，假设 IDL 文件位于 `target/idl/trend_scout.json`。
- TypeScript 接口必须从这个 IDL JSON 中推断类型。

# AI 代理快速入门

AI 代理可以通过 MCP (Model Context Protocol) 技能使用 x402-tron 自主支付服务和 API — **无需编写代码**。

## 可用技能

| 技能 | 描述 |
|------|------|
| **x402-payment-tron** | 实现 x402 协议的"按请求付费"模式。使代理能够签署 TIP-712 支付负载并验证链上结算。 |
| **mcp-server-tron** | MCP 服务器，让 LLM 直接访问 TRON 区块链：余额查询、转账、智能合约交互、资源估算。 |

## x402-payment-tron

此技能使您的代理能够自动处理 x402 支付流程：

- 检测 API 返回的 `402 Payment Required` 响应
- 解析支付要求（价格、代币、收款方）
- 签署 TIP-712 支付负载
- 携带支付签名重试请求
- 验证链上结算

**仓库地址：** [x402-payment-tron](https://github.com/open-aibank/x402-payment-tron)

## mcp-server-tron

此技能为代理提供区块链能力：

- 查询钱包余额
- 转移代币
- 与智能合约交互
- 估算资源成本（带宽、能量）

**仓库地址：** [mcp-server-tron](https://github.com/nicholasxuu/mcp-server-tron)

## 代理支付流程

当您的代理遇到付费 API 时，x402-payment-tron 技能会自动处理支付：

1. **发现**：代理向受保护端点发起请求
2. **402 响应**：服务器返回 `402 Payment Required` 及支付详情
3. **支付决策**：代理评估价格是否可接受
4. **支付签名**：技能自动签署 TIP-712 支付负载
5. **携带支付重试**：技能使用 `PAYMENT-SIGNATURE` 头重试请求
6. **访问**：服务器验证支付并返回受保护内容

## 安全注意事项

部署具有支付能力的代理时：

- **限制钱包余额**：只为代理钱包充入所需金额
- **先使用测试网**：在主网之前始终在 TRON Nile 上测试
- **监控交易**：在 [TronScan](https://tronscan.org) 上跟踪代理支出
- **保护私钥**：安全存储凭证

---

**下一步：**

- 设置您自己的[付费 API](/getting-started/quickstart-for-sellers) 供代理使用
- 了解 [HTTP 402](/core-concepts/http-402) 支付协议
- 探索[网络支持](/core-concepts/network-and-token-support)了解代币详情

**参考资料：**

- [x402-payment-tron](https://github.com/open-aibank/x402-payment-tron)
- [mcp-server-tron](https://github.com/nicholasxuu/mcp-server-tron)
- [x402-tron 演示](https://github.com/open-aibank/x402-tron-demo)

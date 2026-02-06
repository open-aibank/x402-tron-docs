# AI 代理快速入门

AI 代理可以使用 x402-tron 自主支付服务和 API。本指南展示如何使用 [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension) 技能为代理启用支付能力 — **无需编写代码**。

## 什么是 OpenClaw Extension？

OpenClaw Extension 为 TRON 上的 AI 代理提供一套基于 MCP 的技能。该扩展使代理能够：

- **赚取**：通过 x402 协议接受任务和服务的支付
- **支出**：自主支付资源（计算、数据、API）
- **交易**：无缝与 DeFi 和智能合约交互

## 核心技能

| 技能 | 描述 |
|------|------|
| **x402-payment-tron** | 实现 x402 协议的"按请求付费"模式。使代理能够签署 TIP-712 支付负载并验证链上结算。 |
| **mcp-server-tron** | MCP 服务器，让 LLM 直接访问 TRON 区块链：余额查询、转账、智能合约交互、资源估算。 |

## 前提条件

在开始之前，请确保您具备：

- [OpenClaw](https://github.com/open-aibank/openclaw)（您的个人开源 AI 助手）
- Node.js v18+
- Python 3
- 拥有 USDT (TRC-20) 的 TRON 钱包用于支付
- TRON API Key（来自 [TronGrid](https://www.trongrid.io/)）

## 1. 安装 OpenClaw Extension

**方式 A：从源码安装**

```bash
git clone https://github.com/open-aibank/openclaw-extension.git
cd openclaw-extension
./install.sh
```

**方式 B：在线安装**

```bash
curl -fsSL https://raw.githubusercontent.com/open-aibank/openclaw-extension/refs/heads/main/install.sh | bash
```

交互式 CLI 将引导您完成：

1. 选择所需技能（`x402-payment-tron`、`mcp-server-tron`）
2. 配置 MCP 服务器
3. 安全设置您的凭证（TRON 私钥、API Key）

## 2. 工作原理

安装后，您的代理通过 MCP 技能自动获得支付能力：

**x402-payment-tron 技能** 使您的代理能够：
- 检测 API 返回的 `402 Payment Required` 响应
- 解析支付要求（价格、代币、收款方）
- 签署 TIP-712 支付负载
- 携带支付签名重试请求
- 验证链上结算

**mcp-server-tron 技能** 提供区块链能力：
- 查询钱包余额
- 转移代币
- 与智能合约交互
- 估算资源成本（带宽、能量）

## 3. 代理支付流程

当您的代理遇到付费 API 时，x402-payment-tron 技能会自动处理支付：

1. **发现**：代理向受保护端点发起请求
2. **402 响应**：服务器返回 `402 Payment Required` 及支付详情
3. **支付决策**：代理评估价格是否可接受
4. **支付签名**：技能自动签署 TIP-712 支付负载
5. **携带支付重试**：技能使用 `PAYMENT-SIGNATURE` 头重试请求
6. **访问**：服务器验证支付并返回受保护内容

**无需编写代码** — 技能处理整个支付流程。

## 4. 安全注意事项

部署具有支付能力的代理时：

- **限制钱包余额**：只为代理钱包充入所需金额
- **先使用测试网**：在主网之前始终在 TRON Nile 上测试
- **监控交易**：在 [TronScan](https://tronscan.org) 上跟踪代理支出
- **保护私钥**：安装程序会安全存储凭证

## 总结

- 安装 [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension) 以启用代理支付能力
- 在安装过程中选择 `x402-payment-tron` 和 `mcp-server-tron` 技能
- 您的代理现在可以自动支付 x402 保护的 API
- 无需编写代码 — 技能通过 MCP 处理支付流程

---

**下一步：**

- 设置您自己的[付费 API](/getting-started/quickstart-for-sellers) 供代理使用
- 了解 [HTTP 402](/core-concepts/http-402) 支付协议
- 探索[网络支持](/core-concepts/network-and-token-support)了解代币详情

**参考资料：**

- [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension)
- [x402-tron 演示](https://github.com/open-aibank/x402-tron-demo)
- [TronGrid API](https://www.trongrid.io/)

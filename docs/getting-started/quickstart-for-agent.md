---
title: 'Quickstart for Agent'
description: 'This guide walks you through how to enable AI agents to make autonomous payments using x402-tron on TRON blockchain via OpenClaw Extension skills.'
---

AI agents can use x402-tron to autonomously pay for services and APIs. This guide shows how to enable agent payment capabilities using the [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension) skills — **no coding required**.

### What is OpenClaw Extension?

OpenClaw Extension provides a suite of MCP-based skills for AI agents on TRON. The extension enables agents to:

- **Earn**: Accept payments for tasks and services via x402 protocol
- **Spend**: Pay for resources (computation, data, APIs) autonomously
- **Transact**: Interact with DeFi and smart contracts seamlessly

### Core Skills

| Skill | Description |
|-------|-------------|
| **x402-payment-tron** | Implements x402 protocol for "Pay-per-Request" models. Enables agents to sign TIP-712 payment payloads and verify on-chain settlement. |
| **mcp-server-tron** | MCP server giving LLMs direct access to TRON blockchain: balance checks, transfers, smart contract interactions, resource estimation. |

### Prerequisites

Before you begin, ensure you have:

- [OpenClaw](https://github.com/open-aibank/openclaw) (Your personal, open-source AI assistant)
- Node.js v18+
- Python 3
- A TRON wallet with USDT (TRC-20) for payments
- TRON API Key (from [TronGrid](https://www.trongrid.io/))

### 1. Install OpenClaw Extension

**Option A: Install from source**

```bash
git clone https://github.com/open-aibank/openclaw-extension.git
cd openclaw-extension
./install.sh
```

**Option B: Online install**

```bash
curl -fsSL https://raw.githubusercontent.com/open-aibank/openclaw-extension/refs/heads/main/install.sh | bash
```

The interactive CLI will guide you through:

1. Selecting desired skills (`x402-payment-tron`, `mcp-server-tron`)
2. Configuring the MCP server
3. Securely setting up your credentials (TRON private key, API key)

### 2. How It Works

Once installed, your agent automatically gains payment capabilities through MCP skills:

**x402-payment-tron skill** enables your agent to:
- Detect `402 Payment Required` responses from APIs
- Parse payment requirements (price, token, recipient)
- Sign TIP-712 payment payloads
- Retry requests with payment signature
- Verify on-chain settlement

**mcp-server-tron skill** provides blockchain capabilities:
- Query wallet balances
- Transfer tokens
- Interact with smart contracts
- Estimate resource costs (bandwidth, energy)

### 3. Agent Payment Flow

When your agent encounters a paid API, the x402-payment-tron skill handles the payment automatically:

1. **Discovery**: Agent makes request to protected endpoint
2. **402 Response**: Server returns `402 Payment Required` with payment details
3. **Payment Decision**: Agent evaluates if the price is acceptable
4. **Payment Signing**: Skill signs TIP-712 payment payload automatically
5. **Retry with Payment**: Skill retries request with `PAYMENT-SIGNATURE` header
6. **Access**: Server verifies payment and returns the protected content

**No code needed** — the skill handles the entire payment flow.

### 4. Security Considerations

When deploying agents with payment capabilities:

- **Limit wallet balance**: Only fund the agent wallet with what it needs
- **Use testnet first**: Always test on TRON Nile before mainnet
- **Monitor transactions**: Track agent spending on [TronScan](https://tronscan.org)
- **Secure private keys**: The installer stores credentials securely

### Summary

- Install [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension) to enable agent payment capabilities
- Select `x402-payment-tron` and `mcp-server-tron` skills during installation
- Your agent can now automatically pay for x402-protected APIs
- No coding required — skills handle payment flow via MCP

---

**Next Steps:**

- Set up your own [paid API](quickstart-for-sellers) for agents to consume
- Learn about [HTTP 402](../core-concepts/http-402) payment protocol
- Explore [Network Support](../core-concepts/network-and-token-support) for token details

**References:**

- [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension)
- [x402-tron Demo](https://github.com/open-aibank/x402-tron-demo)
- [TronGrid API](https://www.trongrid.io/)

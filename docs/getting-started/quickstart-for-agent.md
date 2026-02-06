---
title: 'Quickstart for Agent'
description: 'This guide introduces MCP skills that enable AI agents to make autonomous payments using x402-tron on TRON blockchain.'
---

AI agents can use x402-tron to autonomously pay for services and APIs via MCP (Model Context Protocol) skills — **no coding required**.

### Available Skills

| Skill | Description |
|-------|-------------|
| **x402-payment-tron** | Implements x402 protocol for "Pay-per-Request" models. Enables agents to sign TIP-712 payment payloads and verify on-chain settlement. |
| **mcp-server-tron** | MCP server giving LLMs direct access to TRON blockchain: balance checks, transfers, smart contract interactions, resource estimation. |

### x402-payment-tron

This skill enables your agent to automatically handle x402 payment flows:

- Detect `402 Payment Required` responses from APIs
- Parse payment requirements (price, token, recipient)
- Sign TIP-712 payment payloads
- Retry requests with payment signature
- Verify on-chain settlement

**Repository:** [x402-payment-tron](https://github.com/open-aibank/x402-payment-tron)

### mcp-server-tron

This skill provides blockchain capabilities for agents:

- Query wallet balances
- Transfer tokens
- Interact with smart contracts
- Estimate resource costs (bandwidth, energy)

**Repository:** [mcp-server-tron](https://github.com/nicholasxuu/mcp-server-tron)

### Agent Payment Flow

When your agent encounters a paid API, the x402-payment-tron skill handles the payment automatically:

1. **Discovery**: Agent makes request to protected endpoint
2. **402 Response**: Server returns `402 Payment Required` with payment details
3. **Payment Decision**: Agent evaluates if the price is acceptable
4. **Payment Signing**: Skill signs TIP-712 payment payload automatically
5. **Retry with Payment**: Skill retries request with `PAYMENT-SIGNATURE` header
6. **Access**: Server verifies payment and returns the protected content

### Security Considerations

When deploying agents with payment capabilities:

- **Limit wallet balance**: Only fund the agent wallet with what it needs
- **Use testnet first**: Always test on TRON Nile before mainnet
- **Monitor transactions**: Track agent spending on [TronScan](https://tronscan.org)
- **Secure private keys**: Store credentials securely

---

**Next Steps:**

- Set up your own [paid API](/getting-started/quickstart-for-sellers) for agents to consume
- Learn about [HTTP 402](/core-concepts/http-402) payment protocol
- Explore [Network Support](/core-concepts/network-and-token-support) for token details

**References:**

- [x402-payment-tron](https://github.com/open-aibank/x402-payment-tron)
- [mcp-server-tron](https://github.com/nicholasxuu/mcp-server-tron)
- [x402-tron Demo](https://github.com/open-aibank/x402-tron-demo)

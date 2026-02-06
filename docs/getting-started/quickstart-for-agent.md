---
title: 'Quickstart for Agent'
description: 'Enable AI agents to make autonomous payments on TRON blockchain using the tron_x402_payment skill.'
---

x402-tron is designed for the Agentic Web. AI agents can autonomously negotiate and pay for resources using the `tron_x402_payment` skill.

This skill enables agents to:

- Detect `402 Payment Required` responses
- Sign TIP-712 payment authorizations automatically
- Manage wallet balances and handle the payment flow

---

## Configuration

Configure your agent's wallet credentials via environment variables:

```bash
export TRON_PRIVATE_KEY="your_private_key_here"
export TRON_GRID_API_KEY="your_trongrid_api_key_here"  # Recommended to avoid RPC rate limits
```

## Installation

Add the [tron_x402_payment](https://github.com/open-aibank/openclaw-extension/tree/main/skills/tron_x402_payment) skill to your agentic tools:

| Tool | Installation |
|------|--------------|
| **OpenClaw** | `npx clawhub install tron-x402-payment` |
| **opencode** | Copy the skill to `.opencode/skill/` directory |

## Try It Out

Instruct your agent to access `https://x402-tron-demo.aibank.io/protected-nile`. The agent will automatically detect the payment requirement, sign the authorization, and retrieve the protected resource.

## Security Best Practices

- **Limit wallet balance** — Only fund the agent wallet with what it needs for operations
- **Test on Nile first** — Validate your integration on testnet before mainnet deployment
- **Monitor transactions** — Track agent spending on [TronScan](https://tronscan.org)
- **Secure credentials** — Store private keys using secure environment management

---

## Next Steps

- [Set up a paid API](/getting-started/quickstart-for-sellers) for agents to consume
- [Learn about HTTP 402](/core-concepts/http-402) payment protocol

## References

- [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension)
- [tron-x402-payment on ClawHub](https://clawhub.ai/wzc1206/tron-x402-payment)
- [x402-tron Demo](https://github.com/open-aibank/x402-tron-demo)

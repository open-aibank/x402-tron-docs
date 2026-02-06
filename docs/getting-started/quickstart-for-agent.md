---
title: 'Quickstart for Agent'
description: 'This guide introduces how AI agents can make autonomous payments using x402-tron on TRON blockchain via OpenClaw skills.'
---

AI agents can use x402-tron to autonomously pay for services and APIs via [OpenClaw](https://github.com/open-aibank/openclaw-extension) skills.

## tron-x402-payment Skill

**Get the skill on ClawHub:**

| Skill | Description |
|-------|-------------|
| [tron-x402-payment](https://clawhub.ai/wzc1206/tron-x402-payment) | Production skill for x402 payments on TRON |
| [tron-x402-payment-demo](https://clawhub.ai/wzc1206/tron-x402-payment-demo) | Demo skill for testing on TRON Nile testnet |

## Security Considerations

When deploying agents with payment capabilities:

- **Limit wallet balance**: Only fund the agent wallet with what it needs
- **Use testnet first**: Always test on TRON Nile before mainnet
- **Monitor transactions**: Track agent spending on [TronScan](https://tronscan.org)
- **Secure private keys**: Store credentials securely

---

## Next Steps

- Set up your own [paid API](/getting-started/quickstart-for-sellers) for agents to consume
- Learn about [HTTP 402](/core-concepts/http-402) payment protocol

## References

- [OpenClaw Extension](https://github.com/open-aibank/openclaw-extension)
- [tron-x402-payment on ClawHub](https://clawhub.ai/wzc1206/tron-x402-payment)
- [x402-tron Demo](https://github.com/open-aibank/x402-tron-demo)

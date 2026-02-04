---
title: "Networks & Token Support"
description: "This page explains which blockchain networks and tokens are supported by x402-tron, and how to extend support to additional networks."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON Network Identifiers

x402-tron uses a simple network identifier format: `tron:<network_name>` where network_name is one of `mainnet`, `shasta`, or `nile`.

### Network Identifier Reference

| Network Name | x402-tron ID | Description |
|--------------|--------------|-------------|
| TRON Mainnet | `tron:mainnet` | TRON mainnet |
| TRON Shasta | `tron:shasta` | TRON Shasta testnet |
| TRON Nile | `tron:nile` | TRON Nile testnet |

## Overview

x402-tron is specifically designed for the TRON blockchain, with payment verification and settlement implemented natively for TRON networks. The protocol leverages TRON's TIP-712 for secure message signing.

### Supported Networks

| Network | Status | Notes |
|---------|--------|-------|
| TRON Nile | **Testnet** | Recommended for development and testing |
| TRON Shasta | **Testnet** | Alternative testnet for testing |
| TRON Mainnet | **Mainnet** | Production network |

### Token Support

x402-tron supports TRC-20 tokens on TRON networks. The primary supported token is USDT.

#### Supported Tokens

| Token | Network | Contract Address |
|-------|---------|------------------|
| USDT | tron:nile | TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf |
| USDT | tron:mainnet | TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t |

**Note**: Custom TRC-20 tokens can be supported by registering them in the TokenRegistry.

#### TIP-712 for Secure Signing

x402-tron uses TIP-712 (TRON's implementation of EIP-712) for structured data signing. This enables:

* **Secure authorization**: Buyers sign transfer authorizations off-chain
* **Trust-minimizing**: Facilitators cannot move funds outside client intentions
* **Verifiable**: All signatures can be verified on-chain

### Token Configuration

When configuring payment requirements, you specify:

1. **Network**: The TRON network identifier (e.g., `tron:nile`)
2. **Asset**: The TRC-20 token contract address
3. **Amount**: The payment amount in the token's smallest unit (e.g., 1 USDT = 1000000 with 6 decimals)

#### Example Configuration

<Tabs>
  <TabItem value="python" label="Python (FastAPI)">

```python
from x402.server import X402Server
from x402.fastapi import x402_protected
from x402.config import NetworkConfig

server = X402Server()

@app.get("/protected")
@x402_protected(
    server=server,
    price="1 USDT",  # 1 USDT = 1000000 (6 decimals)
    network=NetworkConfig.TRON_NILE,
    pay_to="TDhj8uX7SVJwvhCUrMaiQHqPgrB6wRb3eG",
)
async def protected_endpoint():
    return {"data": "secret content"}
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { X402Client, UptoTronClientMechanism, TronClientSigner } from '@open-aibank/x402-tron';
import { TronWeb } from 'tronweb';

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: 'your-private-key',
});

const signer = TronClientSigner.withPrivateKey(
  tronWeb,
  'your-private-key', 
  'nile'
);

const client = new X402Client().register(
  'tron:*',
  new UptoTronClientMechanism(signer)
);
```

  </TabItem>
</Tabs>

### Payment Schemes

#### Upto Scheme

The `upto` scheme allows payments up to a specified amount, useful for:
- Pay-per-use APIs (LLM token generation, data processing)
- Metered resources (compute time, bandwidth)
- Dynamic pricing based on actual usage

The upto scheme in x402-tron works by:
1. Client signs an authorization allowing up to a maximum amount
2. Server performs work and determines actual cost
3. Facilitator settles the actual amount (up to the authorized maximum)

### Running Your Own Facilitator

You can run your own facilitator to verify and settle payments on TRON. The facilitator:

1. Verifies payment payloads (TIP-712 signatures)
2. Submits transactions to TRON blockchain
3. Monitors transaction confirmation

**Prerequisites**

1. Access to a TRON node (e.g., TronGrid)
2. A wallet with TRX for gas/energy fees
3. The x402-tron facilitator code

See the [Facilitator](facilitator) documentation for more details.

### Quick Reference

| Component | TRON Support |
|-----------|-------------|
| Networks | `tron:mainnet`, `tron:shasta`, `tron:nile` |
| Tokens | TRC-20 tokens (USDT supported by default) |
| Signing | TIP-712 structured data signing |
| Schemes | `upto` (exact scheme in development) |

### Adding Custom Tokens

To add support for custom TRC-20 tokens:

<Tabs>
  <TabItem value="python" label="Python">

```python
from x402.tokens import TokenRegistry, TokenInfo

# Register a custom token
TokenRegistry.register_token(
    network="tron:nile",
    symbol="MYTOKEN",
    info=TokenInfo(
        address="TYourTokenContractAddress",
        decimals=18,
    )
)
```

  </TabItem>
</Tabs>

### Summary

x402-tron's network support is designed specifically for TRON blockchain with native TRC-20 token support and TIP-712 signing. Key takeaways:

* TRON Nile testnet is recommended for development
* USDT is the primary supported token with pre-configured addresses
* TIP-712 provides secure, trust-minimizing payment authorization
* Custom TRC-20 tokens can be added via TokenRegistry

Next, explore:

* [Quickstart for Sellers](../getting-started/quickstart-for-sellers) — Start accepting payments on TRON
* [Core Concepts](http-402) — Learn how x402-tron works under the hood
* [Facilitator](facilitator) — Understand the role of facilitators

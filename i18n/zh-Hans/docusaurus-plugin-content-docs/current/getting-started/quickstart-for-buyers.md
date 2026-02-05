---
title: "Quickstart for Buyers"
description: "This guide walks you through how to use **x402-tron** to interact with services that require payment on TRON blockchain. By the end of this guide, you will be able to programmatically discover payment requirements, complete a payment, and access a paid resource."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Prerequisites

Before you begin, ensure you have:

* A TRON wallet with USDT (TRC-20)
* Python 3.10+ and pip, or Node.js 18+ and npm
* A service that requires payment via x402-tron

**Note:**
We have pre-configured [examples available in the demo repo](https://github.com/open-aibank/x402-tron-demo), including examples for Python (httpx) and TypeScript.

### 1. Install Dependencies

<Tabs>
  <TabItem value="python" label="Python">
Install the x402-tron Python package:

```bash
pip install x402-tron
```
  </TabItem>
  <TabItem value="typescript" label="TypeScript">
Install the x402-tron TypeScript package:

```bash
npm install @open-aibank/x402-tron tronweb
```
  </TabItem>
</Tabs>

### 2. Create a Wallet Signer

<Tabs>
  <TabItem value="python" label="Python">

```python
import os
from x402.signers.client import TronClientSigner

# Create a signer from private key (use environment variable)
signer = TronClientSigner.from_private_key(
    os.getenv("TRON_PRIVATE_KEY"),
    network="nile"  # or "mainnet", "shasta"
)

print(f"Client Address: {signer.get_address()}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { TronWeb } from 'tronweb';
import { TronClientSigner } from '@open-aibank/x402-tron';

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: process.env.TRON_PRIVATE_KEY,
});

const signer = TronClientSigner.withPrivateKey(
  tronWeb,
  process.env.TRON_PRIVATE_KEY!,
  'nile'  // or 'mainnet', 'shasta'
);

console.log(`Client Address: ${signer.getAddress()}`);
```

  </TabItem>
</Tabs>

### 3. Make Paid Requests Automatically

<Tabs>
  <TabItem value="python" label="Python (httpx)">
**x402-tron** provides async HTTP client support with automatic 402 payment handling.

[Full example here](https://github.com/open-aibank/x402-tron-demo/tree/main/python/client)

```python
import asyncio
import os
import httpx

from x402.clients import X402Client, X402HttpClient
from x402.mechanisms.client import UptoTronClientMechanism
from x402.signers.client import TronClientSigner


async def main():
    # Configure signer
    signer = TronClientSigner.from_private_key(
        os.getenv("TRON_PRIVATE_KEY"),
        network="nile"
    )

    # Create x402 client and register TRON mechanism
    x402_client = X402Client().register(
        "tron:nile",
        UptoTronClientMechanism(signer)
    )

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # Make request - payment is handled automatically
        response = await client.get("http://localhost:8000/protected")

        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")

        # Check payment response
        payment_response = response.headers.get('payment-response')
        if payment_response:
            from x402.encoding import decode_payment_payload
            from x402.types import SettleResponse
            settle_response = decode_payment_payload(
                payment_response, SettleResponse
            )
            print(f"Transaction: {settle_response.transaction}")


asyncio.run(main())
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">
[Full example here](https://github.com/open-aibank/x402-tron-demo/tree/main/typescript/client)

```typescript
import { TronWeb } from 'tronweb';
import {
  X402Client,
  X402FetchClient,
  UptoTronClientMechanism,
  TronClientSigner,
} from '@open-aibank/x402-tron';

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!;

async function main(): Promise<void> {
  // Configure TronWeb
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: TRON_PRIVATE_KEY,
  });

  // Create signer
  const signer = TronClientSigner.withPrivateKey(
    tronWeb,
    TRON_PRIVATE_KEY,
    'nile'
  );

  // Create x402 client and register TRON mechanism
  const x402Client = new X402Client().register(
    'tron:*',
    new UptoTronClientMechanism(signer)
  );

  const client = new X402FetchClient(x402Client);

  // Make request - payment is handled automatically
  const response = await client.get('http://localhost:8000/protected');

  console.log(`Status: ${response.status}`);

  // Parse payment response
  const paymentResponse = response.headers.get('payment-response');
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8');
    const settleResponse = JSON.parse(jsonString);
    console.log(`Transaction: ${settleResponse.transaction}`);
  }

  // Handle response
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const body = await response.json();
    console.log('Response:', body);
  }
}

main().catch(console.error);
```

  </TabItem>
</Tabs>

### 4. Understanding the Payment Flow

When you make a request to a protected endpoint:

1. **Initial Request**: Client sends GET/POST to the protected endpoint
2. **402 Response**: Server returns `402 Payment Required` with payment details
3. **Payment Creation**: Client SDK reads payment requirements and creates a TIP-712 signed payload
4. **Retry with Payment**: Client retries request with `PAYMENT-SIGNATURE` header
5. **Verification & Settlement**: Server verifies payment via facilitator and settles on TRON
6. **Response**: Server returns the protected content with `PAYMENT-RESPONSE` header

### 5. Token Allowance Management

For the `upto` scheme, clients need to approve the facilitator to spend tokens on their behalf. The x402-tron client SDK handles this automatically, but you can also manage allowances manually:

<Tabs>
  <TabItem value="python" label="Python">

```python
# Check current allowance
allowance = await signer.check_allowance(
    token_address="TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",  # USDT on Nile
    required_amount=1000000,  # 1 USDT
    network="tron:nile"
)
print(f"Current allowance: {allowance}")

# Approve if needed (handled automatically by SDK)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Check current allowance
const allowance = await signer.checkAllowance(
  'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',  // USDT on Nile
  BigInt(1000000),  // 1 USDT
  'tron:nile'
);
console.log(`Current allowance: ${allowance.toString()}`);
```

  </TabItem>
</Tabs>

### 6. Error Handling

Clients will throw errors if:

* No mechanism is registered for the required network
* The wallet has insufficient token balance
* The allowance approval fails
* There is an error creating the payment signature

Common error handling:

```python
try:
    response = await client.get("http://localhost:8000/protected")
except Exception as error:
    if "insufficient" in str(error).lower():
        print("Insufficient token balance")
    elif "allowance" in str(error).lower():
        print("Token approval failed")
    else:
        print(f"Request failed: {error}")
```

### Summary

* Install x402-tron package and tronweb
* Create a wallet signer from your TRON private key
* Create an `X402Client` and register the TRON payment mechanism
* Use the provided HTTP client wrapper to make paid API requests
* Payment flows including token approval are handled automatically

---

**Next Steps:**

* Explore [Core Concepts](../core-concepts/http-402) to understand the protocol
* Check out [Network Support](../core-concepts/network-and-token-support) for token details

**References:**

* [x402-tron on npm](https://www.npmjs.com/package/@open-aibank/x402-tron)
* [x402-tron on PyPI](https://pypi.org/project/x402-tron/)
* [Example code](https://github.com/open-aibank/x402-tron-demo)

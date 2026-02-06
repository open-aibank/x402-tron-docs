---
title: 'Quickstart for Sellers'
description: 'This guide walks you through integrating with **x402-tron** to enable payments for your API or service on TRON blockchain. By the end, your API will be able to charge buyers and AI agents for access.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Note:** This quickstart begins with testnet configuration (TRON Nile) for safe testing. When you're ready for production, see [Running on Mainnet](#running-on-mainnet) for the simple changes needed to accept real payments on TRON mainnet.

### Prerequisites

Before you begin, ensure you have:

- A TRON wallet to receive funds (any TRON-compatible wallet)
- Python 3.10+ and pip installed
- An existing API or server (FastAPI recommended)

**Note:**
We have pre-configured examples: [server example](https://github.com/open-aibank/x402-tron-demo/tree/main/server) and [facilitator example](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator).

### 1. Install Dependencies

The x402-tron Python package is not yet published to PyPI. Install from GitHub source:

```bash
# Clone the repository
git clone https://github.com/open-aibank/x402-tron.git
cd x402-tron/python/x402

# Install with FastAPI support
pip install -e ".[fastapi]"
```

Or install directly from a release tag:

```bash
pip install "git+https://github.com/open-aibank/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"
```

### 2. Add Payment Middleware

Integrate the payment middleware into your application. You will need to provide:

- The Facilitator URL. For testing, run your own local facilitator (official hosted facilitator coming soon).
- The routes you want to protect.
- Your TRON receiving wallet address.

<Tabs>
  <TabItem value="python" label="Python (FastAPI)">
Full example in the [demo repo](https://github.com/open-aibank/x402-tron-demo/tree/main/server).

```python
from fastapi import FastAPI
from x402_tron.server import X402Server
from x402_tron.fastapi import x402_protected
from x402_tron.facilitator import FacilitatorClient

app = FastAPI()

# Your TRON receiving wallet address
PAY_TO_ADDRESS = "<YOUR_TRON_ADDRESS>"

# Facilitator URL (run locally or use hosted)
FACILITATOR_URL = "http://localhost:8001"

# Initialize x402 server (TRON mechanisms auto-registered)
server = X402Server()
server.add_facilitator(FacilitatorClient(base_url=FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    price="0.0001 USDT",
    network="tron:nile",
    pay_to=PAY_TO_ADDRESS,
)
async def protected_endpoint():
    return {"data": "secret content"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

  </TabItem>
</Tabs>

**Route Configuration:**

When configuring protected routes, you specify:

- **price**: Payment amount (e.g., "0.0001 USDT", or raw amount like "100")
- **network**: TRON network identifier (e.g., `tron:nile`, `tron:mainnet`)
- **pay_to**: Your TRON wallet address to receive payments

When a request is made to these routes without payment, your server will respond with the HTTP 402 Payment Required code and payment instructions.

### 3. Set up a Facilitator

x402-tron requires a facilitator to verify and settle payments. You have two options:

1.  **Run Your Own Facilitator:** Deploy your own instance using the demo code.
2.  **Use Official Facilitator:** _Coming Soon_ - An official hosted service is in development.

To run your own facilitator:

```bash
# Clone the demo repository first
git clone https://github.com/open-aibank/x402-tron-demo.git
cd x402-tron-demo/facilitator

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (copy .env.example to .env and set your keys)
cp .env.example .env

python main.py
```

This starts a facilitator on `http://localhost:8001` with endpoints:

- `GET /supported` - Supported capabilities
- `POST /verify` - Verify payment payload
- `POST /settle` - Settle payment on-chain
- `POST /fee/quote` - Get fee quote

### 4. Test Your Integration

To verify:

1. Make a request to your endpoint (e.g., `curl http://localhost:8000/protected`).
2. The server responds with a 402 Payment Required, including payment instructions in the `PAYMENT-REQUIRED` header.
3. Complete the payment using a compatible client. This typically involves signing a TIP-712 payment payload, which is handled by the client SDK detailed in the [Quickstart for Agent](/getting-started/quickstart-for-agent).
4. Retry the request with the `PAYMENT-SIGNATURE` header containing the signed payment payload.
5. The server verifies the payment via the facilitator and, if valid, returns your actual API response.

### 5. Error Handling

- If you run into trouble, check out the [server example](https://github.com/open-aibank/x402-tron-demo/tree/main/server) and [facilitator example](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator) for more context.
- Ensure the facilitator is running and accessible
- Check that your TRON wallet address is valid

---

## Running on Mainnet

Once you've tested your integration on testnet (Nile), you're ready to accept real payments on TRON mainnet.

### 1. Update Network Configuration

Change from testnet to mainnet:

<Tabs>
  <TabItem value="python" label="Python">

```python
from x402.config import NetworkConfig

# Testnet → Mainnet
network=NetworkConfig.TRON_MAINNET  # was TRON_NILE
```

  </TabItem>
</Tabs>

### 2. Update Your Facilitator

If running your own facilitator on mainnet:

1. **Apply for a TronGrid API Key**: Register at [TronGrid](https://www.trongrid.io/) and create an API key. This is required for reliable mainnet RPC access.
2. Update environment variables to use mainnet credentials (including `TRON_GRID_API_KEY`)
3. Ensure the facilitator wallet has TRX for energy/bandwidth fees
4. Update the facilitator network configuration to `mainnet`

### 3. Update Your Wallet

Make sure your receiving wallet address is a real mainnet address where you want to receive USDT payments.

### 4. Test with Real Payments

Before going live:

1. Test with small amounts first
2. Verify payments are arriving in your wallet
3. Monitor the facilitator for any issues

**Warning:** Mainnet transactions involve real money. Always test thoroughly on testnet first and start with small amounts on mainnet.

---

## Network Identifiers

x402-tron uses simple network identifiers:

| Network             | Identifier     |
| ------------------- | -------------- |
| TRON Mainnet        | `tron:mainnet` |
| TRON Nile Testnet   | `tron:nile`    |
| TRON Shasta Testnet | `tron:shasta`  |

See [Network Support](/core-concepts/network-and-token-support) for the full list.

---

### Next Steps

- Check out the [demo examples](https://github.com/open-aibank/x402-tron-demo/tree/main/server) for more complex payment flows
- Explore [Core Concepts](/core-concepts/http-402) to understand how x402-tron works
- Get started as a [human buyer](/getting-started/quickstart-for-agent) or set up an [AI agent](/getting-started/quickstart-for-agent)

### Summary

This quickstart covered:

- Installing the x402-tron SDK
- Adding payment protection to your API endpoints
- Running a facilitator for payment verification and settlement
- Testing your integration on testnet
- Deploying to TRON mainnet

Your API is now ready to accept TRON-based payments through x402-tron.

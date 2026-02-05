---
title: "Facilitator"
description: "This page explains the role of the **facilitator** in the x402-tron protocol."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The facilitator is an optional but recommended service that simplifies the process of verifying and settling payments between clients (buyers) and servers (sellers) on TRON blockchain.

### What is a Facilitator?

The facilitator is a service that:

* Verifies payment payloads (TIP-712 signatures) submitted by clients.
* Settles payments on the TRON blockchain on behalf of servers.
* Manages token transfers using the `transferFrom` mechanism.

By using a facilitator, servers do not need to maintain direct TRON blockchain connectivity or implement payment verification logic themselves. This reduces operational complexity and ensures accurate, real-time validation of transactions.

### Facilitator Responsibilities

* **Verify payments:** Confirm that the client's TIP-712 signed payment payload meets the server's declared payment requirements.
* **Settle payments:** Submit validated payments to the TRON blockchain and monitor for confirmation.
* **Fee management:** Optionally charge a fee for facilitating payments.
* **Provide responses:** Return verification and settlement results to the server, allowing the server to decide whether to fulfill the client's request.

The facilitator does not hold funds or act as a custodian - it performs verification and execution of onchain transactions based on signed payloads provided by clients.

### Why Use a Facilitator?

Using a facilitator provides:

* **Reduced operational complexity:** Servers do not need to interact directly with TRON nodes.
* **Protocol consistency:** Standardized verification and settlement flows across services.
* **Faster integration:** Services can start accepting payments with minimal TRON-specific development.
* **Energy/Bandwidth management:** Facilitator handles TRX costs for transaction execution.

While it is possible to implement verification and settlement locally, using a facilitator accelerates adoption and ensures correct protocol behavior.

### Running Your Own Facilitator

x402-tron includes a ready-to-use facilitator implementation in the [demo repository](https://github.com/open-aibank/x402-tron-demo):

```bash
git clone https://github.com/open-aibank/x402-tron-demo.git
cd x402-tron-demo/python/facilitator

# Configure environment variables (copy .env.example to .env and set your keys)
cp .env.example .env

python main.py
```

The facilitator requires:

* **TRON_PRIVATE_KEY**: Private key for the facilitator wallet
* **TRX balance**: For energy and bandwidth costs

#### Facilitator Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/supported` | GET | Supported capabilities |
| `/fee/quote` | POST | Get fee quote for a payment |
| `/verify` | POST | Verify a payment payload |
| `/settle` | POST | Settle payment on-chain |

### Interaction Flow

1. `Client` makes an HTTP request to a `resource server`
2. `Resource server` responds with a `402 Payment Required` status and payment requirements.
3. `Client` creates a TIP-712 signed `Payment Payload` based on the requirements.
4. `Client` sends the HTTP request with the `PAYMENT-SIGNATURE` header to the `resource server`.
5. `Resource server` verifies the `Payment Payload` by POSTing to the `/verify` endpoint of the `facilitator server`.
6. `Facilitator server` verifies the TIP-712 signature and returns a `Verification Response`.
7. If valid, the resource server performs the work to fulfill the request.
8. `Resource server` settles the payment by POSTing to the `/settle` endpoint of the `facilitator server`.
9. `Facilitator server` executes `transferFrom` on the TRON blockchain.
10. `Facilitator server` waits for the transaction to be confirmed.
11. `Facilitator server` returns a `Settlement Response` with the transaction hash.
12. `Resource server` returns a `200 OK` response with the content and `PAYMENT-RESPONSE` header.

### Facilitator Configuration

<Tabs>
  <TabItem value="python" label="Python">

```python
from x402.mechanisms.facilitator import UptoTronFacilitatorMechanism
from x402.signers.facilitator import TronFacilitatorSigner

# Initialize facilitator signer
facilitator_signer = TronFacilitatorSigner.from_private_key(
    "your-private-key",
    network="nile",  # or "mainnet"
)

# Initialize facilitator mechanism
facilitator_mechanism = UptoTronFacilitatorMechanism(
    facilitator_signer,
    fee_to=facilitator_signer.get_address(),
    base_fee=1_000_000,  # 1 USDT fee
)
```

  </TabItem>
</Tabs>

### Fee Structure

Facilitators can charge fees for their services:

* **Base fee**: Fixed fee per transaction (e.g., 1 USDT)
* **Percentage fee**: Percentage of transaction amount
* **No fee**: Some facilitators operate without fees

The fee is specified in the `/fee/quote` response and included in the payment requirements sent to clients.

### Trust Model

The x402-tron protocol is designed to be trust-minimizing:

* **Client signs the authorization**: The facilitator can only transfer up to the authorized amount.
* **Payment goes directly to seller**: Funds are transferred from client to seller (and optionally fee to facilitator).
* **On-chain verification**: All transactions are verifiable on TRON blockchain.

A malicious facilitator cannot:
* Transfer more than the client authorized
* Transfer to a different recipient than specified
* Modify the signed payment terms

### Summary

The facilitator acts as an independent verification and settlement layer within the x402-tron protocol on TRON blockchain. It helps servers confirm payments and submit transactions without requiring direct TRON infrastructure.

Next, explore:

* [Client / Server](client-server) — understand the roles and responsibilities of clients and servers
* [HTTP 402](http-402) — understand how payment requirements are communicated to clients
* [Network Support](network-and-token-support) — see supported TRON networks and tokens

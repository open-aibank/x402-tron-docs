# 买家快速入门
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 前置准备 

在开始集成前，请确保您的环境满足以下要求：

- **TRON 钱包**：持有一定量 USDT (TRC-20) 余额的钱包账户。
- **运行环境**：Python 3.10+ (含 pip) 或 Node.js 18+ (含 npm)。
- **目标服务**：一个支持 x402-tron 协议的支付服务端点。

> **提示**
> 您可以在 [GitHub 演示仓库](https://github.com/open-aibank/x402-tron-demo) 中找到预配置的完整代码示例（包含 Python/httpx 和 TypeScript 版本）。

## 1. 安装依赖

通过包管理器安装 x402-tron SDK：


```bash
pip install x402-tron
```

安装 x402-tron TypeScript 包：
```bash
npm install @open-aibank/x402-tron tronweb
```
## 2. 创建钱包签名器
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



```typescript
import { TronWeb } from 'tronweb'
import { TronClientSigner } from '@open-aibank/x402-tron'

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: process.env.TRON_PRIVATE_KEY,
})

const signer = TronClientSigner.withPrivateKey(
  tronWeb,
  process.env.TRON_PRIVATE_KEY!,
  'nile' // or 'mainnet', 'shasta'
)

console.log(`Client Address: ${signer.getAddress()}`)
```

## 3. 自动发起付费请求
<b>x402-tron</b> 提供了具备自动 402 支付处理功能的异步 HTTP 客户端支持。

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
[完整示例请见此处](https://github.com/open-aibank/x402-tron-demo/tree/main/typescript/client)

```typescript
import { TronWeb } from 'tronweb'
import { X402Client, X402FetchClient, UptoTronClientMechanism, TronClientSigner } from '@open-aibank/x402-tron'

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!

async function main(): Promise<void> {
  // Configure TronWeb
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: TRON_PRIVATE_KEY,
  })

  // Create signer
  const signer = TronClientSigner.withPrivateKey(tronWeb, TRON_PRIVATE_KEY, 'nile')

  // Create x402 client and register TRON mechanism
  const x402Client = new X402Client().register('tron:*', new UptoTronClientMechanism(signer))

  const client = new X402FetchClient(x402Client)

  // Make request - payment is handled automatically
  const response = await client.get('http://localhost:8000/protected')

  console.log(`Status: ${response.status}`)

  // Parse payment response
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
    console.log(`Transaction: ${settleResponse.transaction}`)
  }

  // Handle response
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('Response:', body)
  }
}

main().catch(console.error)
```

## 4. 理解支付流程 

当您向受保护的端点发起请求时，系统将执行以下自动化交互：



1.  **初始请求 (Initial Request)**：客户端向受保护的资源端点发送标准的 GET 或 POST 请求。
2.  **402 响应 (402 Response)**：服务端响应请求，返回 `402 Payment Required` 状态码以及详细的支付要求。
3.  **构建支付 (Payment Creation)**：客户端 SDK 自动解析支付要求，并构建 TIP-712 签名载荷。
4.  **携带支付重试 (Retry with Payment)**：客户端将签名封装在 `PAYMENT-SIGNATURE` 标头中，自动重试该请求。
5.  **验证与结算 (Verification & Settlement)**：服务端接收重试请求，通过促进者 (Facilitator) 验证签名有效性并在 TRON 链上完成结算。
6.  **最终响应 (Response)**：服务端返回受保护的资源内容，并在 `PAYMENT-RESPONSE` 标头中附带结算凭证。

## 5. 代币授权额度管理 

在使用 `upto` 支付方案时，客户端必须预先授权促进者合约代表其扣除代币。

虽然 x402-tron 客户端 SDK 通常会自动检测并处理这一授权过程，但您也可以根据业务需求手动管理额度：

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
  'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf', // USDT on Nile
  BigInt(1000000), // 1 USDT
  'tron:nile'
)
console.log(`Current allowance: ${allowance.toString()}`)
```

  </TabItem>
</Tabs>

## 6. 错误处理 

当遇到以下情况时，客户端 SDK 将会抛出异常：

* **机制未注册**：当前网络未配置对应的支付处理机制。
* **余额不足**：钱包内的代币余额无法覆盖支付费用。
* **授权失败**：代币额度授权操作失败（如用户拒绝或上链失败）。
* **签名错误**：生成 TIP-712 支付签名时发生错误。

常见的错误处理示例如下：

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


## 总结 

通过本指南，您已经完成了以下集成步骤：

* **安装依赖**：集成 `x402-tron` SDK 及 `tronweb` 库。
* **配置身份**：使用 TRON 私钥初始化钱包签名器 (Wallet Signer)。
* **初始化客户端**：实例化 `X402Client` 并注册 TRON 支付处理机制。
* **发起请求**：通过封装后的 HTTP 客户端访问付费 API 接口。
* **自动化流程**：SDK 将自动处理支付全生命周期，包括必要的代币授权 (Approve)。

## 下一步 

* **深入理解**：探索 [核心概念](../core-concepts/http-402) 以全面掌握协议设计。
* **网络配置**：查看 [网络支持](../core-concepts/network-and-token-support) 获取支持的代币与网络详情。

## 参考资料

* [npm package](https://www.npmjs.com/package/@open-aibank/x402-tron) - x402-tron JavaScript SDK
* [PyPI package](https://pypi.org/project/x402-tron/) - x402-tron Python SDK
* [示例代码仓库](https://github.com/open-aibank/x402-tron-demo) - 完整的集成演示
# 买家快速入门

## 前提条件

在开始之前，请确保您具备：

- 拥有 USDT (TRC-20) 的 TRON 钱包
- Python 3.10+ 和 pip，或 Node.js 18+ 和 npm
- 需要通过 x402-tron 付费的服务

**注意**：我们在演示仓库中提供了 [客户端示例](https://github.com/open-aibank/x402-tron-demo/tree/main/client/terminal)。

## 1. 安装依赖

x402-tron Python 包尚未发布到 PyPI，请从 GitHub 源码安装：

```bash
# 克隆仓库
git clone https://github.com/open-aibank/x402-tron.git
cd x402-tron/python/x402

# 安装
pip install -e .
```

或直接从 release tag 安装：

```bash
pip install "git+https://github.com/open-aibank/x402-tron.git@v0.1.6#subdirectory=python/x402"
```

## 2. 创建钱包签名器

```python
import os
from x402_tron.signers.client import TronClientSigner

# 从私钥创建签名器（使用环境变量）
signer = TronClientSigner.from_private_key(
    os.getenv("TRON_PRIVATE_KEY"),
    network="nile"  # 或 "mainnet", "shasta"
)

print(f"客户端地址: {signer.get_address()}")
```

## 3. 自动发起付费请求

x402-tron 提供异步 HTTP 客户端支持，具有自动 402 支付处理功能。

```python
import asyncio
import os
import httpx

from x402_tron.clients import X402Client, X402HttpClient
from x402_tron.mechanisms.client import ExactTronClientMechanism
from x402_tron.signers.client import TronClientSigner


async def main():
    # 配置签名器
    signer = TronClientSigner.from_private_key(
        os.getenv("TRON_PRIVATE_KEY"),
        network="nile"
    )

    # 创建 x402 客户端并注册 TRON 机制
    x402_client = X402Client().register(
        "tron:nile",
        ExactTronClientMechanism(signer)
    )

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # 发起请求 - 支付自动处理
        response = await client.get("http://localhost:8000/protected")

        print(f"状态: {response.status_code}")
        print(f"响应: {response.json()}")


asyncio.run(main())
```

## 4. 理解支付流程

当您向受保护的端点发起请求时：

1. **初始请求**：客户端向受保护端点发送 GET/POST 请求
2. **402 响应**：服务器返回 402 Payment Required 及支付详情
3. **支付创建**：客户端 SDK 读取支付要求并创建 TIP-712 签名负载
4. **携带支付重试**：客户端使用 PAYMENT-SIGNATURE 头重试请求
5. **验证和结算**：服务器通过促进者验证支付并在 TRON 上结算
6. **响应**：服务器返回受保护内容及 PAYMENT-RESPONSE 头

## 5. 代币授权管理

对于 exact 方案，客户端需要批准促进者代表其支出代币。x402-tron 客户端 SDK 会自动处理此操作，但您也可以手动管理授权：

```python
# 检查当前授权额度（SDK 会自动处理）
allowance = await signer.check_allowance(
    token="TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",  # Nile 测试网 USDT
    amount=100,  # 0.0001 USDT
    network="tron:nile"
)
print(f"当前授权额度: {allowance}")

# 确保足够的授权额度（如需要会自动批准）
await signer.ensure_allowance(
    token="TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    amount=100,
    network="tron:nile"
)
```

## 6. 结果处理

支付成功后，服务器返回受保护内容以及 `PAYMENT-RESPONSE` 头中的支付确认信息：

```python
response = await client.get("http://localhost:8000/protected")

if response.status_code == 200:
    # 访问受保护内容
    data = response.json()
    print(f"响应: {data}")
    
    # 检查支付确认
    payment_response = response.headers.get('payment-response')
    if payment_response:
        from x402_tron.encoding import decode_payment_payload
        from x402_tron.types import SettleResponse
        settle = decode_payment_payload(payment_response, SettleResponse)
        print(f"交易哈希: {settle.transaction}")
```

## 总结

- 安装 x402-tron 包
- 从您的 TRON 私钥创建钱包签名器
- 创建 X402Client 并注册 TRON 支付机制
- 使用提供的 HTTP 客户端包装器发起付费 API 请求
- 包括代币批准在内的支付流程会自动处理

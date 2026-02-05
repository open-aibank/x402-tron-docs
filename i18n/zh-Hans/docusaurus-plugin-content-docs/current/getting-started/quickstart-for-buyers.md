# 买家快速入门

## 前提条件

在开始之前，请确保您具备：

- 拥有 USDT (TRC-20) 的 TRON 钱包
- Python 3.10+ 和 pip，或 Node.js 18+ 和 npm
- 需要通过 x402-tron 付费的服务

**注意**：我们在演示仓库中提供了预配置的示例，包括 Python (httpx) 和 TypeScript 的示例。

## 1. 安装依赖

安装 x402-tron Python 包：

```bash
pip install x402-tron
```

## 2. 创建钱包签名器

```python
import os
from x402.signers.client import TronClientSigner

# 从私钥创建签名器（使用环境变量）
signer = TronClientSigner.from_private_key(
    os.getenv("TRON_PRIVATE_KEY"),
    network="nile"  # 或 "mainnet", "shasta"
)

print(f"客户端地址: {signer.get_address()}")
```

## 3. 自动发起付费请求

x402-tron 提供异步 HTTP 客户端支持，具有自动 402 支付处理功能。

## 4. 理解支付流程

当您向受保护的端点发起请求时：

1. **初始请求**：客户端向受保护端点发送 GET/POST 请求
2. **402 响应**：服务器返回 402 Payment Required 及支付详情
3. **支付创建**：客户端 SDK 读取支付要求并创建 TIP-712 签名负载
4. **携带支付重试**：客户端使用 PAYMENT-SIGNATURE 头重试请求
5. **验证和结算**：服务器通过促进者验证支付并在 TRON 上结算
6. **响应**：服务器返回受保护内容及 PAYMENT-RESPONSE 头

## 5. 代币授权管理

对于 upto 方案，客户端需要批准促进者代表其支出代币。x402-tron 客户端 SDK 会自动处理此操作，但您也可以手动管理授权。

## 6. 错误处理

客户端在以下情况下会抛出错误：

- 未为所需网络注册机制
- 钱包代币余额不足
- 授权批准失败
- 创建支付签名时出错

## 总结

- 安装 x402-tron 包和 tronweb
- 从您的 TRON 私钥创建钱包签名器
- 创建 X402Client 并注册 TRON 支付机制
- 使用提供的 HTTP 客户端包装器发起付费 API 请求
- 包括代币批准在内的支付流程会自动处理

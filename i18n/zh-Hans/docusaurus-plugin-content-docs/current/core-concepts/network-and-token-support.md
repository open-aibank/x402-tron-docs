# 网络与代币支持
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON 网络标识符

x402-tron 采用标准化的网络标识符格式：`tron:<network_name>`。
其中 `<network_name>` 对应为 `mainnet`、`shasta` 或 `nile`。

### 标识符参考表

| 网络名称 (Network Name) | x402-tron ID   | 描述 (Description)   |
| :---------------------- | :------------- | :------------------- |
| **TRON Mainnet**        | `tron:mainnet` | TRON 主网 (生产环境) |
| **TRON Shasta**         | `tron:shasta`  | TRON Shasta 测试网   |
| **TRON Nile**           | `tron:nile`    | TRON Nile 测试网     |

## 概览

x402-tron 专为 TRON 区块链生态设计，实现了原生的链上支付验证与结算功能。协议底层严格采用 **TIP-712** 标准，确保消息签名的安全性与防篡改能力。

### 支持的网络

| 网络环境         | 状态 (Status) | 说明 (Notes)                           |
| :--------------- | :------------ | :------------------------------------- |
| **TRON Mainnet** | **Mainnet**   | **生产网络**：用于处理真实价值资产。   |
| **TRON Nile**    | **Testnet**   | **推荐测试网**：首选的开发与调试环境。 |
| **TRON Shasta**  | **Testnet**   | **备用测试网**：长期稳定的测试环境。   |

### 支持的代币

x402-tron 协议全面支持 TRON 网络上的 **TRC-20** 标准代币，并默认将 **USDT** 作为主要结算货币。

#### 支持的代币列表

| 代币符号 | 网络环境       | 合约地址 (Contract Address)                     |
| :------- | :------------- | :---------------------------------------------- |
| **USDT** | `tron:nile`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` (示例地址) |
| **USDT** | `tron:mainnet` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`            |

> **扩展支持**：协议具有高度的可扩展性。通过在 `TokenRegistry` 中进行注册，您可以轻松配置并支持任意自定义的 TRC-20 代币。

#### 基于 TIP-712 的安全签名

x402-tron 严格采用 **TIP-712** 标准（TRON 对 EIP-712 的实现）来处理所有支付相关的结构化数据签名。

该机制带来了以下核心优势：

- **链下授权 (Off-chain Authorization)**：买方在本地（链下）对转账意图进行签名，无需预先锁定资金。
- **最小化信任 (Trust-minimized)**：签名包含严格的限制条件，促进者 (Facilitator) 无法在客户端明确授权的范围（金额、接收方、有效期）之外转移任何资金。
- **链上可验证 (On-chain Verifiability)**：所有的签名最终都可在智能合约层面进行加密学验证，确保交易的不可篡改性。

### 代币配置参数

在服务端配置 `HTTP 402` 支付要求时，您需要明确指定以下三个核心参数：

1.  **网络 (Network)**：目标 TRON 网络的唯一标识符（例如 `tron:nile`）。
2.  **资产 (Asset)**：目标 TRC-20 代币的**合约地址**。
3.  **金额 (Amount)**：基于代币**最小单位**（Raw Amount）的整数值。

> **精度换算示例**：
> USDT 的精度 (Decimals) 为 **6**。
> 若需收取 **1.0 USDT**，配置的数值应为 `1000000`。

#### 配置示例

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
    price="1 USDT",  # 1 USDT = 1000000 (6位小数)
    network=NetworkConfig.TRON_NILE,
    pay_to="<YOUR_TRON_ADDRESS>",
)
async def protected_endpoint():
    return {"data": "secret content"}
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { X402Client, UptoTronClientMechanism, TronClientSigner } from '@open-aibank/x402-tron'
import { TronWeb } from 'tronweb'

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: 'your-private-key',
})

const signer = TronClientSigner.withPrivateKey(tronWeb, 'your-private-key', 'nile')

const client = new X402Client().register('tron:*', new UptoTronClientMechanism(signer))
```

  </TabItem>
</Tabs>

### 支付方案

#### Upto 方案 (上限支付/按量付费)

`upto` 方案允许用户授权一笔**不超过**特定上限的资金，最终结算金额由服务端的实际消耗量决定。这非常适合动态计费场景。

**典型应用场景：**

- **按次/按量付费 API**：例如 LLM 的 Token 生成费、图像生成服务。
- **计量资源**：云计算实例的运行时间、数据存储量、网络带宽消耗。
- **动态定价服务**：基于实际使用量的后付费模式。

**工作原理：**

1.  **预授权 (Authorize)**：客户端签署 TIP-712 消息，授权支付**最大金额** (Max Amount)。
2.  **执行服务 (Execute)**：服务端执行请求任务，并计算**实际成本** (Actual Cost)。
3.  **最终结算 (Settle)**：促进者 (Facilitator) 根据实际成本发起链上扣款。

### 部署私有促进者

您可以选择部署私有的促进者节点，以完全掌控 TRON 网络上的支付验证与结算流程。

促进者作为协议的中间件，承担以下核心职责：

1.  **验证载荷 (Verify)**：校验 TIP-712 签名的加密有效性及参数完整性。
2.  **提交交易 (Submit)**：构建并向 TRON 区块链广播 `transferFrom` 交易。
3.  **监控确认 (Monitor)**：追踪交易在链上的确认状态，确保资金最终到账。

**部署先决条件**

- **节点访问权限**：稳定的 TRON 全节点 RPC 访问（例如 TronGrid 或自建节点）。
- **Gas 资源储备**：一个持有充足 **TRX** 的钱包，用于支付链上交易产生的**能量 (Energy)** 和**带宽 (Bandwidth)** 费用。
- **代码部署**：拉取并配置 x402-tron 促进者服务代码。

> **深入了解**：请查阅 [促进者 (Facilitator)](facilitator) 文档以获取详细的配置指南与 API 参考。

### 快速参考

| 核心组件     | TRON 实现详情                              |
| :----------- | :----------------------------------------- |
| **网络环境** | `tron:mainnet`, `tron:shasta`, `tron:nile` |
| **代币标准** | TRC-20 代币（默认内置 USDT 支持）          |
| **签名机制** | TIP-712 结构化数据签名                     |
| **支付方案** | `upto` (上限模式)；_`exact` 尚在开发中_    |

### 添加自定义代币

若您需要扩展支持其他的自定义 TRC-20 代币：

```python
from x402.tokens import TokenRegistry, TokenInfo

# 注册自定义代币
TokenRegistry.register_token(
    network="tron:nile",
    symbol="MYTOKEN",
    info=TokenInfo(
        address="TYourTokenContractAddress",
        decimals=18,
    )
)
```

### 总结

x402-tron 专为 TRON 区块链架构深度定制，提供了原生的 TRC-20 代币集成与 TIP-712 签名支持。

**核心要点：**

- **开发环境**：推荐优先使用 **TRON Nile 测试网** 进行开发与调试。
- **原生资产**：**USDT** 为默认的首选结算代币，且 SDK 已预置相关合约地址配置。
- **安全机制**：**TIP-712** 机制确保了安全且最小化信任 (Trust-minimized) 的支付授权流程。
- **扩展能力**：可通过 `TokenRegistry` 接口灵活扩展支持任意自定义的 **TRC-20 代币**。

### 下一步探索

- [卖方快速入门](../getting-started/quickstart-for-sellers) — 快速搭建服务端，开始接收 TRON 链上支付。
- [核心概念](http-402) — 深入理解 x402-tron 协议的底层运行机制。
- [促进者](facilitator) — 掌握促进者 (Facilitator) 在结算体系中的核心作用。

# 促进者
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

促进者 (Facilitator) 是一项**可选但强烈推荐**的服务，旨在简化客户端（买方）与服务端（卖方）在 TRON 网络上的支付验证与结算流程。

## 什么是促进者？

促进者是一种中间件服务，主要负责：

* **验证载荷**：校验客户端提交的支付载荷（TIP-712 签名）的有效性。
* **执行结算**：代表服务端将交易提交至 TRON 区块链进行结算。
* **代币转移**：利用 `transferFrom` 机制安全地管理代币流转。

通过引入促进者，服务端无需维护与 TRON 节点的直连，也无需自行实现复杂的签名验证逻辑。这不仅降低了运维复杂度，还能确保交易验证的准确性与实时性。

## 促进者的职责

* **支付验证**：确认客户端提交的 TIP-712 签名载荷严格符合服务端声明的支付要求。
* **支付结算**：将验证通过的交易提交至 TRON 网络，并监控上链状态。
* **费率管理**：支持配置服务费（可选），即对促成的支付收取费用。
* **结果反馈**：将验证与结算结果返回给服务端，作为服务端决定是否交付资源的依据。

> **注意**：促进者**不持有资金**，也不充当托管方——它仅根据客户端签名的指令执行验证与链上操作。

## 为什么要使用促进者？

集成促进者服务能带来显著优势：

* **降低运维门槛**：服务端无需直接处理 TRON 节点交互或 RPC 管理。
* **协议标准化**：确保跨服务的支付验证与结算流程保持一致。
* **快速集成**：服务端仅需极少的区块链开发工作即可开始接收支付。
* **资源费管理**：促进者负责支付交易执行所需的 TRX（能量 Energy 和带宽 Bandwidth），降低了服务端的持有成本。

虽然开发者可以选择在本地自行实现验证与结算逻辑，但使用促进者能显著加速开发周期并确保协议实现的规范性。

## 运行你自己的促进者

x402-tron 在 [演示仓库](https://github.com/open-aibank/x402-tron-demo) 中提供了一个**开箱即用**的促进者参考实现：


```bash
git clone [https://github.com/open-aibank/x402-tron-demo.git](https://github.com/open-aibank/x402-tron-demo.git)
cd x402-tron-demo/python/facilitator

# 配置环境变量（复制 .env.example 到 .env 并设置你的密钥）
cp .env.example .env

python main.py
```

运行促进者服务需要具备以下条件：

* **`TRON_PRIVATE_KEY`**：促进者钱包的私钥（用于签署并广播交易）。
* **TRX 余额**：钱包中需持有足够的 TRX，用于支付交易执行时产生的**能量 (Energy)** 和 **带宽 (Bandwidth)** 费用。


### 促进者 API 端点

| 端点 | 方法 | 描述 |
| :--- | :--- | :--- |
| `/` | GET | 获取服务基础信息 |
| `/supported` | GET | 查询支持的功能配置 |
| `/fee/quote` | POST | 获取预估费用报价 |
| `/verify` | POST | 验证支付载荷有效性 |
| `/settle` | POST | 执行链上结算 |


## 交互流程 (Interaction Flow)

1.  **初始请求**：`客户端 (Client)` 向 `资源服务器 (Resource Server)` 发起 HTTP 请求。
2.  **支付要求**：`资源服务器` 返回 `402 Payment Required` 状态码，并附带支付要求详情。
3.  **签名构建**：`客户端` 根据支付要求，构建并签署 TIP-712 `支付载荷 (Payment Payload)`。
4.  **重试请求**：`客户端` 再次向 `资源服务器` 发送请求，并在 HTTP 头中包含 `PAYMENT-SIGNATURE`。
5.  **验证请求**：`资源服务器` 调用 `促进者服务器 (Facilitator Server)` 的 `/verify` 端点，提交 `支付载荷` 进行验证。
6.  **签名校验**：`促进者服务器` 校验 TIP-712 签名的有效性，并返回验证结果。
7.  **业务处理**：若验证通过，`资源服务器` 执行请求的业务逻辑。
8.  **发起结算**：`资源服务器` 调用 `促进者服务器` 的 `/settle` 端点请求结算支付。
9.  **链上执行**：`促进者服务器` 在 TRON 区块链上执行 `transferFrom` 操作。
10. **交易确认**：`促进者服务器` 监控并等待交易在链上确认。
11. **结算响应**：`促进者服务器` 返回包含交易哈希 (Tx Hash) 的结算结果。
12. **最终响应**：`资源服务器` 向客户端返回 `200 OK` 响应及请求的内容，并在头中附带 `PAYMENT-RESPONSE`（包含结算凭证）。

## 促进者配置

```python
from x402.mechanisms.facilitator import UptoTronFacilitatorMechanism
from x402.signers.facilitator import TronFacilitatorSigner

# 初始化促进者签名器
facilitator_signer = TronFacilitatorSigner.from_private_key(
    "your-private-key",
    network="nile",  # 或 "mainnet" (主网)
)

# 初始化促进者机制
facilitator_mechanism = UptoTronFacilitatorMechanism(
    facilitator_signer,
    fee_to=facilitator_signer.get_address(),
    base_fee=1_000_000,  # 1 USDT 费用
)
```

## 费用结构 (Fee Structure)

促进者支持灵活配置服务费用：

* **固定费用 (Base Fee)**：每笔交易收取固定的服务费（例如 `1 USDT`）。
* **按比例收费 (Percentage Fee)**：按交易金额的一定百分比收取费用。
* **免费模式 (No Fee)**：支持零费率运营模式。

具体的费用明细将通过 `/fee/quote` 端点返回，并包含在服务端下发给客户端的支付要求 (Payment Requirements) 中。

## 信任模型 (Trust Model)

x402-tron 协议的设计核心在于**最小化信任假设**：



* **授权签名**：促进者仅能划转客户端签名授权范围内的资金。
* **资金直达**：资金从客户端直接流向卖方（若有服务费，则部分流向促进者），中间不经过资金池。
* **链上验证**：所有交易记录均在 TRON 区块链上公开可查。

即使是**恶意的促进者**也无法执行以下操作：
* 划转超过客户端授权限额的资金。
* 将资金转移给非签名指定的接收方。
* 篡改任何已签名的支付条款。

## 总结 (Summary)

在 x402-tron 协议体系中，**促进者 (Facilitator)** 充当了 TRON 链上的独立验证与结算层。它赋能服务端在无需部署完整 TRON 基础设施的情况下，安全地确认支付并完成链上结算。

## 下一步 (Next Steps)

接下来，建议您深入了解：

* [客户端 / 服务端](client-server) — 详解双方在协议中的角色与职责。
* [HTTP 402](http-402) — 学习如何标准化地传递支付要求。
* [网络支持](network-and-token-support) — 查看支持的 TRON 网络环境及代币列表。
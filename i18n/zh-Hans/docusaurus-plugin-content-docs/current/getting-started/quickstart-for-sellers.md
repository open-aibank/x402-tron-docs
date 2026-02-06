# 卖家快速入门
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **注意**：本快速入门指南默认基于 **测试网 (TRON Nile)** 环境，旨在提供安全的开发与测试沙箱。
>
> 当您准备好上线生产环境时，请参阅 [主网部署指南](#running-on-mainnet)，了解如何切换至 TRON 主网以接收真实资产支付。

## 前置准备 (Prerequisites)

在开始集成之前，请确保您的开发环境满足以下条件：

* **收款钱包**：一个用于接收资金的 TRON 钱包地址（支持任意兼容 TRON 协议的钱包）。
* **Python 环境**：Python 3.10+ 及 pip。
* **目标服务**：一个现有的 API 服务或后端应用程序（推荐 FastAPI）。

**注意：**
我们在演示仓库中提供了预配置的示例：[服务器示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server) 和 [促进者示例](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator)。

## 1. 安装依赖 (Install Dependencies)

x402-tron Python 包尚未发布到 PyPI，请从 GitHub 源码安装：

```bash
# 克隆仓库
git clone https://github.com/open-aibank/x402-tron.git
cd x402-tron/python/x402

# 安装（包含 FastAPI 支持）
pip install -e ".[fastapi]"
```

或直接从 release tag 安装：

```bash
pip install "git+https://github.com/open-aibank/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"
```


## 2. 集成支付中间件 (Integrate Payment Middleware)

接下来，将支付中间件集成至您的应用程序中。配置过程中需要提供以下关键参数：

* **促进者服务地址 (Facilitator URL)**：指向促进者服务的端点。在开发测试阶段，您可以运行本地促进者实例，或使用公共托管的测试服务。
* **受保护的路由 (Protected Routes)**：指定需要保护的路由。
* **收款钱包地址 (Receiver Wallet Address)**：用于接收用户支付款项的 TRON 钱包地址。




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


### 路由配置详解 (Route Configuration)

在配置受保护的路由规则时，您需要定义以下核心参数：

* **`price` (价格)**：设定支付金额。支持人类可读格式（如 `"0.0001 USDT"`）或链上最小单位整数（如 `"100"`，对应 0.0001 USDT）。
* **`network` (网络)**：指定 TRON 网络标识符（例如 `tron:nile` 用于测试网，`tron:mainnet` 用于主网）。
* **`pay_to` (收款地址)**：指定用于最终接收资金的卖方 TRON 钱包地址。

**拦截机制**：
当客户端尝试访问这些受保护路由但未携带有效支付凭证时，您的服务器将自动拦截请求，并响应 `HTTP 402 Payment Required` 状态码及包含上述参数的支付说明。



## 3. 部署促进者服务 (Run a Facilitator)

x402-tron 协议依赖**促进者 (Facilitator)** 来负责支付签名的验证与链上结算。您可以选择部署私有的促进者实例：

```bash
# Clone the demo repository first
git clone https://github.com/open-aibank/x402-tron-demo.git
cd x402-tron-demo/facilitator

# Configure environment variables (copy .env.example to .env and set your keys)
cp .env.example .env

python main.py
```

这将在 `http://localhost:8001` 启动促进者服务实例，并包含以下 API 端点：

* `GET /supported` - 查询支持的功能配置
* `POST /verify` - 验证支付载荷有效性
* `POST /settle` - 执行链上结算
* `POST /fee/quote` - 获取当前的费用报价

## 4. 验证集成 (Verify Integration)

请按照以下步骤验证您的集成是否正常工作：



1.  **发起请求**：向受保护的端点发送请求（例如：`curl -v http://localhost:8000/protected`）。
2.  **接收挑战**：服务器应响应 `402 Payment Required` 状态码，并在响应头 `PAYMENT-REQUIRED` 中包含 Base64 编码的支付说明。
3.  **客户端签名**：使用兼容的客户端完成支付动作。这涉及解析支付说明并签署 TIP-712 载荷（详情请参阅 [买方快速入门](quickstart-for-buyers) 中的 SDK 用法）。
4.  **重试请求**：客户端携带包含已签名载荷的 `PAYMENT-SIGNATURE` 标头，再次发起请求。
5.  **验证通过**：服务器通过促进者验证签名及结算状态。若验证成功，服务器将返回 `200 OK` 及实际的 API 响应数据。

## 5. 故障排查 (Troubleshooting)

若在集成过程中遇到问题，请检查以下要点：

* **参考示例**：查看 [服务器示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server) 和 [促进者示例](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator) 中的完整代码实现。
* **服务状态**：确保**促进者服务 (Facilitator)** 已启动且您的服务器能够正常访问该地址。
* **地址校验**：检查配置的 TRON 收款钱包地址是否符合 Base58 格式且有效。





## 在主网上运行 (Running on Mainnet)

完成测试网 (Nile) 的集成验证后，您可以按照以下步骤切换至 TRON 主网，开始接收真实的加密资产支付。


### 1. 更新网络配置 (Update Network Configuration)

将代码中的网络配置从测试网更改为主网：

```python
# Testnet → Mainnet
network="tron:mainnet"  # was "tron:nile"
```

### 2. 更新促进者配置 (Update Facilitator)

若您在主网运行自托管的促进者服务，需执行以下变更：

1.  **申请 TronGrid API Key**：在 [TronGrid](https://www.trongrid.io/) 注册并创建 API Key。这是主网 RPC 访问的必要条件。
2.  **更新环境变量**：配置主网凭证（包括 `TRON_GRID_API_KEY`）。
3.  **储备资源费用**：确保促进者钱包持有充足的 **TRX** 用于能量/带宽费用。
4.  **更新网络参数**：将促进者的网络配置更新为 `mainnet`。

### 3. 确认收款钱包 (Verify Receiving Wallet)

请务必将配置中的收款地址 (`pay_to`) 更新为您持有私钥的、用于接收真实 USDT 的 **主网钱包地址**。

### 4. 生产环境验证 (Production Verification)



在正式向用户开放之前，请务必执行**“小额真实测试” (Penny Test)**：

1.  **小额试付**：使用真实钱包发起一笔极小金额（例如 `0.1 USDT`）的支付请求。
2.  **到账确认**：不要仅依赖 API 响应，请直接在 [TronScan](https://tronscan.org) 上查询收款钱包，确认资金已确切到账。
3.  **监控日志**：观察促进者服务的运行日志，确保没有出现超时或资源不足的错误。

> **⚠️ 风险警告 (Critical Warning)**
>
> **主网交易涉及真实资金且不可逆。**
> 请务必先在测试网 (Nile/Shasta) 完成全流程的彻底测试。在主网部署初期，建议设置较低的交易限额，从小额支付开始逐步验证系统的稳定性。


## 网络标识符 (Network Identifiers)

x402-tron 使用标准化的标识符字符串来区分不同的 TRON 网络环境：

| 网络环境 (Network) | 标识符 (Identifier) |
| :--- | :--- |
| **TRON Mainnet** (主网) | `tron:mainnet` |
| **TRON Nile** (测试网) | `tron:nile` |
| **TRON Shasta** (测试网) | `tron:shasta` |

如需查看支持的代币与网络完整列表，请参阅 [网络支持](../core-concepts/network-and-token-support)。

## 下一步 (Next Steps)

* **参考示例**：查看 [服务器示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server) 以了解更复杂的支付流程与最佳实践。
* **深入原理**：探索 [核心概念](../core-concepts/http-402) 以全面理解 x402-tron 的协议设计。
* **客户端集成**：阅读 [买家快速入门](quickstart-for-buyers) 或 [AI 代理快速入门](quickstart-for-agent)，从客户端视角体验支付流程。

## 总结 (Summary)



通过本快速入门指南，您已成功完成了以下核心任务：

* **集成 SDK**：安装并配置了 x402-tron 开发包。
* **路由保护**：为特定的 API 端点实施了基于支付的访问控制。
* **部署促进者**：运行了负责验证签名与链上结算的中间件服务。
* **全流程验证**：从测试网 (Nile) 的沙箱测试平滑过渡到了主网 (Mainnet) 的生产部署。

**恭喜！** 您的 API 现已具备处理 TRON 链上原生支付的能力。

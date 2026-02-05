# SDK 功能

本页面跟踪 x402-tron 的各个 SDK（Python、TypeScript）中实现的功能。

## 核心

| 组件 | Python | TypeScript |
|------|--------|------------|
| 服务器 | ✅ | ⏳ |
| 客户端 | ✅ | ✅ |
| 促进者 | ✅ | ⏳ |

## HTTP 框架集成

| 角色 | Python | TypeScript |
|------|--------|------------|
| 服务器 | FastAPI, Flask | - |
| 客户端 | httpx | fetch |

## 网络

| 网络 | Python | TypeScript |
|------|--------|------------|
| tron:mainnet | ✅ | ✅ |
| tron:nile | ✅ | ✅ |
| tron:shasta | ✅ | ✅ |

## 机制

| 机制 | Python | TypeScript |
|------|--------|------------|
| exact/tron (TIP-712) | ✅ | ✅ |

## 签名器

| 签名器 | Python | TypeScript |
|--------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |

## 客户端功能

| 功能 | Python | TypeScript |
|------|--------|------------|
| 自动 402 处理 | ✅ | ✅ |
| 自动代币批准 | ✅ | ✅ |
| 授权检查 | ✅ | ✅ |
| TIP-712 签名 | ✅ | ✅ |

## 服务器功能

| 功能 | Python | TypeScript |
|------|--------|------------|
| @x402_protected 装饰器 | ✅ | ⏳ |
| 支付验证 | ✅ | ⏳ |
| 支付结算 | ✅ | ⏳ |
| 费用支持 | ✅ | ⏳ |

## 促进者功能

| 功能 | Python | TypeScript |
|------|--------|------------|
| /verify 端点 | ✅ | ⏳ |
| /settle 端点 | ✅ | ⏳ |
| /fee/quote 端点 | ✅ | ⏳ |
| /supported 端点 | ✅ | ⏳ |
| 交易提交 | ✅ | ⏳ |
| 交易确认 | ✅ | ⏳ |

## 代币支持

| 代币 | Python | TypeScript |
|------|--------|------------|
| USDT (TRC-20) | ✅ | ✅ |
| 自定义 TRC-20 | ✅ | ✅ |

## 图例

- ✅ = 已实现
- ⏳ = 计划中 / 开发中
- ❌ = 未计划

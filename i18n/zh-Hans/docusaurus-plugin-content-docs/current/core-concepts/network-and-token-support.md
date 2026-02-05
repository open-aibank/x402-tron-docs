# 网络与代币支持

## TRON 网络标识符

x402-tron 使用简单的网络标识符格式：`tron:<network_name>`，其中 network_name 是 mainnet、shasta 或 nile 之一。

### 网络标识符参考

| 网络名称 | x402-tron ID | 描述 |
|---------|--------------|------|
| TRON 主网 | tron:mainnet | TRON 主网 |
| TRON Shasta | tron:shasta | TRON Shasta 测试网 |
| TRON Nile | tron:nile | TRON Nile 测试网 |

## 概述

x402-tron 专为 TRON 区块链设计，支付验证和结算原生实现于 TRON 网络。该协议利用 TRON 的 TIP-712 进行安全消息签名。

## 支持的网络

| 网络 | 状态 | 说明 |
|------|------|------|
| TRON Nile 测试网 | ✓ | 推荐用于开发和测试 |
| TRON Shasta 测试网 | ✓ | 替代测试网 |
| TRON 主网 | ✓ | 生产网络 |

## 代币支持

x402-tron 支持 TRON 网络上的 TRC-20 代币。主要支持的代币是 USDT。

### 支持的代币

| 代币 | 网络 | 合约地址 |
|------|------|---------|
| USDT | tron:nile | TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf |
| USDT | tron:mainnet | TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t |

**注意**：可以通过在 TokenRegistry 中注册来支持自定义 TRC-20 代币。

## TIP-712 安全签名

x402-tron 使用 TIP-712（TRON 对 EIP-712 的实现）进行结构化数据签名。这实现了：

- **安全授权**：买家离线签署转账授权
- **最小化信任**：促进者不能在客户端意图之外移动资金
- **可验证**：所有签名都可以在链上验证

## 代币配置

配置支付要求时，您需要指定：

- **网络**：TRON 网络标识符（例如 tron:nile）
- **资产**：TRC-20 代币合约地址
- **金额**：代币最小单位的支付金额（例如，1 USDT = 1000000，6 位小数）

## 支付方案

### Upto 方案

upto 方案允许支付最多指定金额，适用于：

- 按使用付费的 API（LLM 代币生成、数据处理）
- 计量资源（计算时间、带宽）
- 基于实际使用量的动态定价

upto 方案的工作原理：

1. 客户端签署授权，允许最多一定金额
2. 服务器执行工作并确定实际成本
3. 促进者结算实际金额（最多授权的最大值）

## 运行您自己的促进者

您可以运行自己的促进者来验证和结算 TRON 上的支付。促进者：

- 验证支付负载（TIP-712 签名）
- 将交易提交到 TRON 区块链
- 监控交易确认

### 前提条件

- 访问 TRON 节点（例如 TronGrid）
- 拥有 TRX 用于 gas/能量费用的钱包
- x402-tron 促进者代码

## 快速参考

| 组件 | TRON 支持 |
|------|----------|
| 网络 | tron:mainnet, tron:shasta, tron:nile |
| 代币 | TRC-20 代币（默认支持 USDT） |
| 签名 | TIP-712 结构化数据签名 |
| 方案 | upto（exact 方案开发中） |

## 总结

x402-tron 的网络支持专为 TRON 区块链设计，具有原生 TRC-20 代币支持和 TIP-712 签名。关键要点：

- 推荐使用 TRON Nile 测试网进行开发
- USDT 是主要支持的代币，具有预配置的地址
- TIP-712 提供安全、最小化信任的支付授权
- 可以通过 TokenRegistry 添加自定义 TRC-20 代币

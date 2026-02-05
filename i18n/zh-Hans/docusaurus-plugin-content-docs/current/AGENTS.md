# 文档代理指引

## 包身份

- x402-tron 的 Docusaurus 文档源码
- 使用 `sidebars.js` 作为导航配置的 MDX / Markdown 文件

## 目录结构

- `docs/core-concepts/` — 协议说明（HTTP 402、客户端-服务器、促成者、钱包、网络支持）
- `docs/getting-started/` — 买方与卖方的快速上手指南（包含 Tabs 的 MD 文件）
- `docs/index.md` — 欢迎页 / 着陆页
- `docs/faq.md` — 常见问题
- `sidebars.js` — Docusaurus 侧边栏导航配置
- `docusaurus.config.js` — Docusaurus 主配置文件
- `docs/sdk-features.md` — Python 与 TypeScript SDK 的功能列表

## 代码与文档映射

- 对 `typescript/packages/` 的修改会影响 TypeScript SDK 相关文档
- 对 `python/x402/` 的修改会影响 Python SDK 相关文档
- 对 facilitator 端点的修改会影响快速上手指南
- 对机制（mechanisms）的修改会影响 core-concepts 文档

## 风格规范

- 以 **Python** 作为主要代码示例（功能最完整的 SDK）
- 在可用的情况下补充 **TypeScript** 示例
- 所有 API 示例必须包含错误处理
- 面向具有 **2–5 年经验** 的开发者编写
- 使用 Docusaurus MDX 组件（`<Tabs>`、`<TabItem>`）展示多语言代码示例
- 使用 Tabs 的文件需在文件顶部引入：
  ```js
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  ```
- 所有 API 端点需同时展示 **成功** 与 **失败** 的响应示例
- 示例中使用真实世界的参数值（避免使用 foo/bar 占位符）

## 约定

- **应当（DO）**：将新增页面加入 `sidebars.js` 导航
- **应当（DO）**：包含来自真实 SDK 文件的代码示例
- **应当（DO）**：使用 `<Tabs>` / `<TabItem>` 展示多语言代码
- **应当（DO）**：为所有页面添加 frontmatter（title、description）
- **不要（DON'T）**：新增页面却不更新 `sidebars.js`
- **Git**：通过 PR 提交以供评审；**严禁**直接提交到 main 分支

## TRON 专属内容

- 网络标识使用 `tron:<network>` 格式（`mainnet`、`nile`、`shasta`）
- TRON 签名引用 **TIP-712**（而非 EIP-712）
- Token 地址为 Base58 编码（以 `T` 开头）
- 节点访问需引用 TronGrid 端点
- 示例 Token：Nile 网络 USDT：`TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf`

## 关键文件 / 触点（Touch Points / Key Files）

- `docs/index.md` — 着陆页
- `docs/faq.md` — 常见问题
- `sidebars.js` — 导航配置（新增页面 **必须** 更新）
- `docusaurus.config.js` — 站点主配置
- `docs/core-concepts/*.md` — 概念性文档
- `docs/getting-started/*.md` — 快速上手指南（使用 Tabs 的 MDX）
- `docs/sdk-features.md` — SDK 能力变更时需同步更新

## 文件扩展名

- 所有页面使用 `.md`（Docusaurus 可解析 `.md` 中的 MDX）
- 避免使用 `.mdx` 扩展名以获得更好的编辑器兼容性

## 常见坑点

- `sidebars.js` 控制 Docusaurus 导航；未列入的页面不会显示在侧边栏
- 页面间链接应省略文件扩展名
- TRON 地址区分大小写，且为 Base58 编码
- 使用 Tabs 的文件必须在使用前引入 Tabs 组件

## 提交前检查

- 所有链接可用（无断链）
- 新页面已加入 `sidebars.js` 导航
- 代码示例可编译并运行
- 所有页面均包含 frontmatter（title、description）
- MDX 语法有效
- 运行 `yarn build` 确认无构建错误

## SDK 功能对齐文档

当 SDK 代码涉及以下变更时：

- `*/mechanisms/` 中新增机制
- `*/signers/` 中新增签名器
- 新的客户端 / 服务端功能

需同步更新 `sdk-features.md` 以反映当前状态。更新时需同时检查 **Python** 与 **TypeScript** 两个 SDK。

## 开发命令（Development Commands）

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn start

# 构建生产版本
yarn build

# 本地服务生产构建
yarn serve
```


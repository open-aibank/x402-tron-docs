/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: '简介',
    },
    {
      type: 'category',
      label: '快速入门',
      items: [
        'getting-started/quickstart-for-sellers',
        {
          type: 'category',
          label: '买家快速入门',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'getting-started/quickstart-for-human',
              label: '人类用户快速入门',
            },
            {
              type: 'doc',
              id: 'getting-started/quickstart-for-agent',
              label: 'AI 代理快速入门',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '核心概念',
      items: [
        'core-concepts/http-402',
        'core-concepts/client-server',
        'core-concepts/facilitator',
        'core-concepts/wallet',
        'core-concepts/network-and-token-support',
      ],
    },
    {
      type: 'doc',
      id: 'sdk-features',
      label: 'SDK 功能',
    },
    {
      type: 'doc',
      id: 'faq',
      label: '常见问题',
    },
  ],
}

module.exports = sidebars

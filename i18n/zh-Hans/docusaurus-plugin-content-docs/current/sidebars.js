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
      items: ['getting-started/quickstart-for-buyers', 'getting-started/quickstart-for-sellers'],
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

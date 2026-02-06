/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/quickstart-for-sellers', 'getting-started/quickstart-for-buyers', 'getting-started/quickstart-for-agent'],
    },
    {
      type: 'category',
      label: 'Core Concepts',
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
      label: 'SDK Features',
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
  ],
}

module.exports = sidebars

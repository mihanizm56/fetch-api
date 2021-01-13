module.exports = {
  title: 'Fetch-API',
  tagline: 'Api client based of native fetch api with a lot of features',
  url: 'https://mihanizm56.github.io',
  baseUrl: '/fetch-api/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mihanizm56',
  projectName: 'Fetch-API',
  themeConfig: {
    theme: require('prism-react-renderer/themes/github'),
    hideableSidebar: true,
    algolia: {
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      contextualSearch: true,
      searchParameters: {},
    },
    navbar: {
      title: 'Fetch-API',
      hideOnScroll: true,
      logo: {
        alt: 'Fetch-API Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          label: 'Documentation',
          position: 'left',
          docId: 'overview',
        },
        {
          type: 'doc',
          label: 'API',
          position: 'left',
          docId: 'api/api',
        },
        {
          to: 'https://github.com/mihanizm56/fetch-api',
          label: 'Star me',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/mihanizm56/fetch-api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.config.js'),
          editUrl: 'https://github.com/mihanizm56/fetch-api/tree/feature/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        excludeNextVersionDocs: true,
      },
    ],
  ],
};

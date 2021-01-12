module.exports = {
  title: 'Fetch-API',
  tagline: 'Api client based of native fetch api',
  url: 'https://mihanizm56.github.io',
  baseUrl: '/fetch-api/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mihanizm56', // Usually your GitHub org/user name.
  projectName: 'Fetch-API', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',

      // Optional: see doc section bellow
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
    navbar: {
      title: 'Fetch-API',
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
      style: 'light',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.config.js'),
          editUrl: 'https://github.com/mihanizm56/fetch-api/tree/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

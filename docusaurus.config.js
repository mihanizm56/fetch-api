const dotenv = require('dotenv');
dotenv.config();

const algoliaParams = {
  apiKey: process.env.ALGOLIA_API_KEY || '',
  indexName: process.env.ALGOLIA_INDEX_NAME || '',
  contextualSearch: true,
  inputSelector:'.DocSearch',
  searchParameters: {
    facetFilters: [
      `type:${process.env.ALGOLIA_FACET_FILTERS_TYPE || ''}`, 
      `version:${process.env.ALGOLIA_FACET_FILTERS_VERSION || ''}`, 
      `language:${process.env.ALGOLIA_FACET_FILTERS_LANGUAGE || ''}`, 
      `docusaurus_tag:${process.env.ALGOLIA_FACET_FILTERS_DOCUSAURUS_TAG || ''}`
    ]
  },
}

module.exports = {
  title: 'Fetch-API',
  tagline: 'Api client based of native fetch api with a lot of features',
  url: 'https://mihanizm56.github.io',
  baseUrl: '/fetch-api/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/like.svg',
  organizationName: 'mihanizm56',
  projectName: 'Fetch-API',
  themeConfig: {
    theme: require('prism-react-renderer/themes/github'),
    hideableSidebar: true,
    algolia: algoliaParams,
    navbar: {
      title: 'Fetch-API',
      hideOnScroll: true,
      logo: {
        alt: 'Fetch-API Logo',
        src: 'img/like.svg',
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

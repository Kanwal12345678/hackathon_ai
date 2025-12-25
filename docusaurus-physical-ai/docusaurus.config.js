const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Physical AI — AI-Native Textbook',
  tagline: 'Teaching Physical AI with AI agents, simulation-first approach',
  url: 'https://docusaurus-physical-ai.vercel.app', // Vercel deployment URL
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/robot-favicon.svg',
  organizationName: 'your-github-username', // Usually your GitHub org/user name.
  projectName: 'docusaurus-physical-ai', // Usually your repo name.
  trailingSlash: false, // Required for proper routing on Vercel

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/your-github-username/docusaurus-physical-ai/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Physical AI Textbook',
        logo: {
          alt: 'Physical AI Robot Logo',
          src: 'img/robot-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Textbook',
          },
          {
            href: 'https://github.com/your-github-username/docusaurus-physical-ai',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Textbook',
            items: [
              {
                label: 'Physical AI Textbook',
                to: '/docs/index',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Docusaurus',
                href: 'https://docusaurus.io',
              },
              {
                label: 'Physical AI',
                href: 'https://physical-ai.org',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-github-username/docusaurus-physical-ai',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/kanwal-shahzadi',
              },
            ],
          },
        ],
        copyright: `© 2025 Physical AI Textbook — Kanwal Shahzadi`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
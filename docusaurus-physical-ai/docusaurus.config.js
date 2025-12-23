const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Physical AI — AI-Native Textbook',
  tagline: 'Teaching Physical AI with AI agents, simulation-first approach',

  // Vercel URL
  url: 'https://docusaurus-physical-ai.vercel.app',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  favicon: 'img/favicon.ico',

  // GitHub info (optional for Vercel)
  organizationName: 'your-github-username',
  projectName: 'docusaurus-physical-ai',

  // IMPORTANT for Vercel
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),

          // ⭐ THIS FIXES 404
          routeBasePath: '/',   // Docs = Homepage

          editUrl:
            'https://github.com/your-github-username/docusaurus-physical-ai/edit/main/',
        },

        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/your-github-username/docusaurus-physical-ai/edit/main/',
        },

        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Physical AI Textbook',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'index',
          position: 'left',
          label: 'Textbook',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
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
              to: '/',
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
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href:
                'https://github.com/your-github-username/docusaurus-physical-ai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Textbook. Built with Docusaurus.`,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

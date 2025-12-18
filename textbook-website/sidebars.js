// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // Manual sidebar for the textbook content
  textbookSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started', 'about'],
    },
    {
      type: 'category',
      label: 'Physical AI Fundamentals',
      items: [
        'physical-ai/introduction',
        'physical-ai/core-concepts',
        'physical-ai/applications',
      ],
    },
    {
      type: 'category',
      label: 'Humanoid Robotics',
      items: [
        'humanoid-robotics/basics',
        'humanoid-robotics/design-principles',
        'humanoid-robotics/control-systems',
      ],
    },
    {
      type: 'category',
      label: 'AI in Education',
      items: [
        'ai-education/personalization',
        'ai-education/adaptive-learning',
        'ai-education/assessment',
      ],
    },
    {
      type: 'category',
      label: 'Technical Implementation',
      items: [
        'technical/architecture',
        'technical/api-reference',
        'technical/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Research & Ethics',
      items: [
        'research/papers',
        'ethics/responsibility',
        'ethics/future-implications',
      ],
    },
  ],
};

export default sidebars;

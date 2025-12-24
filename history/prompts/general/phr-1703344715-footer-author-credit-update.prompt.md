---
id: phr-1703344715-footer-author-credit-update
stage: general
title: Footer Author Credit Update
date: 2025-12-25
---

## Prompt

Update the footer to include an author credit:
© 2025 Physical AI Textbook — Kanwal Shahzadi
Keep the footer minimal and professional and add my github link to the footer. and remove the blog section

## Response

Updated the Docusaurus configuration to modify the footer as requested:

1. Updated the footer copyright text to: `© 2025 Physical AI Textbook — Kanwal Shahzadi`
2. Removed the blog section from the footer links
3. Changed the "More" section to "Connect" and kept only the GitHub link
4. Removed the blog link from the navbar
5. Removed the blog configuration from the presets

The changes were made in `docusaurus.config.js`:
- Modified the footer links structure to remove blog and rename sections
- Updated the copyright field with the requested text
- Removed blog-related items from navbar
- Removed blog configuration from presets to completely disable blog functionality
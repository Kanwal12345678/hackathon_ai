---
id: phr-1703344463
stage: spec
title: Docusaurus Vercel 404 Fix Spec
created: 2025-12-23
tags: [docusaurus, vercel, deployment, configuration]
---

# Docusaurus Vercel 404 Fix Spec

## Prompt

```
You are an expert Docusaurus + Vercel deployment engineer.

My Docusaurus site shows a 404 NOT_FOUND error after deploying on Vercel.

Please do the following step by step:
1. Check and fix docusaurus.config.js:
   - Ensure baseUrl is set correctly for Vercel (use '/' if no subpath).
   - Ensure url is correct.
   - Set trailingSlash: false.
2. Verify that the build output directory is correct:
   - Docusaurus build output should be 'build'.
3. Update vercel.json if needed:
   - Set correct outputDirectory.
   - Add rewrites so all routes point to index.html.
4. Ensure homepage routing works (no 404 on refresh).
5. Provide the exact updated code for:
   - docusaurus.config.js
   - vercel.json
6. Explain briefly why the 404 was happening and how this fix resolves it.
7. Make sure the project deploys successfully on Vercel.

Only suggest solutions compatible with latest Docusaurus and Vercel.
```

## Response

Created specification document for fixing Docusaurus 404 error on Vercel deployment. The specification includes:

- Feature overview explaining the 404 error issue
- User scenarios and testing requirements
- Functional requirements for docusaurus.config.js and vercel.json
- Success criteria with measurable outcomes
- Assumptions, dependencies, and constraints
- Quality checklist validation

The specification addresses the core issue of client-side routing not working properly after deployment to Vercel, which causes 404 errors when accessing or refreshing pages other than the homepage.
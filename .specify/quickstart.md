# Quickstart Guide: Docusaurus Vercel Deployment Fix

## Overview
This guide provides step-by-step instructions to fix the 404 error when deploying a Docusaurus site to Vercel. The issue occurs because Docusaurus uses client-side routing, which requires special server configuration to handle direct URL access.

## Prerequisites
- Node.js installed on your system
- Docusaurus project set up
- Access to Vercel account
- Git repository for the project

## Step 1: Update docusaurus.config.js

1. Open `docusaurus.config.js` in your project root
2. Update the `url` field with your Vercel deployment URL:
   ```javascript
   url: 'https://your-project-name.vercel.app', // Replace with your actual Vercel URL
   ```
3. Set `trailingSlash` to false:
   ```javascript
   trailingSlash: false,
   ```
4. Ensure `baseUrl` is set correctly (typically '/' for root deployments):
   ```javascript
   baseUrl: '/',
   ```

## Step 2: Create vercel.json

1. Create a new file named `vercel.json` in your project root
2. Add the following configuration:
   ```json
   {
     "outputDirectory": "build",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

## Step 3: Test Locally

1. Build your Docusaurus site:
   ```bash
   npm run build
   ```
2. Serve the build locally to test routing:
   ```bash
   npx serve build
   ```
3. Test various routes by navigating directly to different pages (e.g., /docs/intro, /docs/chapter1/lesson1)

## Step 4: Deploy to Vercel

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Fix: Configure Docusaurus for Vercel deployment"
   git push
   ```
2. If not already connected, link your project to Vercel:
   ```bash
   vercel
   ```
3. Follow the prompts to configure your project with:
   - Build command: `npm run build`
   - Output directory: `build`

## Verification

After deployment, verify that:
- Homepage loads correctly
- All documentation pages load without 404 errors
- Direct URL access to any route works
- Page refresh works on all routes

## Troubleshooting

### Still getting 404 errors?
- Verify that `trailingSlash: false` is set in docusaurus.config.js
- Check that vercel.json has the correct rewrite rules
- Ensure the outputDirectory in vercel.json matches your Docusaurus build output

### Build fails on Vercel?
- Verify that your package.json has all necessary dependencies
- Check that build command is correctly set in Vercel project settings
- Ensure Node.js version is compatible with your dependencies

## Next Steps

Once the deployment is working correctly:
- Set up a custom domain if desired
- Configure SSL certificate
- Set up continuous deployment from your Git repository
- Add environment variables if needed for different deployment stages
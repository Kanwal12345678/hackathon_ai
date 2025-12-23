# Hosting Guide for Physical AI Docusaurus Website

This guide provides instructions for hosting your Physical AI textbook website using various platforms.

## Prerequisites

Before hosting, ensure you have:
- Updated the `docusaurus.config.js` file with your actual GitHub username and project name
- Successfully built the project with `npm run build`
- Tested the build locally with `npm run serve`

## Hosting Options

### Option 1: GitHub Pages (Free)

#### Prerequisites:
- A GitHub account
- Your project pushed to a GitHub repository

#### Steps:
1. Ensure your `docusaurus.config.js` has the correct settings:
   ```js
   {
     url: 'https://your-github-username.github.io', // Replace with your GitHub username
     organizationName: 'your-github-username', // Your GitHub username
     projectName: 'your-repo-name', // Your repository name
     deploymentBranch: 'gh-pages', // Branch to deploy to
   }
   ```

2. From the `docusaurus-physical-ai` directory, run:
   ```bash
   GIT_USER=your-github-username npm run deploy
   ```

3. In your GitHub repository settings:
   - Go to "Pages" section
   - Select source as "Deploy from a branch"
   - Select "gh-pages" branch and "/ (root)" folder
   - Your site will be available at `https://your-github-username.github.io/your-repo-name`

#### Alternative GitHub Pages Method (Using GitHub Actions):
1. Create `.github/workflows/deploy.yml` in your repository:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       name: Deploy to GitHub Pages
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: npm
             cache-dependency-path: docusaurus-physical-ai/package-lock.json

         - name: Install dependencies
           run: npm ci
           working-directory: docusaurus-physical-ai
         - name: Build website
           run: npm run build
           working-directory: docusaurus-physical-ai

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./docusaurus-physical-ai/build
             # The following lines assign commit authorship to the official
             # GH-Actions bot for deploys to `gh-pages` branch:
             # https://github.com/actions/checkout/issues/13#issuecomment-724415212
             # The GH actions bot is used by default if you didn't specify the two fields.
             # You can swap them with your own user credentials.
             user_name: github-actions[bot]
             user_email: 41898282+github-actions[bot]@users.noreply.github.com
   ```

### Option 2: Vercel (Free)

#### Steps:
1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your `docusaurus-physical-ai` directory and run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set the project name
   - Set the root directory to `docusaurus-physical-ai`
   - Build command: `npm run build`
   - Output directory: `build`
   - Root directory: `./`

4. Your site will be deployed and you'll receive a URL

#### Alternative: Connect your GitHub repository to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Create an account and connect your GitHub
3. Import your repository
4. Configure as follows:
   - Framework preset: Other
   - Build command: `cd docusaurus-physical-ai && npm run build`
   - Output directory: `docusaurus-physical-ai/build`
   - Root directory: `.`

### Option 3: Netlify (Free)

#### Steps:
1. Go to [netlify.com](https://netlify.com)
2. Create an account and click "Add new site"
3. Choose "Deploy with GitHub"
4. Select your repository
5. Configure the build settings:
   - Build command: `cd docusaurus-physical-ai && npm run build`
   - Publish directory: `docusaurus-physical-ai/build`
6. Click "Deploy site"

#### Alternative: Drag and drop
1. Build your site locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `docusaurus-physical-ai/build` folder to the Netlify dashboard

### Option 4: Self-Hosting

#### Using a Static Server:
Your built site is in the `docusaurus-physical-ai/build` directory and can be served as static files using:
- Apache HTTP Server
- Nginx
- Microsoft IIS
- Any other static file server

#### Example with a simple Node server:
1. Install serve: `npm install -g serve`
2. Navigate to the build directory: `cd docusaurus-physical-ai/build`
3. Serve the site: `serve`

## Additional Configuration Notes

### For GitHub Pages specifically:
If you want to host at `https://your-github-username.github.io/` (user site) instead of a project site, update your config:
```js
baseUrl: '/your-repo-name/',
```

### Environment-specific configuration:
You can also create a `.env` file in the root of the `docusaurus-physical-ai` directory:
```
DEPLOYMENT_ENV=production
```

## Troubleshooting

### Build Issues:
- Ensure all dependencies are installed: `npm install`
- Clear cache if needed: `npm run clear`
- Rebuild: `npm run build`

### Deployment Issues:
- Check that your `docusaurus.config.js` has correct URLs
- Ensure the build directory contains files after running `npm run build`
- Verify your hosting platform has access to the correct build directory

### Custom Domain:
To use a custom domain:
1. Add a `CNAME` file in the `static` directory with your domain name
2. Configure your DNS settings according to your hosting platform's instructions

## Updating Your Site

To update your hosted site:
1. Make changes to the source files
2. Run `npm run build` in the `docusaurus-physical-ai` directory
3. Deploy the updated build directory to your hosting platform
4. For GitHub Pages with the deploy script: `GIT_USER=your-github-username npm run deploy`

Your Physical AI textbook website is now ready for deployment! The site contains all 8 chapters with 40 lessons covering Physical AI and Humanoid Robotics.
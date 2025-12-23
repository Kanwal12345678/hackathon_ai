# Physical AI Textbook - Hosting Instructions

Your Physical AI & Humanoid Robotics textbook website is built with Docusaurus and ready for deployment. This project contains 8 comprehensive chapters with 40 lessons covering Physical AI concepts with a simulation-first approach.

## Quick Start

1. Navigate to the docusaurus directory:
   ```bash
   cd docusaurus-physical-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment Options

This project is ready for deployment to various hosting platforms:

- **GitHub Pages** (Free) - Ideal if your project is on GitHub
- **Vercel** (Free) - Great for frontend deployments
- **Netlify** (Free) - Simple drag-and-drop deployment
- **Self-hosting** - Deploy as static files to any web server

For detailed instructions on each hosting option, see the [HOSTING_GUIDE.md](./HOSTING_GUIDE.md) file.

## Configuration

Before deploying, update the following in `docusaurus.config.js`:
- Replace `your-github-username` with your actual GitHub username
- Update `organizationName` and `projectName` as needed
- Adjust the `url` to match your hosting domain
- For Vercel deployment, ensure `trailingSlash: false` is set
- For Vercel deployment, ensure `baseUrl: '/'` is set

## Vercel Deployment Specific Configuration

When deploying to Vercel, the following configuration is required to fix 404 errors:

1. **docusaurus.config.js**:
   - Set `url` to your Vercel domain (e.g., `https://your-project-name.vercel.app`)
   - Set `trailingSlash: false` to ensure proper routing
   - Ensure `baseUrl: '/'` for root domain deployment

2. **vercel.json** (created in project root):
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
   This file is required to handle client-side routing for Docusaurus on Vercel.

## Rollback Procedure

If the Vercel deployment causes issues, follow these rollback steps:

1. **Revert docusaurus.config.js changes**:
   - Restore the original `url` value
   - Remove or comment out the `trailingSlash: false` setting if causing issues
   - Ensure `baseUrl: '/'` remains set

2. **Remove vercel.json** (if created):
   - Delete the `vercel.json` file from the project root
   - This will revert to Vercel's default deployment behavior

3. **Redeploy with original configuration**:
   - Commit the reverted changes
   - Push to trigger a new deployment

## About This Textbook

This AI-native textbook teaches Physical AI with an emphasis on:
- Simulation-first learning approach
- AI collaboration in robotics
- Specification-driven design
- Hands-on exercises and practical applications

The content covers 8 comprehensive chapters with 5 lessons each, totaling 40 lessons that guide learners through Physical AI and Humanoid Robotics concepts.
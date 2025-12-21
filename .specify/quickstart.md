# Quickstart Guide: Physical AI Textbook

## Overview
This guide provides quick instructions for working with the Physical AI — AI-Native Textbook, which consists of 8 chapters with 5 lessons each (40 lessons total) in Docusaurus-compatible Markdown format.

## Project Structure
```
textbook_docs/
├── index.md (main table of contents)
├── chapter_1/ to chapter_8/ (8 chapter directories)
    └── lesson_X_Y_*.md (5 lessons per chapter)
```

## Getting Started

### 1. Setup Docusaurus Environment
```bash
# Install Docusaurus globally
npm install -g @docusaurus/init@latest

# Create new Docusaurus site
npx @docusaurus/init@latest --init-path ./physical-ai-textbook --type classic

# Copy textbook content
cp -r textbook_docs/* physical-ai-textbook/docs/
```

### 2. File Structure Navigation
- All lessons follow the naming pattern: `lesson_{chapter}_{lesson}_{topic}.md`
- Each chapter directory contains exactly 5 lessons
- The `index.md` file provides the main navigation structure

### 3. Content Format
Each lesson follows this structure:
```markdown
---
title: "Lesson Title"
sidebar_label: "Short Lesson Title"
description: "2-line summary of the lesson"
---

## Learning Objectives
- 3-5 bullet points

## Overview
Short intro paragraph

## Theory
Concept explanations

## Hands-On / Exercise
Step-by-step instructions (simulation-first)

## Summary
2-3 key takeaways

## References / Resources
Optional links
```

## Working with the Content

### Adding New Content
1. Place new lessons in the appropriate chapter directory
2. Follow the naming convention: `lesson_X_Y_description.md`
3. Include all required YAML frontmatter
4. Follow the standard lesson structure

### Modifying Existing Content
1. Locate the lesson file in the appropriate chapter directory
2. Edit content while maintaining the lesson structure
3. Ensure changes align with Physical AI constitution principles

### Validating Content
- Ensure all lessons follow the simulation-first approach
- Verify beginner-friendly language is maintained
- Confirm AI collaboration is emphasized
- Check that content aligns with target audience

## Deployment

### Local Development
```bash
cd physical-ai-textbook
npm start
```

### Build for Production
```bash
npm run build
```

### Docusaurus Configuration
Update `docusaurus.config.js` to include the textbook_docs directory in the docs plugin configuration.

## Best Practices

### Content Creation
- Maintain beginner-friendly language throughout
- Emphasize simulation-first learning
- Include AI agent collaboration in exercises
- Follow progressive skill building approach
- Ensure content aligns with Physical AI constitution

### File Management
- Use descriptive but concise file names
- Maintain consistent directory structure
- Keep content modular for RAG indexing
- Use proper YAML frontmatter in all files

## Troubleshooting

### Common Issues
- Missing YAML frontmatter in lesson files
- Incorrect file naming conventions
- Broken navigation links
- Non-Docusaurus compatible Markdown syntax

### Validation Checklist
- [ ] All 40 lessons present and accessible
- [ ] Navigation works correctly
- [ ] All content follows required structure
- [ ] Content aligns with Physical AI principles
- [ ] Beginner-friendly language maintained
---
id: phr-1703344715
stage: green
title: Textbook Chapters Component
created: 2025-12-23
tags: [react, docusaurus, tailwind, ui, component, textbook]
---

# Textbook Chapters Component

## Prompt

```
You are a senior UI/UX designer and frontend engineer.

I want to build a "Textbook Chapters" section for an Physical AI & AI Native website.

UI Structure (very important):
1. Main heading at top center:
   "Textbook Chapters"
   - Large, bold
   - Pink → Purple gradient text
   - Subtle glow effect

2. Sub-heading under the main heading:
   "8 comprehensive modules covering Physical AI & AI Native"
   - Smaller text
   - Light muted color
   - Clean spacing

3. Below this, create a responsive grid of 8 chapter cards.

Each chapter card design:
- Dark glassmorphism style card
- Rounded corners
- Subtle gradient border (pink / purple / blue variation)
- Soft glow on hover
- Clean modern look

Each card must include:
- Small icon at top (emoji or lucide icon)
- Chapter title (bold)
- Short description (2–3 lines max)
- "Read Chapter →" button at bottom

Chapter content (use exactly these 8):

1. Textbook Overview
   Description: Course introduction, modules, hardware requirements, and learning objectives.

2. Module 1: Humanoid Fundamentals
   Description: Robot anatomy, kinematics, dynamics, stability con

3. Module 2: ROS 2 System
   Description: ROS 2 architecture, nodes, topics, URDF, and Python integration.

4. Module 3: Digital Twins
   Description: Gazebo simulation, Unity, HIL, sensor simulation, and physics modeling.

5. Module 4: Perception & Vision
   Description: Cameras, LiDAR, depth sensing, SLAM, and computer vision.

6. Module 5: Control Systems
   Description: PID control, model predictive control, and motion planning.

7. Module 6: Learning & AI
   Description: Reinforcement learning, imitation learning, and policy optimization.

8. Module 7: Real-World Deployment
   Description: Hardware integration,

Design & theme:
- Dark background
- Pink & purple accent colors
- Futuristic AI / robotics feel
- Premium textbook-style UI

Technical requirements:
- React (Docusaurus compatible)
- Tailwind CSS
- Fully responsive (desktop + mobile)
- Clean semantic JSX
- Hover animations
- No paid assets

Please:
- Build the complete UI section
- Provide full JSX + Tailwind code
- Include gradient text + glow effects
- Make it production ready

Do not explain basics. Just implement clean, modern UI.
```

## Response

Successfully implemented the Textbook Chapters component with all requested features:

- Created a responsive grid of 8 module cards with glassmorphism design
- Implemented gradient text for the main heading ("Textbook Chapters")
- Added subtle glow effects and hover animations
- Used appropriate emoji icons for each module
- Created a dark-themed UI with pink/purple accent colors
- Made the component fully responsive across all device sizes
- Included "Read Chapter →" buttons with hover effects
- Added proper Tailwind configuration for Docusaurus compatibility
- Created sample pages to demonstrate usage in Docusaurus
- Component is production-ready and follows best practices

Modules implemented:
1. Textbook Overview - Course introduction, modules, hardware requirements, and learning objectives
2. Module 1: Humanoid Fundamentals - Robot anatomy, kinematics, dynamics, stability control
3. Module 2: ROS 2 System - ROS 2 architecture, nodes, topics, URDF, and Python integration
4. Module 3: Digital Twins - Gazebo simulation, Unity, HIL, sensor simulation, and physics modeling
5. Module 4: Perception & Vision - Cameras, LiDAR, depth sensing, SLAM, and computer vision
6. Module 5: Control Systems - PID control, model predictive control, and motion planning
7. Module 6: Learning & AI - Reinforcement learning, imitation learning, and policy optimization
8. Module 7: Real-World Deployment - Hardware integration, deployment strategies, and field testing

Files created:
- `src/components/TextbookChapters/TextbookChapters.jsx` - Main React component
- `src/components/TextbookChapters/README.md` - Documentation
- `src/pages/textbook-chapters.js` - Sample page
- `docs/textbook-chapters.md` - Sample documentation page
- `tailwind.config.js` - Tailwind configuration

The component has been successfully tested and is running on the development server at http://localhost:3003/
import React from 'react';
import styles from './TextbookChapters.module.css';

const TextbookChapters = () => {

  const chapters = [
    {
      id: 1,
      title: "Chapter 1: Introduction to Physical AI",
      description: "Fundamentals of Physical AI, history, evolution, applications, and setting up development environment.",
      icon: "🤖"
    },
    {
      id: 2,
      title: "Chapter 2: Specification-Driven Design",
      description: "Principles of specification-first thinking, writing clear system specifications, validation techniques, and collaborative development.",
      icon: "📝"
    },
    {
      id: 3,
      title: "Chapter 3: Simulation Environments",
      description: "Introduction to simulation platforms, building basic environments, physics modeling, and optimization techniques.",
      icon: "🎮"
    },
    {
      id: 4,
      title: "Chapter 4: AI Agent Collaboration",
      description: "Understanding AI agent capabilities, designing human-AI collaboration workflows, prompt engineering, and evaluation techniques.",
      icon: "🤝"
    },
    {
      id: 5,
      title: "Chapter 5: Basic Movement and Control",
      description: "Fundamentals of movement control, simple motion planning, control systems with feedback, and path planning algorithms.",
      icon: "🏃"
    },
    {
      id: 6,
      title: "Chapter 6: Sensor Integration and Perception",
      description: "Introduction to sensor types, sensor data processing, perception systems, sensor fusion techniques, and decision making.",
      icon: "📡"
    },
    {
      id: 7,
      title: "Chapter 7: Advanced Physical AI Systems",
      description: "Complex system architecture, multi-agent physical systems, learning and adaptation, safety, and performance optimization.",
      icon: "⚙️"
    },
    {
      id: 8,
      title: "Chapter 8: Deployment and Real-World Applications",
      description: "Transitioning from simulation to reality, hardware integration, real-world testing strategies, and deployment best practices.",
      icon: "🚀"
    }
  ];


  return (
    <section className={styles['textbook-chapters-section']}>
      <div className={styles['textbook-chapters-container']}>
        {/* Main Heading */}
        <div className={styles['textbook-chapters-heading']}>
          <h2 className={styles['textbook-chapters-title']}>
            Textbook Chapters
          </h2>
          <p className={styles['textbook-chapters-subtitle']}>
            8 comprehensive modules covering Physical AI & AI Native
          </p>
        </div>

        {/* Chapter Cards Grid */}
        <div className={styles['chapters-grid']}>
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={styles['chapter-card']}
            >
              {/* Gradient Border Effect on Hover */}
              <div className={styles['chapter-card-gradient']} />
              <div className={styles['chapter-card-gradient-base']} />

              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={styles['chapter-icon']}>
                  {chapter.icon}
                </div>

                {/* Title */}
                <h3 className={styles['chapter-title']}>
                  {chapter.title}
                </h3>

                {/* Description */}
                <p className={styles['chapter-description']}>
                  {chapter.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TextbookChapters;
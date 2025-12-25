import React from 'react';
import clsx from 'clsx';
import styles from './TextbookChapters.module.css';

// Chapter data
const chapters = [
  {
    id: 1,
    title: 'Chapter 1: Introduction to Physical AI',
    description: 'Overview of Physical AI concepts, goals, and real-world relevance.',
    icon: '🤖'
  },
  {
    id: 2,
    title: 'Chapter 2: Specification-Driven Design',
    description: 'Designing Physical AI systems using clear specifications and constraints.',
    icon: '📝'
  },
  {
    id: 3,
    title: 'Chapter 3: Simulation Environments',
    description: 'Creating and using simulation environments for Physical AI development and testing.',
    icon: '🎮'
  },
  {
    id: 4,
    title: 'Chapter 4: AI Agent Collaboration',
    description: 'Working with AI agents as co-creators in developing Physical AI systems.',
    icon: '🤝'
  },
  {
    id: 5,
    title: 'Chapter 5: Basic Movement and Control',
    description: 'Fundamentals of movement control, kinematics, and dynamics for Physical AI systems.',
    icon: '🏃'
  },
  {
    id: 6,
    title: 'Chapter 6: Sensor Integration and Perception',
    description: 'Integrating sensors and developing perception systems for environment understanding.',
    icon: '📡'
  },
  {
    id: 7,
    title: 'Chapter 7: Advanced Physical AI Systems',
    description: 'Advanced architectures, autonomy, and intelligent system behaviors.',
    icon: '⚙️'
  },
  {
    id: 8,
    title: 'Chapter 8: Deployment and Real-World Applications',
    description: 'Deployment strategies, testing in real environments, and applications.',
    icon: '🚀'
  }
];

function ChapterCard({ chapter }) {
  return (
    <div className={clsx('col col--3', styles.chapterCard)}>
      <div className={styles.cardContent}>
        <div className={styles.icon}>{chapter.icon}</div>
        <h3 className={styles.chapterTitle}>{chapter.title}</h3>
        <p className={styles.chapterDescription}>{chapter.description}</p>
      </div>
    </div>
  );
}

export default function TextbookChapters() {
  return (
    <section className={styles.textbookChapters}>
      <div className="container">
        <div className="text--center padding-horiz--md">
          <h2 className={styles.mainHeading}>
            <span className={styles.gradientText}>Textbook Chapters</span>
          </h2>
          <p className={styles.subHeading}>8 comprehensive modules covering Physical AI & AI Native textbook</p>
        </div>
        <div className="row">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </section>
  );
}
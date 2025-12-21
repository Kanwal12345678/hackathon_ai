import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Specification-First Thinking',
    description: (
      <>
        Learn to design Physical AI systems with clear, detailed specifications before implementation.
      </>
    ),
  },
  {
    title: 'Simulation-First Learning',
    description: (
      <>
        Master Physical AI concepts through hands-on simulation exercises before hardware deployment.
      </>
    ),
  },
  {
    title: 'AI Collaboration',
    description: (
      <>
        Work with AI agents as co-creators in developing Physical AI systems.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

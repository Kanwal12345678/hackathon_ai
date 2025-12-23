import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

// Import Docusaurus default SVG images
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocusaurusSvg from '@site/static/img/undraw_docusaurus_mountain.svg';
import ReactSvg from '@site/static/img/undraw_docusaurus_react.svg';
import TreeSvg from '@site/static/img/undraw_docusaurus_tree.svg';

const FeatureList = [
  {
    title: 'Specification-First Thinking',
    description: (
      <>
        Learn to design Physical AI systems with clear, detailed specifications before implementation.
      </>
    ),
    Svg: DocusaurusSvg,
  },
  {
    title: 'Simulation-First Learning',
    description: (
      <>
        Master Physical AI concepts through hands-on simulation exercises before hardware deployment.
      </>
    ),
    Svg: ReactSvg,
  },
  {
    title: 'AI Collaboration',
    description: (
      <>
        Work with AI agents as co-creators in developing Physical AI systems.
      </>
    ),
    Svg: TreeSvg,
  },
];

function Feature({title, description, Svg}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('feature-card', 'text--center padding-horiz--md')}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
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

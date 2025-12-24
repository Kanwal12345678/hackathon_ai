import React from 'react';
import DocPage from '@theme-original/DocPage';
import styles from './styles.module.css';

export default function DocPageWrapper(props) {
  return (
    <div className={styles.docPage}>
      <div className={styles.docPageContainer}>
        <DocPage {...props} />
      </div>
    </div>
  );
}
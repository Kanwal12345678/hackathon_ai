import React from 'react';
import DocItem from '@theme-original/DocItem';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocItemWrapper(props) {
  return (
    <div className={styles.docContent}>
      <DocItem {...props} />
    </div>
  );
}
import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import MobileTextbookHandler from '@site/src/components/MobileTextbookHandler';

export default function Layout(props) {
  return (
    <>
      <MobileTextbookHandler />
      <OriginalLayout {...props} />
    </>
  );
}
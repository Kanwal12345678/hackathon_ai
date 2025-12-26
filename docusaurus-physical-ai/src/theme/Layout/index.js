import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import MobileTextbookHandler from '@site/src/components/MobileTextbookHandler';
import SmoothScrollHandler from '@site/src/components/SmoothScrollHandler';

export default function Layout(props) {
  return (
    <>
      <MobileTextbookHandler />
      <SmoothScrollHandler />
      <OriginalLayout {...props} />
    </>
  );
}
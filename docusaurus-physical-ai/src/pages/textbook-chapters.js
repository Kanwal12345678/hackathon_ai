import React from 'react';
import TextbookChapters from '../components/TextbookChapters/TextbookChapters';
import Layout from '@theme/Layout';

const TextbookChaptersPage = () => {
  return (
    <Layout title="Textbook Chapters" description="Physical AI & AI Native Textbook Chapters">
      <TextbookChapters />
    </Layout>
  );
};

export default TextbookChaptersPage;
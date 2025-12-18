import React, { useState } from 'react';
import { GeneratorForm } from '../../components/textbook-generator/generator-form';
import { TextbookPreview } from '../../components/textbook-generator/textbook-preview';

export const TextbookGenerator: React.FC = () => {
  const [currentView, setCurrentView] = useState<'form' | 'preview'>('form');
  const [generatedTextbookId, setGeneratedTextbookId] = useState<string | null>(null);

  const handleGenerationStart = (requestId: string) => {
    console.log('Generation started with ID:', requestId);
    // Optionally update UI to show generation is in progress
  };

  const handleGenerationComplete = (textbookId: string) => {
    setGeneratedTextbookId(textbookId);
    setCurrentView('preview');
  };

  const handleExport = (format: 'pdf' | 'epub' | 'html') => {
    alert(`Exporting textbook as ${format.toUpperCase()}. This would trigger the actual export in a real implementation.`);
  };

  return (
    <div className="textbook-generator">
      <h2>AI-Powered Textbook Generation</h2>

      {currentView === 'form' && (
        <GeneratorForm
          onGenerationStart={handleGenerationStart}
          onGenerationComplete={handleGenerationComplete}
        />
      )}

      {currentView === 'preview' && generatedTextbookId && (
        <TextbookPreview
          textbookId={generatedTextbookId}
          onExport={handleExport}
        />
      )}

      {currentView === 'form' && (
        <div className="info-section">
          <h3>About This Tool</h3>
          <p>
            This AI-powered textbook generator creates comprehensive textbooks on Physical AI & Humanoid Robotics
            based on your specifications. The system will generate chapters, sections, exercises, and summaries
            tailored to your chosen educational level and language.
          </p>
          <p>
            Simply fill out the form with your requirements and our AI will generate a complete textbook for you.
          </p>
        </div>
      )}
    </div>
  );
};
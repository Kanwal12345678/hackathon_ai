import React, { useState, useEffect } from 'react';
import { textbookApiService, TextbookDetailsResponse } from '../../services/textbook-api';

interface TextbookPreviewProps {
  textbookId: string;
  onExport?: (format: 'pdf' | 'epub' | 'html') => void;
}

export const TextbookPreview: React.FC<TextbookPreviewProps> = ({ textbookId, onExport }) => {
  const [textbook, setTextbook] = useState<TextbookDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  useEffect(() => {
    const fetchTextbook = async () => {
      try {
        setLoading(true);
        const response = await textbookApiService.getTextbookDetails(textbookId);
        setTextbook(response.data);

        // Auto-expand the first chapter if available
        if (response.data.content?.chapters && response.data.content.chapters.length > 0) {
          setActiveChapter(0);
        }
      } catch (err) {
        setError('Failed to load textbook. Please try again.');
        console.error('Error fetching textbook:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTextbook();

    // Set up polling to check for updates if the textbook is still generating
    const pollInterval = setInterval(async () => {
      if (textbook && (textbook.status === 'generating' || textbook.status === 'draft')) {
        try {
          const response = await textbookApiService.getTextbookDetails(textbookId);
          setTextbook(response.data);

          // If the status changed to completed, stop polling
          if (response.data.status === 'complete') {
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error('Error polling textbook status:', err);
        }
      } else {
        // If the textbook is complete or failed, stop polling
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    // Clean up interval on unmount
    return () => clearInterval(pollInterval);
  }, [textbookId]);

  const toggleChapter = (index: number) => {
    setActiveChapter(activeChapter === index ? null : index);
  };

  const handleExport = (format: 'pdf' | 'epub' | 'html') => {
    if (onExport) {
      onExport(format);
    }
  };

  if (loading) {
    return (
      <div className="textbook-preview loading">
        <h2>Loading textbook...</h2>
        <p>Fetching the latest status of your textbook generation.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="textbook-preview error">
        <h2>Error Loading Textbook</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!textbook) {
    return (
      <div className="textbook-preview empty">
        <h2>No Textbook Found</h2>
        <p>The requested textbook could not be found.</p>
      </div>
    );
  }

  return (
    <div className="textbook-preview">
      <div className="preview-header">
        <h2>{textbook.title}</h2>
        <div className={`status-badge status-${textbook.status}`}>
          Status: <span className="status-text">{textbook.status}</span>
        </div>
        {textbook.progress !== undefined && textbook.progress < 100 && (
          <div className="progress-info">
            Progress: {textbook.progress}%
          </div>
        )}
      </div>

      <div className="preview-content">
        {textbook.content?.chapters && textbook.content.chapters.length > 0 ? (
          <div className="chapters-container">
            <h3>Table of Contents</h3>
            <ul className="chapter-list">
              {textbook.content.chapters.map((chapter, index) => (
                <li key={chapter.id} className="chapter-item">
                  <button
                    className={`chapter-title ${activeChapter === index ? 'active' : ''}`}
                    onClick={() => toggleChapter(index)}
                  >
                    Chapter {chapter.order}: {chapter.title}
                    {chapter.exercises && chapter.exercises.length > 0 && (
                      <span className="exercise-indicator"> ({chapter.exercises.length} exercises)</span>
                    )}
                  </button>

                  {activeChapter === index && (
                    <div className="chapter-content">
                      <div className="chapter-body">
                        <div
                          className="chapter-text"
                          dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\n/g, '<br />') }}
                        />
                      </div>

                      {chapter.learningObjectives && chapter.learningObjectives.length > 0 && (
                        <div className="learning-objectives">
                          <h4>Learning Objectives:</h4>
                          <ul>
                            {chapter.learningObjectives.map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {chapter.exercises && chapter.exercises.length > 0 && (
                        <div className="exercises-section">
                          <h4>Exercises:</h4>
                          <div className="exercises-list">
                            {chapter.exercises.map((exercise, exIdx) => (
                              <div key={exercise.id} className="exercise-item">
                                <p><strong>{exIdx + 1}. {exercise.question}</strong></p>
                                <div className="exercise-options">
                                  {exercise.options.map((option, optIdx) => (
                                    <div key={optIdx} className="option">
                                      <label>
                                        <input
                                          type="radio"
                                          name={`exercise-${exercise.id}`}
                                          value={option}
                                        />
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <details className="exercise-explanation">
                                  <summary>Explanation</summary>
                                  <p>{exercise.explanation}</p>
                                </details>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {chapter.summary && (
                        <div className="chapter-summary">
                          <h4>Summary:</h4>
                          <p>{chapter.summary}</p>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="no-content">
            <p>No content available yet. The textbook is still being generated.</p>
          </div>
        )}
      </div>

      <div className="preview-actions">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button
            onClick={() => handleExport('pdf')}
            disabled={textbook.status !== 'complete'}
            className="export-btn pdf"
          >
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('epub')}
            disabled={textbook.status !== 'complete'}
            className="export-btn epub"
          >
            Export as ePub
          </button>
          <button
            onClick={() => handleExport('html')}
            disabled={textbook.status !== 'complete'}
            className="export-btn html"
          >
            Export as HTML
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextbookPreview;
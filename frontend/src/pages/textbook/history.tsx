import React, { useState, useEffect } from 'react';
import { textbookApiService, TextbookDetailsResponse } from '../../services/textbook-api';

const TextbookHistory: React.FC = () => {
  const [textbooks, setTextbooks] = useState<TextbookDetailsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTextbookHistory = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would fetch the user's textbook generation history
        // For now, we'll simulate this with mock data
        const mockTextbooks: TextbookDetailsResponse[] = [
          {
            id: '1',
            title: 'Introduction to Physical AI',
            status: 'complete',
            progress: 100,
            createdAt: '2023-12-01T10:00:00Z',
            updatedAt: '2023-12-01T11:30:00Z',
            generatedAt: '2023-12-01T11:30:00Z',
          },
          {
            id: '2',
            title: 'Humanoid Robotics Fundamentals',
            status: 'complete',
            progress: 100,
            createdAt: '2023-11-28T09:15:00Z',
            updatedAt: '2023-11-28T10:45:00Z',
            generatedAt: '2023-11-28T10:45:00Z',
          },
          {
            id: '3',
            title: 'Advanced Sensorimotor Learning',
            status: 'generating',
            progress: 65,
            createdAt: '2023-12-02T14:20:00Z',
            updatedAt: '2023-12-02T15:10:00Z',
          },
        ];

        setTextbooks(mockTextbooks);
      } catch (err) {
        setError('Failed to load textbook history. Please try again.');
        console.error('Error fetching textbook history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTextbookHistory();
  }, []);

  if (loading) {
    return (
      <div className="textbook-history">
        <h2>Textbook Generation History</h2>
        <p>Loading your textbook generation history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="textbook-history">
        <h2>Textbook Generation History</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="textbook-history">
      <h2>Textbook Generation History</h2>

      {textbooks.length === 0 ? (
        <p>You haven't generated any textbooks yet. <a href="/">Start creating one now!</a></p>
      ) : (
        <div className="history-list">
          {textbooks.map((textbook) => (
            <div key={textbook.id} className="history-item">
              <div className="history-item-header">
                <h3>{textbook.title}</h3>
                <span className={`status-badge status-${textbook.status}`}>
                  {textbook.status.charAt(0).toUpperCase() + textbook.status.slice(1)}
                </span>
              </div>

              <div className="history-item-details">
                <p><strong>Created:</strong> {new Date(textbook.createdAt).toLocaleDateString()}</p>
                {textbook.generatedAt && (
                  <p><strong>Generated:</strong> {new Date(textbook.generatedAt).toLocaleDateString()}</p>
                )}

                {textbook.progress !== undefined && textbook.progress < 100 && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${textbook.progress}%` }}
                      ></div>
                    </div>
                    <span>{textbook.progress}% Complete</span>
                  </div>
                )}
              </div>

              <div className="history-item-actions">
                <button className="btn btn-primary">View</button>
                <button className="btn btn-secondary">Export</button>
                <button className="btn btn-outline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextbookHistory;
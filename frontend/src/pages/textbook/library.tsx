import React, { useState, useEffect } from 'react';

interface TextbookItem {
  id: string;
  title: string;
  subject: string;
  educationalLevel: string;
  language: string;
  createdAt: string;
  lastAccessed: string;
  chapterCount: number;
  exerciseCount: number;
}

const TextbookLibrary: React.FC = () => {
  const [textbooks, setTextbooks] = useState<TextbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    // Simulate loading textbooks
    setTimeout(() => {
      const mockTextbooks: TextbookItem[] = [
        {
          id: '1',
          title: 'Introduction to Physical AI',
          subject: 'Physical AI & Humanoid Robotics',
          educationalLevel: 'beginner',
          language: 'en',
          createdAt: '2023-12-01',
          lastAccessed: '2023-12-10',
          chapterCount: 10,
          exerciseCount: 50
        },
        {
          id: '2',
          title: 'Humanoid Robotics Fundamentals',
          subject: 'Physical AI & Humanoid Robotics',
          educationalLevel: 'intermediate',
          language: 'en',
          createdAt: '2023-11-28',
          lastAccessed: '2023-12-05',
          chapterCount: 12,
          exerciseCount: 72
        },
        {
          id: '3',
          title: 'Advanced Sensorimotor Learning',
          subject: 'Physical AI & Humanoid Robotics',
          educationalLevel: 'advanced',
          language: 'ur',
          createdAt: '2023-12-02',
          lastAccessed: '2023-12-12',
          chapterCount: 8,
          exerciseCount: 32
        },
        {
          id: '4',
          title: 'Embodied Cognition in AI',
          subject: 'Physical AI & Humanoid Robotics',
          educationalLevel: 'intermediate',
          language: 'en',
          createdAt: '2023-11-15',
          lastAccessed: '2023-11-30',
          chapterCount: 15,
          exerciseCount: 90
        }
      ];

      setTextbooks(mockTextbooks);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTextbooks = textbooks.filter(textbook => {
    const matchesSearch = textbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         textbook.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || textbook.subject.includes(filterSubject);
    const matchesLevel = filterLevel === 'all' || textbook.educationalLevel === filterLevel;

    return matchesSearch && matchesSubject && matchesLevel;
  });

  if (loading) {
    return (
      <div className="textbook-library">
        <h2>Textbook Library</h2>
        <p>Loading your textbook library...</p>
      </div>
    );
  }

  return (
    <div className="textbook-library">
      <h2>Textbook Library</h2>

      <div className="library-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search textbooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="Physical AI & Humanoid Robotics">Physical AI & Humanoid Robotics</option>
            <option value="Robotics">Robotics</option>
            <option value="AI">AI</option>
          </select>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {filteredTextbooks.length === 0 ? (
        <p>No textbooks found. Try adjusting your search or filters.</p>
      ) : (
        <div className="library-grid">
          {filteredTextbooks.map(textbook => (
            <div key={textbook.id} className="library-item">
              <div className="library-item-header">
                <h3>{textbook.title}</h3>
                <span className={`level-badge level-${textbook.educationalLevel}`}>
                  {textbook.educationalLevel}
                </span>
              </div>

              <div className="library-item-details">
                <p><strong>Subject:</strong> {textbook.subject}</p>
                <p><strong>Language:</strong> {textbook.language.toUpperCase()}</p>
                <p><strong>Chapters:</strong> {textbook.chapterCount}</p>
                <p><strong>Exercises:</strong> {textbook.exerciseCount}</p>
                <p><strong>Created:</strong> {textbook.createdAt}</p>
              </div>

              <div className="library-item-actions">
                <button className="btn btn-primary">View</button>
                <button className="btn btn-secondary">Export</button>
                <button className="btn btn-outline">Share</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextbookLibrary;
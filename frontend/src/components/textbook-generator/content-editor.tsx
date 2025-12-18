import React, { useState } from 'react';

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  learningObjectives: string[];
  exercises: Exercise[];
  summary: string;
}

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ContentEditorProps {
  textbookId: string;
  initialChapters: Chapter[];
  onSave: (updatedChapters: Chapter[]) => void;
  onCancel: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  textbookId,
  initialChapters,
  onSave,
  onCancel
}) => {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleChapterChange = (index: number, field: keyof Chapter, value: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    };
    setChapters(updatedChapters);
  };

  const handleExerciseChange = (
    chapterIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    const updatedChapters = [...chapters];
    const updatedExercises = [...updatedChapters[chapterIndex].exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value
    };
    updatedChapters[chapterIndex].exercises = updatedExercises;
    setChapters(updatedChapters);
  };

  const addExercise = (chapterIndex: number) => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'medium'
    };

    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].exercises = [
      ...updatedChapters[chapterIndex].exercises,
      newExercise
    ];
    setChapters(updatedChapters);
  };

  const removeExercise = (chapterIndex: number, exerciseIndex: number) => {
    const updatedChapters = [...chapters];
    const updatedExercises = [...updatedChapters[chapterIndex].exercises];
    updatedExercises.splice(exerciseIndex, 1);
    updatedChapters[chapterIndex].exercises = updatedExercises;
    setChapters(updatedChapters);
  };

  const addLearningObjective = (chapterIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].learningObjectives = [
      ...updatedChapters[chapterIndex].learningObjectives,
      ''
    ];
    setChapters(updatedChapters);
  };

  const removeLearningObjective = (chapterIndex: number, objectiveIndex: number) => {
    const updatedChapters = [...chapters];
    const updatedObjectives = [...updatedChapters[chapterIndex].learningObjectives];
    updatedObjectives.splice(objectiveIndex, 1);
    updatedChapters[chapterIndex].learningObjectives = updatedObjectives;
    setChapters(updatedChapters);
  };

  const updateLearningObjective = (chapterIndex: number, objectiveIndex: number, value: string) => {
    const updatedChapters = [...chapters];
    const updatedObjectives = [...updatedChapters[chapterIndex].learningObjectives];
    updatedObjectives[objectiveIndex] = value;
    updatedChapters[chapterIndex].learningObjectives = updatedObjectives;
    setChapters(updatedChapters);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(chapters);
    } catch (error) {
      console.error('Error saving textbook:', error);
      alert('Failed to save textbook. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentChapter = chapters[activeChapterIndex];

  return (
    <div className="content-editor">
      <div className="editor-header">
        <h2>Textbook Editor</h2>
        <div className="editor-actions">
          <button onClick={onCancel} className="btn btn-outline" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="chapter-selector">
          <h3>Chapters</h3>
          <ul>
            {chapters.map((chapter, index) => (
              <li
                key={chapter.id}
                className={`chapter-item ${index === activeChapterIndex ? 'active' : ''}`}
                onClick={() => setActiveChapterIndex(index)}
              >
                Chapter {chapter.order}: {chapter.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="chapter-editor">
          {currentChapter && (
            <>
              <div className="form-group">
                <label htmlFor="chapter-title">Chapter Title</label>
                <input
                  id="chapter-title"
                  value={currentChapter.title}
                  onChange={(e) => handleChapterChange(activeChapterIndex, 'title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="chapter-content">Chapter Content</label>
                <textarea
                  id="chapter-content"
                  value={currentChapter.content}
                  onChange={(e) => handleChapterChange(activeChapterIndex, 'content', e.target.value)}
                  rows={15}
                />
              </div>

              <div className="form-group">
                <label>Learning Objectives</label>
                {currentChapter.learningObjectives.map((objective, idx) => (
                  <div key={idx} className="objective-input">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(activeChapterIndex, idx, e.target.value)}
                      placeholder={`Learning objective ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeLearningObjective(activeChapterIndex, idx)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLearningObjective(activeChapterIndex)}
                  className="add-btn"
                >
                  Add Objective
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="chapter-summary">Chapter Summary</label>
                <textarea
                  id="chapter-summary"
                  value={currentChapter.summary}
                  onChange={(e) => handleChapterChange(activeChapterIndex, 'summary', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="exercises-section">
                <h4>Exercises</h4>
                {currentChapter.exercises.map((exercise, exIdx) => (
                  <div key={exercise.id} className="exercise-editor">
                    <div className="form-group">
                      <label>Question {exIdx + 1}</label>
                      <textarea
                        value={exercise.question}
                        onChange={(e) => handleExerciseChange(activeChapterIndex, exIdx, 'question', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label>Options</label>
                      {exercise.options.map((option, optIdx) => (
                        <div key={optIdx} className="option-input">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...exercise.options];
                              updatedOptions[optIdx] = e.target.value;
                              handleExerciseChange(activeChapterIndex, exIdx, 'options', updatedOptions);
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label>Correct Answer</label>
                      <select
                        value={exercise.correctAnswer}
                        onChange={(e) => handleExerciseChange(activeChapterIndex, exIdx, 'correctAnswer', e.target.value)}
                      >
                        {exercise.options.map((_, idx) => (
                          <option key={idx} value={exercise.options[idx]}>
                            {String.fromCharCode(65 + idx)}. {exercise.options[idx]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Explanation</label>
                      <textarea
                        value={exercise.explanation}
                        onChange={(e) => handleExerciseChange(activeChapterIndex, exIdx, 'explanation', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label>Difficulty</label>
                      <select
                        value={exercise.difficulty}
                        onChange={(e) => handleExerciseChange(activeChapterIndex, exIdx, 'difficulty', e.target.value as any)}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExercise(activeChapterIndex, exIdx)}
                      className="remove-exercise-btn"
                    >
                      Remove Exercise
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addExercise(activeChapterIndex)}
                  className="add-exercise-btn"
                >
                  Add Exercise
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
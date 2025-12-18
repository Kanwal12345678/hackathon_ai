import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { textbookApiService, TextbookGenerationRequest } from '../../services/textbook-api';

interface GeneratorFormProps {
  onGenerationStart?: (requestId: string) => void;
  onGenerationComplete?: (textbookId: string) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerationStart,
  onGenerationComplete
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<TextbookGenerationRequest>({
    defaultValues: {
      title: '',
      description: '',
      subject: 'Physical AI & Humanoid Robotics',
      educationalLevel: 'beginner',
      language: 'en',
      topicOutline: '',
      learningObjectives: [''],
      chapterCount: 10,
      includeExercises: true
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Watch for changes to learning objectives to manage dynamic fields
  const learningObjectives = watch('learningObjectives');

  const addLearningObjective = () => {
    const currentObjectives = watch('learningObjectives');
    setValue('learningObjectives', [...currentObjectives, '']);
  };

  const removeLearningObjective = (index: number) => {
    const currentObjectives = watch('learningObjectives');
    if (currentObjectives.length > 1) {
      const newObjectives = [...currentObjectives];
      newObjectives.splice(index, 1);
      setValue('learningObjectives', newObjectives);
    }
  };

  const updateLearningObjective = (index: number, value: string) => {
    const currentObjectives = watch('learningObjectives');
    const newObjectives = [...currentObjectives];
    newObjectives[index] = value;
    setValue('learningObjectives', newObjectives);
  };

  const onSubmit = async (data: TextbookGenerationRequest) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await textbookApiService.generateTextbook(data);

      if (onGenerationStart) {
        onGenerationStart(response.data.id);
      }

      // Simulate progress updates (in a real app, you'd poll the API for actual progress)
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Check if generation completed
      const detailsResponse = await textbookApiService.getTextbookDetails(response.data.id);

      if (detailsResponse.data.status === 'complete' && onGenerationComplete) {
        onGenerationComplete(response.data.id);
      }
    } catch (error: any) {
      console.error('Error generating textbook:', error);
      setGenerationError(error.message || 'Failed to generate textbook. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="generator-form">
      <h2>Generate Custom Textbook</h2>

      {generationError && (
        <div className="error-message">
          <p>{generationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="title">Textbook Title *</label>
          <input
            id="title"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 200, message: 'Title must be less than 200 characters' }
            })}
            placeholder="Enter textbook title"
            disabled={isGenerating}
          />
          {errors.title && <span className="error">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description', { maxLength: 1000 })}
            placeholder="Brief description of the textbook"
            disabled={isGenerating}
            rows={3}
          />
          {errors.description && <span className="error">{errors.description.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            {...register('subject', {
              required: 'Subject is required'
            })}
            defaultValue="Physical AI & Humanoid Robotics"
            disabled={isGenerating}
          />
          {errors.subject && <span className="error">{errors.subject.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="educationalLevel">Educational Level *</label>
            <select
              id="educationalLevel"
              {...register('educationalLevel', { required: 'Educational level is required' })}
              disabled={isGenerating}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.educationalLevel && <span className="error">{errors.educationalLevel.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="language">Language *</label>
            <select
              id="language"
              {...register('language', { required: 'Language is required' })}
              disabled={isGenerating}
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
            {errors.language && <span className="error">{errors.language.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="chapterCount">Number of Chapters</label>
            <input
              id="chapterCount"
              type="number"
              min="1"
              max="50"
              {...register('chapterCount', {
                required: 'Chapter count is required',
                min: { value: 1, message: 'Must have at least 1 chapter' },
                max: { value: 50, message: 'Maximum 50 chapters allowed' }
              })}
              disabled={isGenerating}
            />
            {errors.chapterCount && <span className="error">{errors.chapterCount.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="topicOutline">Topic Outline *</label>
          <textarea
            id="topicOutline"
            {...register('topicOutline', {
              required: 'Topic outline is required',
              minLength: { value: 10, message: 'Topic outline must be at least 10 characters' }
            })}
            placeholder="Provide a detailed outline of the topics to be covered..."
            disabled={isGenerating}
            rows={6}
          />
          {errors.topicOutline && <span className="error">{errors.topicOutline.message}</span>}
        </div>

        <div className="form-group">
          <label>Learning Objectives *</label>
          {learningObjectives.map((objective, index) => (
            <div key={index} className="objective-input">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateLearningObjective(index, e.target.value)}
                placeholder={`Learning objective ${index + 1}`}
                disabled={isGenerating}
              />
              {learningObjectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLearningObjective(index)}
                  className="remove-btn"
                  disabled={isGenerating}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLearningObjective}
            className="add-btn"
            disabled={isGenerating}
          >
            Add Objective
          </button>
          {errors.learningObjectives && <span className="error">{errors.learningObjectives.message}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              {...register('includeExercises')}
              disabled={isGenerating}
            />
            Include Exercises
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? `Generating... ${progress}%` : 'Generate Textbook'}
          </button>
        </div>

        {isGenerating && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>Generating your textbook. This may take a few minutes...</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneratorForm;
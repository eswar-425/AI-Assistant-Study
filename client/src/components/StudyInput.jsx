import React, { useState } from 'react';
import { LightbulbIcon, BookIcon } from './Icons';

/**
 * StudyInput Component
 * Allows students to enter a topic and optional notes.
 */
export const StudyInput = ({ onSubmit, loading }) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Example topics for quick testing
  const sampleTopics = [
    'Operating System Scheduling',
    'Object-Oriented Programming (OOP)',
    'Binary Search Trees',
    'HTTP & REST API Architecture'
  ];

  const handleSelectSample = (sampleTopic) => {
    setTopic(sampleTopic);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanTopic = topic.trim();
    const cleanNotes = notes.trim();

    // Validate that at least topic or notes is provided
    if (!cleanTopic && !cleanNotes) {
      setValidationError('Please enter a study topic or paste your study notes.');
      return;
    }

    setValidationError('');
    onSubmit(cleanTopic, cleanNotes);
  };

  return (
    <div className="card input-card">
      <div className="input-header">
        <h2 className="card-title">What do you want to study?</h2>
        <p className="card-description">
          Enter a topic or paste your lecture notes. Our AI will create summaries, key points, flashcards, and a practice quiz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="study-form">
        {/* Topic Input */}
        <div className="form-group">
          <label htmlFor="topic-input" className="form-label">
            Study Topic <span className="required-indicator">*</span>
          </label>
          <input
            id="topic-input"
            type="text"
            className="form-control"
            placeholder="e.g., Operating System Scheduling, Machine Learning..."
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={loading}
          />
        </div>

        {/* Quick Suggestions */}
        <div className="suggestions-container">
          <div className="suggestions-header">
            <LightbulbIcon size={16} className="icon-subtle" />
            <span className="suggestions-label">Try an example topic:</span>
          </div>
          <div className="chips-list">
            {sampleTopics.map((sample, index) => (
              <button
                key={index}
                type="button"
                className="chip-btn"
                onClick={() => handleSelectSample(sample)}
                disabled={loading}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Input */}
        <div className="form-group">
          <label htmlFor="notes-input" className="form-label">
            Paste your notes <span className="optional-badge">(optional)</span>
          </label>
          <textarea
            id="notes-input"
            rows="5"
            className="form-control"
            placeholder="Paste your syllabus, textbook excerpts, or lecture notes here..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={loading}
          />
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="alert alert-warning" role="alert">
            {validationError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-block btn-icon"
          disabled={loading}
        >
          <BookIcon size={18} />
          <span>{loading ? 'Generating Study Material...' : 'Generate Study Material'}</span>
        </button>
      </form>
    </div>
  );
};

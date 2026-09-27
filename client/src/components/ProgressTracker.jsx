import React from 'react';
import {
  BarChartIcon,
  CheckCircleIcon,
  FileTextIcon,
  LayersIcon,
  HelpCircleIcon
} from './Icons';

/**
 * ProgressTracker Component
 * Displays the session learning progress across all modules with vector indicators.
 */
export const ProgressTracker = ({
  materialGenerated = false,
  flashcardsViewed = 0,
  totalFlashcards = 0,
  quizCompleted = false,
  quizScore = null,
  totalQuizQuestions = 0
}) => {
  return (
    <div className="card progress-card">
      <div className="section-header">
        <span className="badge badge-progress">
          <BarChartIcon size={14} className="badge-icon" /> Session Tracker
        </span>
        <h3 className="section-title">Study Session Progress</h3>
      </div>

      <div className="progress-items-list">
        {/* Item 1: Material Generated */}
        <div className="progress-item">
          <div className="progress-status-icon-wrapper">
            <div className={`status-circle ${materialGenerated ? 'status-circle-complete' : 'status-circle-pending'}`}>
              {materialGenerated ? <CheckCircleIcon size={16} /> : <FileTextIcon size={16} />}
            </div>
          </div>
          <div className="progress-item-details">
            <span className="progress-item-name">Study Material Generated</span>
            <span className="progress-item-desc">Summary & Key points generated</span>
          </div>
          <span className="progress-badge badge-success">Completed</span>
        </div>

        {/* Item 2: Flashcards Viewed */}
        <div className="progress-item">
          <div className="progress-status-icon-wrapper">
            <div className={`status-circle ${flashcardsViewed > 0 ? 'status-circle-complete' : 'status-circle-pending'}`}>
              {flashcardsViewed > 0 ? <CheckCircleIcon size={16} /> : <LayersIcon size={16} />}
            </div>
          </div>
          <div className="progress-item-details">
            <span className="progress-item-name">Flashcards Reviewed</span>
            <span className="progress-item-desc">Active recall concept revision</span>
          </div>
          <span className="progress-badge badge-info">
            {flashcardsViewed} / {totalFlashcards} Cards
          </span>
        </div>

        {/* Item 3: Quiz Completed */}
        <div className="progress-item">
          <div className="progress-status-icon-wrapper">
            <div className={`status-circle ${quizCompleted ? 'status-circle-complete' : 'status-circle-pending'}`}>
              {quizCompleted ? <CheckCircleIcon size={16} /> : <HelpCircleIcon size={16} />}
            </div>
          </div>
          <div className="progress-item-details">
            <span className="progress-item-name">Practice Quiz</span>
            <span className="progress-item-desc">Multiple-choice concept test</span>
          </div>
          <span className={`progress-badge ${quizCompleted ? 'badge-success' : 'badge-neutral'}`}>
            {quizCompleted
              ? `Score: ${quizScore} / ${totalQuizQuestions}`
              : 'Not Started'}
          </span>
        </div>
      </div>
    </div>
  );
};

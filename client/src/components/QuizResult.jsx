import React from 'react';
import {
  TrophyIcon,
  RefreshIcon,
  BookIcon,
  CheckCircleIcon,
  LightbulbIcon
} from './Icons';

/**
 * QuizResult Component
 * Displays summary of quiz performance, score, percentage, and option to retest wrong questions.
 */
export const QuizResult = ({
  score,
  totalQuestions,
  wrongQuestions = [],
  onStartRetest,
  onRestartQuiz,
  onNewTopic
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectCount = totalQuestions - score;
  const isPerfectScore = score === totalQuestions;

  return (
    <div className="card result-card">
      <div className="result-header">
        <div className="result-icon-box">
          <TrophyIcon size={36} className="trophy-icon-svg" />
        </div>
        <span className="badge badge-result">Quiz Completed</span>
        <h2 className="result-title">Your Performance Summary</h2>
      </div>

      {/* Main Score Display */}
      <div className="score-summary-box">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-denom">/ {totalQuestions}</span>
        </div>
        <div className="percentage-display">
          <span className="percentage-value">{percentage}%</span>
          <span className="percentage-label">Overall Accuracy</span>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="stats-grid">
        <div className="stat-box stat-total">
          <span className="stat-label">Total Questions</span>
          <span className="stat-value">{totalQuestions}</span>
        </div>
        <div className="stat-box stat-correct">
          <span className="stat-label">Correct</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-box stat-incorrect">
          <span className="stat-label">Incorrect</span>
          <span className="stat-value">{incorrectCount}</span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="result-message">
        {isPerfectScore ? (
          <div className="alert alert-success alert-with-icon">
            <CheckCircleIcon size={20} className="alert-icon" />
            <div>
              <strong>Outstanding!</strong> You answered all questions correctly!
            </div>
          </div>
        ) : (
          <div className="alert alert-info alert-with-icon">
            <LightbulbIcon size={20} className="alert-icon" />
            <div>
              You have <strong>{incorrectCount}</strong> question{incorrectCount > 1 ? 's' : ''} to review and master.
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="result-actions">
        {!isPerfectScore && wrongQuestions.length > 0 && (
          <button
            type="button"
            className="btn btn-warning btn-block btn-icon"
            onClick={onStartRetest}
          >
            <RefreshIcon size={18} />
            <span>Retest Wrong Answers ({wrongQuestions.length})</span>
          </button>
        )}

        <div className="button-row">
          <button
            type="button"
            className="btn btn-outline flex-1 btn-icon"
            onClick={onRestartQuiz}
          >
            <RefreshIcon size={16} />
            <span>Retake Full Quiz</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-1 btn-icon"
            onClick={onNewTopic}
          >
            <BookIcon size={16} />
            <span>Study New Topic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

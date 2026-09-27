import React, { useState } from 'react';
import { QuizQuestion } from './QuizQuestion';
import {
  RefreshIcon,
  TargetIcon,
  CheckCircleIcon,
  LightbulbIcon
} from './Icons';

/**
 * Retest Component
 * Focuses exclusively on questions previously answered incorrectly.
 */
export const Retest = ({
  wrongQuestions = [],
  onRetestCompleted,
  onExitRetest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retestScore, setRetestScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [retestWrong, setRetestWrong] = useState([]);

  if (!wrongQuestions || wrongQuestions.length === 0) {
    return (
      <div className="card text-center">
        <p>No incorrect questions to retest! Great job!</p>
        <button type="button" className="btn btn-primary" onClick={onExitRetest}>
          Return to Overview
        </button>
      </div>
    );
  }

  const totalQuestions = wrongQuestions.length;
  const currentQuestion = wrongQuestions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleAnswerSubmitted = (questionObj, selectedOption, isCorrect) => {
    if (isCorrect) {
      setRetestScore((prev) => prev + 1);
    } else {
      setRetestWrong((prev) => [...prev, questionObj]);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      if (onRetestCompleted) {
        onRetestCompleted(retestScore, totalQuestions);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRetryAgain = () => {
    setCurrentIndex(0);
    setRetestScore(0);
    setIsFinished(false);
    setRetestWrong([]);
  };

  // If retest is completed, show retest summary
  if (isFinished) {
    const percentage = Math.round((retestScore / totalQuestions) * 100);
    const perfectScore = retestScore === totalQuestions;

    return (
      <div className="card result-card">
        <div className="result-header">
          <span className="badge badge-warning">
            <RefreshIcon size={14} className="badge-icon" /> Retest Results
          </span>
          <h2 className="result-title">Review Session Completed</h2>
        </div>

        <div className="score-summary-box">
          <div className="score-circle">
            <span className="score-number">{retestScore}</span>
            <span className="score-denom">/ {totalQuestions}</span>
          </div>
          <div className="percentage-display">
            <span className="percentage-value">{percentage}%</span>
            <span className="percentage-label">Retest Accuracy</span>
          </div>
        </div>

        <div className="result-message">
          {perfectScore ? (
            <div className="alert alert-success alert-with-icon">
              <CheckCircleIcon size={20} className="alert-icon" />
              <div>
                <strong>Mastered!</strong> You corrected all of your previous mistakes!
              </div>
            </div>
          ) : (
            <div className="alert alert-info alert-with-icon">
              <LightbulbIcon size={20} className="alert-icon" />
              <div>
                Keep going! You got {retestScore} out of {totalQuestions} right on this retry.
              </div>
            </div>
          )}
        </div>

        <div className="result-actions">
          {!perfectScore && retestWrong.length > 0 && (
            <button
              type="button"
              className="btn btn-warning btn-block btn-icon"
              onClick={handleRetryAgain}
            >
              <RefreshIcon size={18} />
              <span>Try Again ({retestWrong.length} remaining)</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-block btn-icon"
            onClick={onExitRetest}
          >
            <CheckCircleIcon size={18} />
            <span>Back to Quiz Summary</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="retest-container">
      <div className="retest-banner">
        <TargetIcon size={18} className="banner-icon" />
        <span className="badge badge-warning">Targeted Retest</span>
        <span className="banner-text">Reviewing missed questions</span>
      </div>

      <QuizQuestion
        questionData={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={totalQuestions}
        onAnswerSubmitted={handleAnswerSubmitted}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
};
